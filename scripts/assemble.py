"""Compatibility entry point for the root Node build (also used by releases)."""
import argparse
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGETS = ("neovim", "vscode", "extras", "zed")

def assemble(target: str, output: Path) -> Path:
    if target not in TARGETS:
        raise ValueError(f"Unknown build target: {target}")
    subprocess.run(["node", "--import", "tsx", str(ROOT / "scripts/build.ts"), target,
                    "--output", str(output.resolve())], cwd=ROOT, check=True)
    return output / target

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("target", choices=(*TARGETS, "all"), default="all", nargs="?")
    parser.add_argument("--output", type=Path, default=ROOT / "dist")
    args = parser.parse_args()
    for target in TARGETS if args.target == "all" else (args.target,):
        print(assemble(target, args.output.resolve()))
