"""The Python release wrapper delegates to Node and propagates build failures."""

import importlib.util
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location(
    "assemble", ROOT / "scripts/build/assemble.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class AssemblyWrapper(unittest.TestCase):
    def test_delegation_and_failure(self):
        output = Path("relative output")
        with patch.object(module.subprocess, "run") as run:
            self.assertEqual(module.assemble("zed", output), output / "zed")
            run.assert_called_once_with(
                [
                    "node",
                    "--import",
                    "tsx",
                    str(ROOT / "scripts/build/build.ts"),
                    "zed",
                    "--output",
                    str(output.resolve()),
                ],
                cwd=ROOT,
                check=True,
            )
            run.side_effect = subprocess.CalledProcessError(1, "node")
            with self.assertRaises(subprocess.CalledProcessError):
                module.assemble("zed", output)
        # Node owns registration: the wrapper must pass through future names and all.
        with patch.object(module.subprocess, "run") as run:
            module.assemble("future-target", output)
            self.assertEqual(run.call_args.args[0][4], "future-target")
        with patch.object(module.subprocess, "run") as run:
            self.assertEqual(module.assemble("all", output), output)
            self.assertEqual(run.call_count, 1)
            self.assertEqual(run.call_args.args[0][4], "all")
