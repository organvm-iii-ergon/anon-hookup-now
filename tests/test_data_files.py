"""Tests for project data files and Python utilities."""

import json
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def test_manifest_json_structure():
    """manifest.json has valid URL entries."""
    mpath = ROOT / "manifest.json"
    assert mpath.exists(), "manifest.json should exist"
    data = json.loads(mpath.read_text())
    assert isinstance(data, dict)
    for key, urls in data.items():
        assert isinstance(urls, list), f"Value for {key} should be a list"
        for url in urls:
            assert url.startswith("http"), f"URL should start with http: {url}"


def test_spline_json_structure():
    """spline.json has valid time-series data points."""
    spath = ROOT / "spline.json"
    assert spath.exists(), "spline.json should exist"
    data = json.loads(spath.read_text())
    assert isinstance(data, list)
    assert len(data) > 0, "spline.json should have data points"
    for point in data:
        assert "time" in point, "Each point must have 'time'"
        assert "id" in point, "Each point must have 'id'"
        assert isinstance(point["time"], int)
        assert isinstance(point["id"], int)


def test_spline_json_chronological_order():
    """spline.json timestamps are in ascending order."""
    data = json.loads((ROOT / "spline.json").read_text())
    times = [p["time"] for p in data]
    assert times == sorted(times), "Timestamps should be in ascending order"


def test_spline_json_ids_ascending():
    """spline.json IDs are in ascending order."""
    data = json.loads((ROOT / "spline.json").read_text())
    ids = [p["id"] for p in data]
    assert ids == sorted(ids), "IDs should be in ascending order"


def test_news_json_entries():
    """news.json has valid message entries with required fields."""
    npath = ROOT / "news.json"
    assert npath.exists(), "news.json should exist"
    text = npath.read_text().strip()
    # Entries are pipe-delimited JSON objects that may span multiple lines
    raw_entries = text.split("\n|")
    entries = []
    for raw in raw_entries:
        raw = raw.lstrip("|").strip()
        if not raw:
            continue
        entry = json.loads(raw, strict=False)
        entries.append(entry)
    assert len(entries) > 0, "news.json should have entries"
    for entry in entries:
        assert "message_id" in entry
        assert "text" in entry
        assert "date" in entry
        assert isinstance(entry["message_id"], int)
        assert isinstance(entry["date"], int)


def test_version_json_version_format():
    """version.json versionName follows semver-like pattern."""
    data = json.loads((ROOT / "version.json").read_text())
    parts = data["versionName"].split(".")
    assert len(parts) >= 2, "Version should have at least major.minor"
    for part in parts:
        assert part.isdigit(), f"Version part '{part}' should be numeric"


def test_version_json_code_positive():
    """version.json versionCode is a positive integer."""
    data = json.loads((ROOT / "version.json").read_text())
    assert data["versionCode"] > 0


def test_gradle_build_file_exists():
    """build.gradle.kts exists at project root."""
    assert (ROOT / "build.gradle.kts").exists()


def test_settings_gradle_exists():
    """settings.gradle exists at project root."""
    assert (ROOT / "settings.gradle").exists()


def test_kotlin_source_directory_structure():
    """Kotlin source directory has expected package structure."""
    kt_base = ROOT / "app" / "src" / "main" / "java" / "com" / "grindrplus"
    assert kt_base.exists(), "Kotlin source root should exist"
    kt_files = list(kt_base.rglob("*.kt"))
    assert len(kt_files) > 10, "Should have substantial Kotlin source files"


def test_crowdin_config_exists():
    """crowdin.yml exists for localization."""
    assert (ROOT / "crowdin.yml").exists()


class TestSaveVersionToJson:
    """Tests for fetch_version.save_version_to_json."""

    def test_saves_valid_json(self):
        import sys
        sys.path.insert(0, str(ROOT))
        from fetch_version import save_version_to_json

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False, mode="w") as f:
            tmp = Path(f.name)

        try:
            save_version_to_json("25.18.0", "145667", str(tmp))
            data = json.loads(tmp.read_text())
            assert data["versionName"] == "25.18.0"
            assert data["versionCode"] == 145667
        finally:
            tmp.unlink(missing_ok=True)

    def test_overwrites_existing_file(self):
        import sys
        sys.path.insert(0, str(ROOT))
        from fetch_version import save_version_to_json

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False, mode="w") as f:
            f.write('{"old": "data"}')
            tmp = Path(f.name)

        try:
            save_version_to_json("1.0.0", "100", str(tmp))
            data = json.loads(tmp.read_text())
            assert data["versionName"] == "1.0.0"
            assert "old" not in data
        finally:
            tmp.unlink(missing_ok=True)

    def test_version_code_is_int(self):
        import sys
        sys.path.insert(0, str(ROOT))
        from fetch_version import save_version_to_json

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False, mode="w") as f:
            tmp = Path(f.name)

        try:
            save_version_to_json("2.0.0", "999", str(tmp))
            data = json.loads(tmp.read_text())
            assert isinstance(data["versionCode"], int)
        finally:
            tmp.unlink(missing_ok=True)
