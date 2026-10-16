const fs = require("node:fs");
const path = require("node:path");
const { probesFor, compare } = require("./core.cjs");
try {
  const [command, ...args] = process.argv.slice(2);
  if (command === "validate" && args.length === 0) {
    const fixtures = require("./fixtures/manifest.json");
    for (const fixture of fixtures) {
      const source = fs.readFileSync(
        path.join(__dirname, "fixtures", fixture.file),
        "utf8",
      );
      process.stdout.write(
        `${fixture.file}: ${probesFor(source, fixture).length} probes\n`,
      );
    }
  } else if (command === "compare" && args.length === 2) {
    const reports = args.map((file) =>
      JSON.parse(fs.readFileSync(file, "utf8")),
    );
    process.stdout.write(JSON.stringify(compare(...reports), null, 2) + "\n");
  } else
    throw new Error(
      "Usage: node cli.cjs validate | compare NEOVIM.json TARGET.json",
    );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
