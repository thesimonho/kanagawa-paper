import test from "node:test";
import assert from "node:assert/strict";
import {
  cp,
  mkdtemp,
  readFile,
  writeFile,
  symlink,
  mkdir,
  rm,
} from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { root } from "../../scripts/build/build.ts";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
test(
  "watch builds with Node only, survives invalid source, and loads fresh modules",
  { timeout: 60000 },
  async () => {
    const temporary = await mkdtemp(join(tmpdir(), "kanagawa watch "));
    const source = join(temporary, "source"),
      output = join(temporary, "output");
    await mkdir(source);
    for (const name of [
      "shared",
      "packages",
      "generators",
      "scripts",
      "extras/README.md",
      "README.md",
      "LICENSE",
      "package.json",
      "tsconfig.json",
    ])
      await cp(join(root, name), join(source, name), {
        recursive: true,
        filter: (path) =>
          !path.includes("node_modules") && !path.includes("__pycache__"),
      });
    await symlink(
      join(root, "node_modules"),
      join(source, "node_modules"),
      "dir",
    );
    const bin = join(temporary, "bin");
    await mkdir(bin);
    await symlink(process.execPath, join(bin, "node"));
    let log = "";
    const child = spawn(
      process.execPath,
      [
        "--import",
        "tsx",
        "scripts/build/watch.ts",
        "extras",
        "--only",
        "kitty",
        "--output",
        output,
      ],
      {
        cwd: source,
        env: { ...process.env, PATH: bin },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    child.stdout.on("data", (data) => {
      log += data;
    });
    child.stderr.on("data", (data) => {
      log += data;
    });
    const closed = new Promise((resolve) => child.once("close", resolve));
    async function waitFor(pattern: string, from = 0) {
      const end = Date.now() + 15000;
      while (!log.slice(from).includes(pattern)) {
        assert.equal(child.exitCode, null, log);
        if (Date.now() > end)
          assert.fail(`Timed out waiting for ${pattern}: ${log}`);
        await delay(50);
      }
    }
    try {
      await waitFor("[build] ready");
      const marker = join(output, ".extras-build.json");
      const original = await readFile(marker, "utf8");
      const template = join(source, "generators/extras/kitty.ts");
      const originalSource = await readFile(template, "utf8");
      let offset = log.length;
      await writeFile(
        template,
        originalSource + "\nconst broken: never = 1;\n",
      );
      await waitFor("[build] failed", offset);
      assert.equal(await readFile(marker, "utf8"), original);
      offset = log.length;
      await writeFile(
        template,
        originalSource.replace("# Tabs", "# fresh module\n# Tabs"),
      );
      await waitFor("[build] ready", offset);
      assert.notEqual(await readFile(marker, "utf8"), original);
      assert.match(
        await readFile(
          join(output, "extras/kitty/kanagawa-paper-ink.conf"),
          "utf8",
        ),
        /fresh module/,
      );
      // Unrelated extras are excluded by --only.
      offset = log.length;
      await writeFile(
        join(source, "generators/extras/foot.ts"),
        "// unrelated\n" +
          (await readFile(join(source, "generators/extras/foot.ts"), "utf8")),
      );
      await delay(500);
      assert.equal(log.slice(offset), "");
    } finally {
      child.kill("SIGTERM");
      await closed;
      await rm(temporary, { recursive: true, force: true });
    }
  },
);
