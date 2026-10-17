const fs = require("node:fs");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const { parseArgs } = require("node:util");

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      timeout: { type: "string", default: "20000" },
      variant: { type: "string", default: "canvas" },
      init: { type: "string" },
      "extensions-dir": { type: "string" },
    },
  });
  const [editor, fixture] = positionals;
  if (
    positionals.length !== 2 ||
    !["neovim", "vscode", "flatpak"].includes(editor) ||
    !require("./fixtures/manifest.json").some((item) => item.file === fixture)
  )
    throw new Error(
      "Usage: node headless.cjs neovim|vscode|flatpak sample.py|sample.ts|sample.rs [--init PATH] [--extensions-dir PATH] [--timeout MILLISECONDS] [--variant canvas|ink]",
    );
  const timeout = Number(values.timeout);
  if (!Number.isInteger(timeout) || timeout < 1000 || timeout > 120000)
    throw new Error("Timeout must be 1000..120000 milliseconds");
  if (!["canvas", "ink"].includes(values.variant))
    throw new Error("Variant must be canvas or ink");
  if (values.init && editor !== "neovim")
    throw new Error("--init is only for Neovim");
  if (values["extensions-dir"] && editor === "neovim")
    throw new Error("--extensions-dir is only for VS Code");
  const root = __dirname;
  const target = path.resolve(
    root,
    "../../dist",
    editor === "neovim" ? "neovim" : "vscode",
  );
  if (!fs.existsSync(target))
    throw new Error(
      `Build the ${editor === "neovim" ? "neovim" : "vscode"} target first`,
    );
  const runs = path.join(root, "reports");
  fs.mkdirSync(runs, { recursive: true });
  const run = fs.mkdtempSync(path.join(runs, `${editor}-`));
  const env = {
    ...process.env,
    THEME_AUDIT_ROOT: root,
    THEME_AUDIT_FIXTURE: fixture,
    THEME_AUDIT_TIMEOUT: String(timeout),
    THEME_AUDIT_VARIANT: values.variant,
    THEME_AUDIT_OUTPUT: run,
  };
  let command, args;
  if (editor === "neovim") {
    command = "nvim";
    args = ["--headless", "-n", "-i", "NONE"];
    if (values.init) args.push("-u", values.init);
    args.push(
      "-c",
      "lua dofile(vim.env.THEME_AUDIT_ROOT .. '/headless-neovim.lua')",
    );
  } else {
    const settingsDirectory = path.join(run, "profile", "User");
    fs.mkdirSync(settingsDirectory, { recursive: true });
    fs.writeFileSync(
      path.join(settingsDirectory, "settings.json"),
      JSON.stringify({
        "extensions.autoUpdate": false,
        "extensions.autoCheckUpdates": false,
        "update.mode": "none",
        "editor.semanticHighlighting.enabled": true,
      }),
    );
    command = "xvfb-run";
    args = [
      "-a",
      "-f",
      path.join(run, "Xauthority"),
      "-s",
      "-screen 0 1280x800x24",
    ];
    if (editor === "flatpak") {
      args.push(
        "flatpak",
        "run",
        "--instance-id-fd=3",
        "--die-with-parent",
        "--socket=x11",
        "--nosocket=wayland",
      );
      for (const key of [
        "THEME_AUDIT_ROOT",
        "THEME_AUDIT_FIXTURE",
        "THEME_AUDIT_TIMEOUT",
        "THEME_AUDIT_VARIANT",
        "THEME_AUDIT_OUTPUT",
      ])
        args.push(`--env=${key}=${env[key]}`);
      args.push("com.visualstudio.code");
    } else args.push("code");
    args.push(
      "--new-window",
      "--wait",
      "--disable-gpu",
      "--disable-workspace-trust",
      "--ozone-platform=x11",
      "--skip-welcome",
      "--skip-release-notes",
      "--user-data-dir=" + path.join(run, "profile"),
      "--extensionDevelopmentPath=" + target,
      "--extensionDevelopmentPath=" + root,
      "--extensionTestsPath=" + path.join(root, "headless-vscode.cjs"),
    );
    args.push(
      "--extensions-dir=" +
        (values["extensions-dir"]
          ? path.resolve(values["extensions-dir"])
          : path.join(run, "extensions")),
    );
    args.push(root);
  }
  process.stdout.write(`Run directory: ${run}\n`);
  const log = fs.openSync(path.join(run, "process.log"), "w");
  const instanceFile = path.join(run, "flatpak-instance");
  const instanceFd =
    editor === "flatpak" ? fs.openSync(instanceFile, "w") : null;
  let cleanupError;
  const stopInstance = () => {
    if (instanceFd === null) return;
    const instance = fs.readFileSync(instanceFile, "utf8").trim();
    if (/^[0-9]+$/.test(instance)) {
      const result = spawnSync("flatpak", ["kill", instance], {
        encoding: "utf8",
        timeout: 3000,
      });
      if (
        result.error ||
        (result.status !== 0 && !result.stderr?.includes("not running"))
      )
        cleanupError = `Could not stop audit Flatpak instance ${instance}: ${result.error?.message || result.stderr}`;
    }
  };
  const child = spawn(command, args, {
    env,
    stdio:
      instanceFd === null
        ? ["ignore", log, log]
        : ["ignore", log, log, instanceFd],
    detached: true,
  });
  const kill = () => {
    try {
      if (child.pid) process.kill(-child.pid, "SIGKILL");
    } catch (error) {
      if (error.code !== "ESRCH") throw error;
    }
  };
  const interrupt = () => {
    stopInstance();
    kill();
  };
  process.once("SIGINT", interrupt);
  process.once("SIGTERM", interrupt);
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    stopInstance();
    kill();
  }, timeout + 20000);
  let code;
  try {
    code = await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("exit", resolve);
    });
  } finally {
    clearTimeout(timer);
    process.removeListener("SIGINT", interrupt);
    process.removeListener("SIGTERM", interrupt);
    stopInstance();
    if (instanceFd !== null) fs.closeSync(instanceFd);
    fs.closeSync(log);
  }
  if (cleanupError) throw new Error(cleanupError);
  const failureFile = path.join(run, "failure.json");
  if (fs.existsSync(failureFile))
    throw new Error(
      `${JSON.parse(fs.readFileSync(failureFile, "utf8")).error} See ${run}/profile/logs.`,
    );
  const output = path.join(
    run,
    `${editor === "neovim" ? "neovim" : "vscode"}-${fixture}.json`,
  );
  if (timedOut || code !== 0 || !fs.existsSync(output))
    throw new Error(
      `Collection failed${timedOut ? " (process timeout)" : ` (exit ${code})`}. See ${run}/process.log and profile/logs.`,
    );
  process.stdout.write(`Report: ${output}\n`);
}
main().catch((error) => {
  process.stderr.write(error.message + "\n");
  process.exitCode = 1;
});
