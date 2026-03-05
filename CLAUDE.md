# CLAUDE.md — anon-hookup-now

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**GrindrPlus** — Xposed module that unlocks and adds features to the Grindr Android app. Built with Kotlin, uses Xposed/LSPosed framework to hook into Grindr's runtime. Requires a rooted Android device with LSPosed installed.

**Active branch**: `master` (not `main`).

## Commands

```bash
# Build
./gradlew assembleDebug       # Debug APK → app/build/outputs/apk/debug/
./gradlew assembleRelease     # Release APK

# Other
./gradlew test                # Run unit tests
python3 tests/test_smoke.py   # Python smoke tests
python3 fetch_version.py      # Fetch current Grindr version info
```

**Note**: Requires Android SDK and Gradle. Not buildable without Android SDK installed.

## Architecture

Standard Android Gradle project (Kotlin):

```
app/
└── src/main/
    ├── kotlin/      # Xposed hooks (Kotlin)
    ├── res/         # Android resources
    └── AndroidManifest.xml
gradle/              # Gradle version catalog (libs.versions.toml)
```

**Plugins**: `androidApplication`, `jetbrainsKotlinAndroid`, `googleKsp`, `compose.compiler`

**Distribution**: Via GitHub Releases and CI APK artifacts. Crowdin (`crowdin.yml`) for localization. Version tracked in `version.json` / `news.json`.

**Testing**: Python smoke tests in `tests/test_smoke.py` + standard Android unit tests via Gradle.

<!-- ORGANVM:AUTO:START -->
<!-- ORGANVM:AUTO:END -->


## ⚡ Conductor OS Integration
This repository is a managed component of the ORGANVM meta-workspace.
- **Orchestration:** Use `conductor patch` for system status and work queue.
- **Lifecycle:** Follow the `FRAME -> SHAPE -> BUILD -> PROVE` workflow.
- **Governance:** Promotions are managed via `conductor wip promote`.
- **Intelligence:** Conductor MCP tools are available for routing and mission synthesis.
