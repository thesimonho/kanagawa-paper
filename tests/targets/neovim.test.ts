import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build, root } from "../../scripts/build/build.ts";
import { hash, files } from "../support/files.ts";
import { sorted } from "../../scripts/build/output.ts";
import { spawnSync } from "node:child_process";
import { resolveTheme } from "../../shared/color/evaluate.ts";
import { neovimRoles } from "../../packages/neovim/adapter.ts";
import { ink } from "../../shared/themes/ink.ts";
import { canvas } from "../../shared/themes/canvas.ts";
import { syntaxStyles } from "../../shared/styles.ts";
const baseline = JSON.parse(
  await readFile(new URL("../fixtures/colors.json", import.meta.url), "utf8"),
);
for (const [name, definition] of Object.entries({ ink, canvas })) {
  test(`${name}: all existing default roles retain their colors`, () => {
    const resolved = resolveTheme(neovimRoles(definition));
    assert.deepEqual(resolved.ui.line_numbers, {
      default: baseline[name].theme.ui.nontext,
      active: baseline[name].theme.diag.warning,
    });
    const { line_numbers, ...ui } = resolved.ui;
    assert.deepEqual(
      { ...resolved, ui: { ...ui, bg_gutter: "none" } },
      baseline[name].theme,
    );
  });
}
test("installed Neovim preserves baseline highlights and customization semantics", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa runtime "));
  try {
    const tree = await build("neovim", output);
    const snapshot = join(output, "runtime.json");
    const result = spawnSync(
      "nvim",
      [
        "--headless",
        "--clean",
        "-l",
        join(root, "tests/neovim/runtime_snapshot.lua"),
        tree,
        snapshot,
      ],
      {
        encoding: "utf8",
        env: { ...process.env, NVIM_LOG_FILE: join(output, "nvim.log") },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const actual: Record<
      string,
      { colors: { theme: { ui: Record<string, unknown> } } }
    > = JSON.parse(await readFile(snapshot, "utf8"));
    const expected = JSON.parse(
      await readFile(
        new URL("../fixtures/runtime.json", import.meta.url),
        "utf8",
      ),
    );
    for (const [name, value] of Object.entries(actual)) {
      // Compare the original role surface; dedicated tests cover added roles.
      delete value.colors.theme.ui.line_numbers;
      assert.equal(hash(JSON.stringify(sorted(value))), expected[name], name);
    }
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});

test("Neovim regeneration restores missing and stale generated modules", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa generated "));
  try {
    const tree = await build("neovim", output);
    const styles = join(output, "styles.json");
    const result = spawnSync(
      "nvim",
      [
        "--headless",
        "--clean",
        "-l",
        join(root, "tests/neovim/style_defaults.lua"),
        tree,
        styles,
      ],
      {
        encoding: "utf8",
        env: { ...process.env, NVIM_LOG_FILE: join(output, "nvim.log") },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(await readFile(styles, "utf8")), syntaxStyles);
    const modules = join(tree, "lua/kanagawa-paper");
    for (const name of [
      "palette.lua",
      "themes/ink.lua",
      "themes/canvas.lua",
      "generated_types.lua",
      "style_defaults.lua",
    ])
      assert.match(
        await readFile(join(modules, name), "utf8"),
        /^-- Generated from shared TypeScript/,
      );
    const expected = await files(tree);
    await rm(join(modules, "palette.lua"));
    await writeFile(join(modules, "themes/ink.lua"), "stale");
    await writeFile(join(modules, "obsolete-generated.lua"), "stale");
    await build("neovim", output);
    assert.deepEqual(await files(tree), expected);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});

test("Neovim distribution loads both variants and includes help and README", async () => {
  const output = await mkdtemp(join(tmpdir(), "kanagawa installable "));
  try {
    const tree = await build("neovim", output);
    await assert.rejects(access(join(tree, "lua/kanagawa-paper/extras")), {
      code: "ENOENT",
    });
    const result = spawnSync(
      "nvim",
      [
        "--headless",
        "--clean",
        "-l",
        join(root, "tests/neovim/installable.lua"),
        tree,
      ],
      {
        cwd: output,
        encoding: "utf8",
        env: { ...process.env, NVIM_LOG_FILE: join(output, "nvim.log") },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      await readFile(join(tree, "README.md"), "utf8"),
      await readFile(join(root, "README.md"), "utf8"),
    );
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
