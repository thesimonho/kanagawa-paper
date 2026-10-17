// Run through VS Code --extensionTestsPath, in a disposable copy of this directory.
const vscode = require("vscode");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
exports.run = async function () {
  const provider = vscode.languages.registerDocumentSemanticTokensProvider(
    { language: "python", scheme: "file" },
    {
      provideDocumentSemanticTokens() {
        return new vscode.SemanticTokens(new Uint32Array([0, 7, 6, 0, 1]));
      },
    },
    new vscode.SemanticTokensLegend(["module"], ["builtin"]),
  );
  try {
    await vscode.extensions
      .getExtension("local-tools.theme-audit-tools")
      .activate();
    const document = await vscode.workspace.openTextDocument(
      path.join(__dirname, "fixtures/sample.py"),
    );
    await vscode.window.showTextDocument(document);
    await vscode.commands.executeCommand("themeAudit.collect");
    const report = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "reports/vscode-sample.py.json"),
        "utf8",
      ),
    );
    assert.equal(report.collection.semanticProviderAvailable, true);
    assert.equal(
      report.observations.find((item) => item.id === "module")
        .classifications[0].type,
      "module",
    );
    assert.equal(report.observations[0].effective, null);
  } finally {
    provider.dispose();
  }
};
