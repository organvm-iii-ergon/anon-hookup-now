"""Focused source-level tests for the large SettingsScreen Kotlin module."""

from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SETTINGS_SCREEN = (
    ROOT
    / "app"
    / "src"
    / "main"
    / "java"
    / "com"
    / "grindrplus"
    / "manager"
    / "ui"
    / "SettingsScreen.kt"
)
SOURCE = SETTINGS_SCREEN.read_text()


def kotlin_function_body(name: str) -> str:
    """Return the body of a top-level Kotlin function from SettingsScreen.kt."""
    signature = f"fun {name}"
    signature_start = SOURCE.find(signature)
    assert signature_start != -1, f"{name} should exist in SettingsScreen.kt"

    body_start = SOURCE.find("{", signature_start)
    assert body_start != -1, f"{name} should have a body"

    depth = 0
    for index in range(body_start, len(SOURCE)):
        char = SOURCE[index]
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return SOURCE[body_start + 1:index]

    raise AssertionError(f"{name} body should have balanced braces")


def test_settings_screen_wires_all_overflow_menu_actions():
    """The Settings overflow menu exposes each command and its side effects."""
    body = kotlin_function_body("SettingsScreen")

    for label in (
        "Debug logs",
        "Export settings",
        "Import settings",
        "Reset settings",
        "About",
    ):
        assert f'Text("{label}")' in body

    assert "debugLogsScreen = true" in body
    assert "showResetDialog = true" in body
    assert "showAboutDialog = true" in body


def test_settings_export_import_and_reset_use_config_file_contracts():
    """Import/export/reset paths preserve the JSON config behavior users rely on."""
    body = kotlin_function_body("SettingsScreen")

    assert "Config.readRemoteConfig()" in body
    assert "FileOperationHandler.exportFile(" in body
    assert '"grindrplus_settings.json"' in body
    assert "result.toString(4)" in body
    assert 'showSnackbar("Settings exported successfully")' in body

    assert "FileOperationHandler.importFile(" in body
    assert 'arrayOf("application/json")' in body
    assert "Config.writeRemoteConfig(JSONObject(it))" in body
    assert "viewModel.loadSettings()" in body
    assert 'showSnackbar("Settings imported successfully")' in body
    assert 'showSnackbar("Failed to import settings: ${e.message}")' in body

    assert "Config.writeRemoteConfig(JSONObject())" in body
    assert "Intent.FLAG_ACTIVITY_CLEAR_TOP" in body
    assert "android.os.Process.killProcess(android.os.Process.myPid())" in body


def test_settings_screen_handles_package_selection_and_api_key_dialog():
    """Package switching refreshes settings and API-key testing state is rendered."""
    body = kotlin_function_body("SettingsScreen")

    assert "PackageSelector(" in body
    assert "onPackageSelected = { packageName ->" in body
    assert "viewModel.loadSettings()" in body

    assert "val showApiKeyTestDialog by viewModel.showApiKeyTestDialog.collectAsState()" in body
    assert "ApiKeyTestDialog(" in body
    assert "isLoading = apiKeyTestLoading" in body
    assert "title = apiKeyTestTitle" in body
    assert "message = apiKeyTestMessage" in body
    assert "rawResponse = apiKeyTestRawResponse" in body
    assert "onDismiss = viewModel::dismissApiKeyTestDialog" in body


def test_setting_group_renders_every_setting_with_inner_dividers_only():
    """Setting groups route every setting and avoid a trailing divider."""
    body = kotlin_function_body("SettingGroupSection")

    assert "group.settings.forEachIndexed { index, setting ->" in body
    assert "ImprovedSettingItem(setting, onSettingChanged)" in body
    assert "if (index < group.settings.size - 1)" in body
    assert "HorizontalDivider(" in body


def test_improved_setting_item_dispatches_each_setting_type():
    """Every Setting subtype has an explicit SettingsScreen renderer."""
    body = kotlin_function_body("ImprovedSettingItem")

    expected_branches = (
        "is SwitchSetting -> ImprovedSwitchSetting(setting) { onSettingChanged() }",
        "is TextSetting -> ImprovedTextSetting(setting) { onSettingChanged() }",
        (
            "is TextSettingWithButtons -> ImprovedTextSettingWithButtons(setting) "
            "{ onSettingChanged() }"
        ),
        "is ButtonSetting -> ImprovedButtonSetting(setting)",
    )
    for branch in expected_branches:
        assert branch in body


def test_switch_settings_persist_change_before_notifying_parent():
    """Switch rows call their model callback before the screen snackbar callback."""
    body = kotlin_function_body("ImprovedSwitchSetting")

    change_handler = body[body.index("onCheckedChange = {"):body.index(
        "},",
        body.index("onCheckedChange = {"),
    )]
    assert change_handler.index("setting.onCheckedChange(it)") < change_handler.index(
        "onChanged()"
    )


def test_text_setting_editors_gate_saves_on_validation():
    """Both text editors update validators live and block invalid save paths."""
    for function_name in ("ImprovedTextSetting", "ImprovedTextSettingWithButtons"):
        body = kotlin_function_body(function_name)

        assert "var errorMessage by remember { mutableStateOf<String?>(null) }" in body
        assert "errorMessage = setting.validator?.invoke(value)" in body
        assert body.count("if (errorMessage == null)") >= 3
        assert "enabled = errorMessage == null" in body


def test_text_setting_with_buttons_refreshes_text_after_button_actions():
    """Custom text-setting actions refresh visible text from the backing setting."""
    body = kotlin_function_body("ImprovedTextSettingWithButtons")

    assert "setting.buttons.forEach { buttonAction ->" in body
    assert "buttonAction.action()" in body
    assert "text = setting.value" in body
