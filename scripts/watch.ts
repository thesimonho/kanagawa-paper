import chokidar from "chokidar";
import { spawn, type ChildProcess } from "node:child_process";
import { join, relative, resolve } from "node:path";
import { options, root } from "./build.ts";

const args = process.argv.slice(2);
const opts = options([...args]);
const sourceRoots = [
  "shared",
  "scripts",
  "generators",
  "packages",
  "README.md",
  "LICENSE",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "extras/README.md",
];
let child: ChildProcess | undefined;
let dirty = false;
let timer: NodeJS.Timeout | undefined;
let stopping = false;
function relevant(path: string) {
  const name = relative(root, path).replaceAll("\\", "/");
  if (name.startsWith("scripts/release/")) return false;
  if (opts.target === "all") return true;
  if (name.startsWith("packages/"))
    return name.startsWith(`packages/${opts.target}/`);
  if (name.startsWith("generators/"))
    return (
      opts.target === "extras" &&
      (!opts.only ||
        !name.startsWith("generators/extras/") ||
        name === `generators/extras/${opts.only}.ts`)
    );
  return true;
}
function launch() {
  if (stopping || child || !dirty) return;
  dirty = false;
  process.stdout.write("[build] start\n");
  child = spawn(
    process.execPath,
    ["--import", "tsx", join(root, "scripts/build.ts"), ...args],
    { cwd: root, stdio: "inherit" },
  );
  child.on("error", (error) => console.error(error.message));
  child.on("close", (code) => {
    child = undefined;
    if (code === 0) process.stdout.write("[build] ready\n");
    else
      console.error(
        "[build] failed; waiting for source changes (previous output retained)",
      );
    if (stopping) process.exit(0);
    if (dirty) schedule();
  });
}
function schedule() {
  dirty = true;
  clearTimeout(timer);
  timer = setTimeout(launch, 120);
}
const watcher = chokidar.watch(
  sourceRoots.map((path) => join(root, path)),
  {
    ignoreInitial: true,
    ignored: (path) => {
      const name = path.replaceAll("\\", "/");
      const output = resolve(opts.output).replaceAll("\\", "/");
      // A repository-root generation output must not hide maintained inputs.
      return (
        /\/(node_modules|\.git|\.tests)(\/|$)/.test(name) ||
        name.startsWith(join(root, "dist").replaceAll("\\", "/") + "/") ||
        (output !== root && name.startsWith(output + "/")) ||
        /\/doc\/(tags|kanagawa-paper\.nvim\.txt)$/.test(name)
      );
    },
  },
);
watcher.on("ready", schedule);
watcher.on("all", (_event, path) => {
  if (relevant(path)) schedule();
});
watcher.on("error", (error) => console.error(error));
async function stop() {
  stopping = true;
  clearTimeout(timer);
  await watcher.close();
  if (!child) process.exit(0);
  // Let the active build finish its publication/cleanup, then exit in close.
}
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
