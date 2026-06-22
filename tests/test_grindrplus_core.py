"""Focused source-level tests for the GrindrPlus core entry-point module.

GrindrPlus.kt is the largest module in the codebase that previously had no
test coverage. It is the Xposed entry point: it wires bridge connection,
version checks, the activity lifecycle, every user-facing dialog, and the
remote spline/profile fetch paths. These tests pin the control-flow contracts
that the rest of the module depends on, parsing the Kotlin source the same way
test_settings_screen.py does (the project has no JVM test harness available
without the Android SDK, so behavior is verified at the source level).
"""

from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
GRINDRPLUS = (
    ROOT
    / "app"
    / "src"
    / "main"
    / "java"
    / "com"
    / "grindrplus"
    / "GrindrPlus.kt"
)
SOURCE = GRINDRPLUS.read_text()


def kotlin_function_body(name: str) -> str:
    """Return the body of a Kotlin function (top-level or member) by name."""
    signature = f"fun {name}"
    signature_start = SOURCE.find(signature)
    assert signature_start != -1, f"{name} should exist in GrindrPlus.kt"

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


def test_module_is_a_singleton_object_with_guarded_public_state():
    """GrindrPlus is an object whose injected dependencies are write-protected."""
    assert "object GrindrPlus {" in SOURCE

    # The core injected singletons must not be reassignable from the outside.
    for field in ("context", "classLoader", "database", "instanceManager",
                  "httpClient", "packageName"):
        assert f"lateinit var {field}" in SOURCE
    assert SOURCE.count("private set") >= 6

    # bridgeClient is settable within the module (internal) for reconnection.
    assert "lateinit var bridgeClient: BridgeClient" in SOURCE
    assert "internal set" in SOURCE


def test_init_is_idempotent_and_orders_bridge_then_config_then_hooks():
    """init() short-circuits on re-entry and follows the documented startup order."""
    body = kotlin_function_body("init")

    guard = body.index("if (isInitialized)")
    assert "return" in body[guard:guard + 160]

    # Crash logging is installed before anything can throw.
    crash = body.index("setupCrashLogging()")
    context_assign = body.index("this.context = application")
    assert crash < context_assign

    # Bridge connection happens before config / classloader / DB setup.
    bridge = body.index("bridgeClient.connectWithRetry")
    config = body.index("Config.initialize(application.packageName)")
    classloader = body.index("DexClassLoader(")
    assert bridge < config < classloader

    # A failed bridge connection is recorded, not fatal.
    assert "shouldShowBridgeConnectionError = true" in body

    # isInitialized only flips true after core init succeeds.
    assert body.index("initializeCore()") < body.index("isInitialized = true")


def test_init_connect_uses_bounded_timeout_and_treats_failure_as_disconnected():
    """Bridge connection is wrapped in a 10s timeout that defaults to false."""
    body = kotlin_function_body("init")

    assert "withTimeout(10000)" in body
    assert "connectWithRetry(5, 1000)" in body

    # The catch arm returns false so a slow bridge cannot block startup.
    catch = body.index("} catch (e: Exception) {", body.index("withTimeout"))
    arm = body[catch:catch + 160]
    assert "false" in arm


def test_init_validates_forced_coordinates_before_persisting_them():
    """Forced coordinates are rejected unless they parse as a non-zero lat,lng pair."""
    body = kotlin_function_body("init")

    assert 'forcedCoordinates.split(",")' in body
    assert "parts.size != 2 || parts.any { it.toDoubleOrNull() == null }" in body
    # The 0.0,0.0 sentinel is explicitly ignored.
    assert 'parts[0] == "0.0" && parts[1] == "0.0"' in body
    assert 'Config.put("forced_coordinates", forcedCoordinates)' in body
    # Previously-stored coordinates are cleared when none are forced now.
    assert 'Config.put("forced_coordinates", "")' in body


def test_init_aborts_after_lifecycle_registration_on_version_mismatch():
    """A version mismatch stops init after callbacks register but before hooks."""
    body = kotlin_function_body("init")

    register = body.index("registerActivityLifecycleCallbacks(application)")
    mismatch = body.index("if (shouldShowVersionMismatchDialog)")
    hooks = body.index("setupInstanceManager()")
    assert register < mismatch < hooks
    # The mismatch branch returns before setting up hooks.
    assert "return" in body[mismatch:hooks]


def test_init_regenerates_android_id_only_when_bridge_requests_it():
    """A fresh 16-char hex Android id is generated on bridge request."""
    body = kotlin_function_body("init")

    assert "bridgeClient.shouldRegenAndroidId(packageName)" in body
    assert "java.util.UUID.randomUUID()" in body
    assert '.replace("-", "").lowercase().take(16)' in body
    assert 'Config.put("android_device_id", androidId)' in body


def test_check_version_codes_flags_mismatch_on_name_or_code_miss():
    """Either an unknown version name or code must trigger the mismatch flag."""
    body = kotlin_function_body("checkVersionCodes")

    assert "pkgInfo.versionName in versionNames" in body
    assert "versionCodes.any { it.toLong() == versionCode }" in body
    assert "if (!isVersionNameSupported || !isVersionCodeSupported)" in body
    assert "shouldShowVersionMismatchDialog = true" in body
    assert "hasCheckedVersions = true" in body
    # Pre-P devices fall back to the deprecated versionCode int.
    assert "Build.VERSION_CODES.P" in body
    assert "pkgInfo.longVersionCode" in body


def test_activity_lifecycle_dispatches_each_special_activity_exactly_once():
    """onActivityCreated routes age-verify, maps, bridge-error and mismatch flows."""
    body = kotlin_function_body("registerActivityLifecycleCallbacks")

    assert "activity.javaClass.name == ageVerificationActivity ->" in body
    assert "showAgeVerificationComplianceDialog(activity)" in body
    assert "activity.javaClass.name == browseExploreActivity ->" in body
    assert "showMapsApiKeyDialog(activity)" in body

    # One-shot dialogs reset their flags so they cannot re-fire.
    assert "showBridgeConnectionError(activity)" in body
    assert "shouldShowBridgeConnectionError = false" in body
    assert "showVersionMismatchDialog(activity)" in body
    assert "shouldShowVersionMismatchDialog = false" in body

    # Pending imports are handled on activity creation.
    assert "if (isImportingSomething)" in body
    assert "handleImports(activity)" in body


def test_maps_dialog_only_shown_for_non_lsposed_without_existing_key():
    """The maps-key prompt is gated on an empty key AND a non-LSPosed install."""
    body = kotlin_function_body("registerActivityLifecycleCallbacks")

    gate = body.index("activity.javaClass.name == browseExploreActivity ->")
    branch = body[gate:body.index("shouldShowBridgeConnectionError ->", gate)]
    assert '(Config.get("maps_api_key", "") as String).isEmpty()' in branch
    assert "if (!bridgeClient.isLSPosed())" in branch


def test_current_activity_tracking_uses_weak_references():
    """Resume stores a WeakReference; pause clears it only for the active activity."""
    assert "currentActivityRef?.get()" in SOURCE

    body = kotlin_function_body("registerActivityLifecycleCallbacks")
    assert "currentActivityRef = WeakReference(activity)" in body
    # Pausing a non-current activity must not clear the reference.
    pause = body.index("override fun onActivityPaused")
    pause_body = body[pause:body.index("override fun onActivityStopped", pause)]
    assert "if (currentActivity == activity)" in pause_body
    assert "currentActivityRef = null" in pause_body


def test_setup_instance_manager_is_idempotent_and_nests_session_callbacks():
    """Instance setup guards re-entry and builds the http client from 3 instances."""
    body = kotlin_function_body("setupInstanceManager")

    assert "if (isInstanceManagerInitialized)" in body
    assert "hookClassConstructors(" in body

    # The Client is only constructed once all three interceptor inputs resolve.
    user_session = body.index("setCallback(userSession)")
    user_agent = body.index("setCallback(userAgent)")
    device_info = body.index("setCallback(deviceInfo)")
    client = body.index("httpClient = Client(Interceptor(uSession, uAgent, dInfo))")
    assert user_session < user_agent < device_info < client

    assert "taskManager.registerTasks()" in body
    assert "isInstanceManagerInitialized = true" in body


def test_initialize_core_resets_database_then_clears_the_flag():
    """Core init optionally wipes the DB and is guarded against double init."""
    body = kotlin_function_body("initializeCore")

    assert "if (isMainInitialized)" in body
    reset = body.index('Config.get("reset_database", false)')
    clear = body.index("database.clearAllTables()")
    unset = body.index('Config.put("reset_database", false)')
    assert reset < clear < unset
    assert body.index("hookManager.init()") < body.index("isMainInitialized = true")


def test_run_on_main_thread_with_current_activity_logs_when_none_active():
    """The activity-scoped main-thread helper no-ops with a log when idle."""
    body = kotlin_function_body("runOnMainThreadWithCurrentActivity")

    assert "currentActivity?.let { activity ->" in body
    assert "block(activity)" in body
    assert "Cannot execute action - no active activity" in body


def test_execute_async_swallows_and_logs_exceptions():
    """Async work runs on the IO scope and never propagates exceptions."""
    body = kotlin_function_body("executeAsync")

    assert "ioScope.launch {" in body
    assert "block()" in body
    assert "} catch (e: Exception) {" in body
    assert "Async operation failed: ${e.message}" in body
    assert "Logger.writeRaw(e.stackTraceToString())" in body


def test_restart_grindr_relaunches_with_clear_top_and_kills_process():
    """Both the immediate and delayed restart paths clear-top then kill the PID."""
    body = kotlin_function_body("restartGrindr")

    assert "if (timeout > 0)" in body
    assert "postDelayed(" in body
    # Restart launches the package entry point with CLEAR_TOP and kills self.
    assert body.count("getLaunchIntentForPackage(context.packageName)") == 2
    assert body.count("addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)") == 2
    assert body.count("android.os.Process.killProcess(android.os.Process.myPid())") == 2


def test_fetch_remote_data_parses_spline_points_and_logs_failures():
    """Remote spline JSON is parsed into (time, id) pairs; failures only log."""
    body = kotlin_function_body("fetchRemoteData")

    assert "override fun onFailure(call: Call, e: IOException)" in body
    assert "Failed to fetch remote data: ${e.message}" in body

    response = body[body.index("override fun onResponse"):]
    assert "JSONArray(jsonString)" in response
    assert 'obj.getLong("time")' in response
    assert 'obj.getInt("id")' in response
    assert "parsedPoints.add(time to id)" in response
    assert "callback(parsedPoints)" in response
    assert "Failed to parse remote data: ${e.message}" in response


def test_fetch_own_user_id_extracts_first_profile_id_defensively():
    """The /me/profile fetch guards every layer before storing myProfileId."""
    body = kotlin_function_body("fetchOwnUserId")

    assert 'url = "https://grindr.mobi/v5/me/profile"' in body
    assert 'method = "GET"' in body
    assert "if (response.isSuccessful)" in body
    assert 'jsonResponse.optJSONArray("profiles")' in body
    assert "profilesArray != null && profilesArray.length() > 0" in body
    assert 'profile.optString("profileId")' in body
    assert "if (profileId.isNotEmpty())" in body
    assert "myProfileId = profileId" in body


def test_setup_crash_logging_chains_to_the_previous_handler():
    """The crash handler logs then always delegates to the default handler."""
    body = kotlin_function_body("setupCrashLogging")

    assert "Thread.getDefaultUncaughtExceptionHandler()" in body
    assert "Thread.setDefaultUncaughtExceptionHandler" in body
    assert "Uncaught exception in thread: ${thread.name}" in body
    # The cause chain is captured when present.
    assert "throwable.cause?.let { cause ->" in body
    # finally guarantees the original handler still runs.
    finally_idx = body.index("} finally {")
    assert "defaultHandler?.uncaughtException(thread, throwable)" in body[finally_idx:]


def test_spline_seed_is_monotonic_in_both_time_and_id():
    """The hard-coded PCHIP seed points are sorted ascending on time and id."""
    start = SOURCE.index("var spline = PCHIP(")
    block = SOURCE[start:SOURCE.index("val currentActivity", start)]

    pairs = []
    for line in block.splitlines():
        line = line.strip()
        if " to " in line and "L" in line:
            left, right = line.split(" to ")
            time = int(left.strip().rstrip("L"))
            ident = int(right.split("//")[0].strip().rstrip(","))
            pairs.append((time, ident))

    assert len(pairs) >= 15, "expected the full historical spline seed"
    times = [p[0] for p in pairs]
    ids = [p[1] for p in pairs]
    assert times == sorted(times), "spline times must be strictly increasing"
    assert ids == sorted(ids), "spline ids must be monotonically increasing"


def test_dialogs_are_non_cancelable_except_the_optional_maps_prompt():
    """Compliance/mismatch/error dialogs block dismissal; the maps prompt is optional."""
    mismatch = kotlin_function_body("showVersionMismatchDialog")
    assert "setCancelable(false)" in mismatch

    bridge = kotlin_function_body("showBridgeConnectionError")
    assert "setCancelable(false)" in bridge

    age = kotlin_function_body("showAgeVerificationComplianceDialog")
    assert "setCancelable(false)" in age
    # Age dialog finishes the activity rather than bypassing verification.
    assert "activity.finish()" in age
    assert "does NOT bypass" in age

    maps = kotlin_function_body("showMapsApiKeyDialog")
    assert "setCancelable(true)" in maps
