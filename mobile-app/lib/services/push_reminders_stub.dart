/// Placeholder for Firebase Cloud Messaging (Phase 5).
///
/// To enable real push reminders:
/// 1. Create a Firebase project and add Android `google-services.json` / iOS `GoogleService-Info.plist`.
/// 2. Run `flutterfire configure` and add `firebase_core` + `firebase_messaging` to [pubspec.yaml].
/// 3. Replace this stub with initialization in `main.dart` and optional token POST to the backend.
class PushRemindersStub {
  /// No-op until Firebase is wired; safe to call on every app start.
  Future<void> registerForPush() async {}

  /// Local scheduling could use `flutter_local_notifications` here without FCM.
  Future<void> scheduleDailyStudyReminder({Duration offset = Duration.zero}) async {}
}
