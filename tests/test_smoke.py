"""Smoke tests for project structure and data files."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def test_version_json_format():
    """version.json has valid structure with expected keys."""
    vpath = ROOT / "version.json"
    assert vpath.exists(), "version.json should exist at project root"
    data = json.loads(vpath.read_text())
    assert "versionName" in data
    assert "versionCode" in data
    assert isinstance(data["versionCode"], int)


def test_seed_yaml_exists():
    """seed.yaml is present for orchestration system."""
    assert (ROOT / "seed.yaml").exists()


def test_readme_exists():
    """README.md is present."""
    assert (ROOT / "README.md").exists()
