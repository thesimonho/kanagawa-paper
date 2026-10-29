"""Reviewed terminal outcomes for immutable Marketplace candidates."""

import json
import re
from pathlib import Path


def load(path: Path) -> dict[tuple[str, str, str], dict]:
    value = json.loads(path.read_text())
    if (
        not isinstance(value, dict)
        or value.get("schema") != 1
        or not isinstance(value.get("rejections"), list)
    ):
        raise ValueError("Invalid rejection declarations")
    result = {}
    fields = {
        "source",
        "target",
        "version",
        "candidate_sha256",
        "reason",
        "evidence_url",
    }
    for item in value["rejections"]:
        if (
            not isinstance(item, dict)
            or set(item) != fields
            or any(not isinstance(v, str) or not v.strip() for v in item.values())
            or not re.fullmatch(r"[a-f0-9]{40}", item["source"])
            or not re.fullmatch(r"\d+\.\d+\.\d+", item["version"])
            or not re.fullmatch(r"[a-f0-9]{64}", item["candidate_sha256"])
            or not item["evidence_url"].startswith("https://")
        ):
            raise ValueError("Invalid rejection declaration")
        identity = (item["source"], item["target"], item["version"])
        if identity in result:
            raise ValueError("Duplicate rejection declaration")
        result[identity] = item
    return result
