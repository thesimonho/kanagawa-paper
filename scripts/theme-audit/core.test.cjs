const { test } = require("node:test");
const assert = require("node:assert/strict");
const { decodeTokens, probesFor, makeReport, compare } = require("./core.cjs");

test("decode relative UTF-16 positions and modifier bits", () => {
  assert.deepEqual(
    decodeTokens([1, 2, 3, 0, 3, 0, 4, 2, 1, 0, 2, 1, 1, 0, 0], {
      tokenTypes: ["class", "module"],
      tokenModifiers: ["builtin", "typeHint"],
    }),
    [
      {
        row: 1,
        column: 2,
        length: 3,
        type: "class",
        modifiers: ["builtin", "typeHint"],
      },
      { row: 1, column: 6, length: 2, type: "module", modifiers: [] },
      { row: 3, column: 1, length: 1, type: "class", modifiers: [] },
    ],
  );
  assert.throws(() =>
    decodeTokens([0], { tokenTypes: [], tokenModifiers: [] }),
  );
});

test("ambiguous fixture anchors fail instead of collecting wrong positions", () => {
  assert.throws(() =>
    probesFor("abc\nabc", { probes: [{ id: "x", line: "abc", text: "a" }] }),
  );
});

test("comparison distinguishes missing evidence, matches and differences", () => {
  const fixture = { file: "sample.py" };
  const baseline = makeReport("neovim", "test", "Canvas", "abc", fixture, [
    { id: "x", text: "abc", row: 0, column: 0, effective: null },
  ]);
  const target = makeReport("vscode", "test", "Canvas", "abc", fixture, [
    { id: "x", text: "abc", row: 0, column: 0, effective: null },
  ]);
  assert.equal(compare(baseline, target)[0].status, "unknown");
  const style = {
    foreground: "#ABCDEF",
    background: "#000000",
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  };
  baseline.observations[0].effective = style;
  target.observations[0].effective = { ...style, foreground: "#abcdef" };
  assert.equal(compare(baseline, target)[0].status, "match");
  target.observations[0].effective.bold = true;
  assert.deepEqual(compare(baseline, target)[0].differences, ["bold"]);
  assert.throws(() => compare(baseline, { ...target, sourceHash: "changed" }));
  assert.throws(() => compare(baseline, { ...target, theme: "Ink" }));
});

test("comparison preserves missing probes and rejects changed positions", () => {
  const style = {
    foreground: "#abcdef",
    background: "#000000",
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  };
  const observation = {
    id: "module",
    row: 0,
    column: 7,
    text: "random",
    effective: style,
  };
  const baseline = makeReport(
    "neovim",
    "test",
    "Canvas",
    "import random",
    { file: "sample.py" },
    [observation],
  );
  const target = {
    ...baseline,
    editor: "vscode",
    observations: [{ ...observation, column: 0, text: "import" }],
  };
  assert.equal(compare(baseline, target)[0].status, "unknown");
  assert.equal(
    compare({ ...baseline, observations: [] }, target)[0].status,
    "unknown",
  );
  assert.equal(
    compare(baseline, { ...target, observations: [] })[0].status,
    "unknown",
  );
});
