"""Assemble installable target trees from checked-in source."""

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGETS = ("neovim", "vscode", "extras")


def assemble(target: str, output: Path) -> Path:
    if target not in TARGETS:
        raise ValueError(f"Unknown build target: {target}")
    destination = output / target
    if target == "extras":
        # Generate fully before updating checked-in output. A template failure
        # must not partially replace the existing extras.
        with tempfile.TemporaryDirectory(prefix="kanagawa-extras-") as temporary:
            generated = Path(temporary) / "extras"
            subprocess.run(
                [
                    "nvim",
                    "--headless",
                    "--clean",
                    "-l",
                    "scripts/build.lua",
                    str(generated),
                ],
                cwd=ROOT,
                check=True,
            )
            shutil.copy2(ROOT / "extras/README.md", generated / "README.md")
            if destination.resolve() != ROOT / "extras" and destination.exists():
                shutil.rmtree(destination)
            shutil.copytree(generated, destination, dirs_exist_ok=True)
        return destination
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    source = ROOT / "packages" / target
    if target == "neovim":
        for directory in ("lua", "colors", "doc"):
            shutil.copytree(
                source / directory,
                destination / directory,
                ignore=shutil.ignore_patterns("tags"),
            )
        shutil.copytree(ROOT / "shared/lua", destination / "lua", dirs_exist_ok=True)
    else:
        shutil.copytree(source / "assets", destination / "assets")
        shutil.copy2(source / "package.json", destination / "package.json")
        subprocess.run(
            [
                "nvim",
                "--headless",
                "--clean",
                "-l",
                "scripts/render-vscode.lua",
                str(destination / "themes"),
            ],
            cwd=ROOT,
            check=True,
        )
        for path in (destination / "themes").glob("*.json"):
            path.write_text(
                json.dumps(json.loads(path.read_text()), indent=2, sort_keys=True)
                + "\n"
            )
    for filename in ("README.md", "LICENSE"):
        shutil.copy2(ROOT / filename, destination / filename)
    shutil.copy2(source / "CHANGELOG.md", destination / "CHANGELOG.md")
    return destination


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("target", choices=(*TARGETS, "all"), default="all", nargs="?")
    parser.add_argument("--output", type=Path, default=ROOT / "dist")
    args = parser.parse_args()
    for target in TARGETS if args.target == "all" else (args.target,):
        print(assemble(target, args.output.resolve()))
