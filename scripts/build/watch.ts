import chokidar from "chokidar";
import { spawn, type ChildProcess } from "node:child_process";
import { join, relative, resolve } from "node:path";
import { options, root, targets, type Target } from "./build.ts";

const args = process.argv.slice(2);
const opts = options([...args]);
const sourceRoots = [
  "shared",
  "scripts",
  "packages",
  "README.md",
  "LICENSE",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "extras/README.md",
];
let child: ChildProcess | undefined;
const selected = opts.target === "all" ? targets : [opts.target];
const pending = new Set<Target>();
let timer: NodeJS.Timeout | undefined;
let stopping = false;
function affected(path: string): Target[] {
  const name = relative(root, path).replaceAll("\\", "/");
  if (name.startsWith("scripts/ci/release/")) return [];
  if (name.startsWith("packages/extras/") || name === "extras/README.md")
    return selected.filter(
      (target) =>
        target === "extras" &&
        (!opts.only ||
          !name.startsWith("packages/extras/adapters/") ||
          name === `packages/extras/adapters/${opts.only}.ts`),
    );
  if (name.startsWith("packages/"))
    return selected.filter((target) => name.startsWith(`packages/${target}/`));
  return selected;
}
function launch() {
  if (stopping || child || !pending.size) return;
  const target =
    pending.size === targets.length ? "all" : pending.values().next().value!;
  if (target === "all") pending.clear();
  else pending.delete(target);
  const buildArgs = [
    target,
    "--output",
    opts.output,
    ...(opts.only ? ["--only", opts.only] : []),
  ];
  process.stdout.write("[build] start\n");
  child = spawn(
    process.execPath,
    ["--import", "tsx", join(root, "scripts/build/build.ts"), ...buildArgs],
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
    if (pending.size) schedule([]);
  });
}
function schedule(changed: Target[]) {
  for (const target of changed) pending.add(target);
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
watcher.on("ready", () => schedule(selected));
watcher.on("all", (_event, path) => {
  const changed = affected(path);
  if (changed.length) schedule(changed);
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
