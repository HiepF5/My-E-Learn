/// Placeholder for Phase 5 FCM / local notification scheduling.
/// Wire [registerForPush] to `firebase_messaging` after adding `google-services.json` / `GoogleService-Info.plist`.
class PushRemindersStub {
  Future<void> registerForPush() async {
    // Intentionally empty: enable Firebase Cloud Messaging in a follow-up.
  }

  Future<void> scheduleDailyStudyReminder({Duration offset = Duration.zero}) async {
    // Intentionally empty: use flutter_local_notifications or FCM data messages later.
  }
}
