const vscode = require("vscode");
const fs = require("node:fs");
const path = require("node:path");
const { probesFor, decodeTokens, makeReport } = require("./core.cjs");

async function collect(document) {
  const fixtures = require("./fixtures/manifest.json");
  const fixture = fixtures.find(
    (item) =>
      path.resolve(__dirname, "fixtures", item.file) === document.uri.fsPath,
  );
  if (!fixture)
    throw new Error("Open a file from the audit fixtures directory");
  if (document.isDirty) throw new Error("Save the fixture before collecting");
  if (document.languageId !== fixture.language)
    throw new Error("Unexpected document language");
  const source = document.getText();
  // Invoke after the language extension is ready. No tokens is evidence, not success.
  const legend = await vscode.commands.executeCommand(
    "vscode.provideDocumentSemanticTokensLegend",
    document.uri,
  );
  const result =
    legend &&
    (await vscode.commands.executeCommand(
      "vscode.provideDocumentSemanticTokens",
      document.uri,
    ));
  const tokens = result ? decodeTokens(result.data, legend) : [];
  const observations = probesFor(source, fixture).map((probe) => ({
    ...probe,
    classifications: tokens.filter(
      (token) =>
        token.row === probe.row &&
        token.column <= probe.column &&
        token.column + token.length > probe.column,
    ),
    effective: null,
  }));
  const configuration = vscode.workspace.getConfiguration("workbench");
  const report = makeReport(
    "vscode",
    vscode.version,
    configuration.get("colorTheme"),
    source,
    fixture,
    observations,
  );
  report.collection = {
    semanticProviderAvailable: Boolean(legend && result),
    tokenCount: tokens.length,
    semanticHighlighting: vscode.workspace
      .getConfiguration("editor", document)
      .get("semanticHighlighting.enabled"),
    activeExtensions: vscode.extensions.all
      .filter((extension) => extension.isActive)
      .map((extension) => ({
        id: extension.id,
        version: extension.packageJSON.version,
      })),
  };
  return report;
}
function writeReport(report, directory = path.join(__dirname, "reports")) {
  fs.mkdirSync(directory, { recursive: true });
  const output = path.join(directory, `vscode-${report.fixture}.json`);
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
  return output;
}
exports.collect = collect;
exports.writeReport = writeReport;
exports.activate = function (context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("themeAudit.collect", async () => {
      try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) throw new Error("Open an audit fixture first");
        const report = await collect(editor.document);
        const output = writeReport(report);
        await vscode.window.showTextDocument(
          await vscode.workspace.openTextDocument(output),
        );
        if (!report.collection.semanticProviderAvailable)
          vscode.window.showWarningMessage(
            "No document semantic tokens returned. Check language extension activation; rerun when ready.",
          );
        return report;
      } catch (error) {
        vscode.window.showErrorMessage(`Theme Audit: ${error.message}`);
      }
    }),
  );
};
