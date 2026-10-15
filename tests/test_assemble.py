"""The Python release wrapper delegates to Node and propagates build failures."""

import importlib.util
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("assemble", ROOT / "scripts/assemble.py")
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
                    str(ROOT / "scripts/build.ts"),
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
        with patch.object(module.subprocess, "run") as run:
            with self.assertRaises(ValueError):
                module.assemble("unknown", output)
            run.assert_not_called()
