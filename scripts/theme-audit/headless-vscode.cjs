const vscode = require("vscode");
const path = require("node:path");
const fs = require("node:fs");
const { collect, writeReport } = require("./vscode.cjs");
async function run() {
  const fixture = process.env.THEME_AUDIT_FIXTURE;
  const timeout = Number(process.env.THEME_AUDIT_TIMEOUT);
  const theme = `Kanagawa Paper ${process.env.THEME_AUDIT_VARIANT === "ink" ? "Ink" : "Canvas"}`;
  await vscode.workspace
    .getConfiguration("workbench")
    .update("colorTheme", theme, vscode.ConfigurationTarget.Global);
  const document = await vscode.workspace.openTextDocument(
    path.join(__dirname, "fixtures", fixture),
  );
  await vscode.window.showTextDocument(document);
  const deadline = Date.now() + timeout;
  let report;
  while (Date.now() < deadline) {
    report = await collect(document);
    if (
      report.collection.semanticProviderAvailable &&
      report.collection.tokenCount > 0
    ) {
      report.collection.mode = "virtual-display";
      writeReport(report, process.env.THEME_AUDIT_OUTPUT);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(
    `No semantic tokens for ${fixture} within ${timeout}ms. Check language extension activation in the run logs.`,
  );
}

exports.run = async function () {
  try {
    await run();
  } catch (error) {
    fs.writeFileSync(
      path.join(process.env.THEME_AUDIT_OUTPUT, "failure.json"),
      JSON.stringify({ error: error.message }),
    );
    throw error;
  }
};
