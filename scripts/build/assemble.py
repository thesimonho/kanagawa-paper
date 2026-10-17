"""Compatibility entry point for the root Node build (also used by releases)."""

import argparse
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def assemble(target: str, output: Path) -> Path:
    subprocess.run(
        [
            "node",
            "--import",
            "tsx",
            str(ROOT / "scripts/build/build.ts"),
            target,
            "--output",
            str(output.resolve()),
        ],
        cwd=ROOT,
        check=True,
    )
    return output if target == "all" else output / target


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("target", default="all", nargs="?")
    parser.add_argument("--output", type=Path, default=ROOT / "dist")
    args = parser.parse_args()
    assemble(args.target, args.output.resolve())
