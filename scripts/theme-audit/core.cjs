const crypto = require("node:crypto");

function probesFor(source, fixture) {
  if (/[^\x00-\x7f]/.test(source))
    throw new Error("Audit fixtures must be ASCII");
  const lines = source.split(/\r?\n/);
  return fixture.probes.map((probe) => {
    const matches = lines.flatMap((line, row) =>
      line.includes(probe.line) ? [row] : [],
    );
    if (matches.length !== 1) throw new Error(`Ambiguous line for ${probe.id}`);
    const row = matches[0];
    const column = lines[row].indexOf(probe.text);
    if (column < 0 || lines[row].indexOf(probe.text, column + 1) >= 0)
      throw new Error(`Ambiguous text for ${probe.id}`);
    return { id: probe.id, text: probe.text, row, column };
  });
}

function decodeTokens(data, legend) {
  if (data.length % 5) throw new Error("Malformed semantic token data");
  let row = 0,
    column = 0;
  const tokens = [];
  for (let i = 0; i < data.length; i += 5) {
    row += data[i];
    column = data[i] === 0 ? column + data[i + 1] : data[i + 1];
    const type = legend.tokenTypes[data[i + 3]];
    if (!type) throw new Error("Semantic token type absent from legend");
    tokens.push({
      row,
      column,
      length: data[i + 2],
      type,
      modifiers: legend.tokenModifiers.filter(
        (_, bit) => (data[i + 4] >>> bit) & 1,
      ),
    });
  }
  return tokens;
}

function makeReport(editor, version, theme, source, fixture, observations) {
  return {
    schemaVersion: 1,
    editor,
    version,
    theme,
    fixture: fixture.file,
    sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    observations,
  };
}

// Compare only explicitly recorded effective styles. Raw classifications are evidence,
// not a portable substitute for each editor's rendering and precedence rules.
function compare(baseline, target) {
  for (const report of [baseline, target]) {
    if (report.schemaVersion !== 1 || !Array.isArray(report.observations))
      throw new Error("Unsupported audit report");
    const ids = report.observations.map((item) => item.id);
    if (new Set(ids).size !== ids.length) throw new Error("Duplicate probe id");
  }
  if (
    baseline.fixture !== target.fixture ||
    baseline.sourceHash !== target.sourceHash
  )
    throw new Error("Reports must use the same fixture contents");
  if (baseline.editor !== "neovim") throw new Error("Baseline must be Neovim");
  if (baseline.theme !== target.theme)
    throw new Error("Reports must name the same theme variant");
  const fields = [
    "foreground",
    "background",
    "bold",
    "italic",
    "underline",
    "strikethrough",
  ];
  const complete = (style) =>
    style &&
    fields.every((key) =>
      key === "foreground" || key === "background"
        ? /^#[0-9a-f]{6}$/i.test(style[key])
        : typeof style[key] === "boolean",
    );
  const baselineById = new Map(
    baseline.observations.map((item) => [item.id, item]),
  );
  const targetById = new Map(
    target.observations.map((item) => [item.id, item]),
  );
  const ids = new Set([...baselineById.keys(), ...targetById.keys()]);
  return [...ids].map((id) => {
    const item = baselineById.get(id);
    const other = targetById.get(id);
    if (!item || !other)
      return { id, status: "unknown", reason: "Probe missing from one report" };
    if (
      !Number.isInteger(item.row) ||
      !Number.isInteger(item.column) ||
      item.row < 0 ||
      item.column < 0 ||
      typeof item.text !== "string" ||
      item.row !== other.row ||
      item.column !== other.column ||
      item.text !== other.text
    )
      return {
        id,
        status: "unknown",
        reason: "Probe identity or position differs",
      };
    if (!complete(item.effective) || !complete(other.effective))
      return {
        id,
        status: "unknown",
        reason: "Effective style evidence missing or incomplete",
      };
    const differences = fields.filter(
      (key) =>
        String(item.effective[key]).toLowerCase() !==
        String(other.effective[key]).toLowerCase(),
    );
    return {
      id: item.id,
      status: differences.length ? "different" : "match",
      differences,
    };
  });
}
module.exports = { probesFor, decodeTokens, makeReport, compare };
