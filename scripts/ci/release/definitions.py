"""Discover explicit release opt-ins from the existing PSR configurations."""

import json
import re
import tomllib
from dataclasses import dataclass
from pathlib import Path, PurePosixPath

PROFILES = {"git-archive": "tar", "vscode-marketplace": "vsix"}


@dataclass(frozen=True)
class Definition:
    config: str
    profile: str
    version_file: str
    version_key: str
    changelog: str
    marketplace: tuple[str, str] | None = None

    @property
    def extension(self) -> str:
        return PROFILES[self.profile]

    def version(self, root: Path) -> str:
        path = root / self.version_file
        if path.suffix == ".json":
            value = json.loads(path.read_text()).get(self.version_key)
        else:
            matches = re.findall(
                rf'^\s*{re.escape(self.version_key)}\s*=\s*"([^"\n]+)"\s*$',
                path.read_text(),
                re.MULTILINE,
            )
            value = matches[0] if len(matches) == 1 else None
        if not isinstance(value, str) or not re.fullmatch(r"\d+\.\d+\.\d+", value):
            raise ValueError(f"Invalid release version in {self.version_file}")
        return value


def package_path(value: str, target: str) -> str:
    if not isinstance(value, str):
        raise TypeError(f"Missing release path for {target}")
    path = PurePosixPath(value)
    if (
        path.is_absolute()
        or ".." in path.parts
        or path.parts[:2] != ("packages", target)
        or len(path.parts) < 3
    ):
        raise ValueError(f"Release path must be within packages/{target}: {value}")
    return str(path)


def discover(root: Path) -> dict[str, Definition]:
    definitions = {}
    for config in sorted((root / "scripts/ci/release").glob("*.toml")):
        target = config.stem
        if not re.fullmatch(r"[a-z][a-z0-9-]*", target):
            raise ValueError(f"Invalid release target name: {target}")
        data = tomllib.loads(config.read_text())
        profile = data.get("kanagawa", {}).get("release", {}).get("profile")
        if not isinstance(profile, str) or profile not in PROFILES:
            raise ValueError(f"Missing or unsupported release profile: {target}")
        semantic = data["semantic_release"]
        declarations = semantic.get("version_variables", [])
        if len(declarations) != 1 or not isinstance(declarations[0], str):
            raise ValueError(f"Expected one version variable for {target}")
        parts = declarations[0].split(":")
        if len(parts) != 2 or not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", parts[1]):
            raise ValueError(f"Unsupported version variable for {target}")
        version_file = package_path(parts[0], target)
        changelog = package_path(
            semantic["changelog"]["default_templates"]["changelog_file"], target
        )
        if semantic.get("tag_format") != f"{target}-source-{{version}}":
            raise ValueError(f"Invalid source tag format for {target}")
        for source in (version_file, changelog):
            if not (root / source).resolve().is_relative_to(root.resolve()):
                raise ValueError(f"Release path escapes the source root: {source}")
        marketplace = None
        if profile == "vscode-marketplace":
            package = json.loads((root / version_file).read_text())
            identity = (package.get("publisher"), package.get("name"))
            if not all(
                isinstance(value, str)
                and re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9-]*", value)
                for value in identity
            ):
                raise ValueError(f"Invalid Marketplace package identity for {target}")
            marketplace = identity
        definition = Definition(
            str(config.relative_to(root)),
            profile,
            version_file,
            parts[1],
            changelog,
            marketplace,
        )
        definition.version(root)
        if "<!-- version list -->" not in (root / changelog).read_text():
            raise ValueError(f"Missing changelog marker for {target}")
        definitions[target] = definition
    if not definitions:
        raise ValueError("No release definitions found")
    return definitions
