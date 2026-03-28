import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

import '../firebase_options.dart';
import 'api_client.dart';

/// Registers FCM token with [ApiClient] at `POST /api/devices/tokens`.
/// Requires `flutterfire configure` and platform files (`google-services.json`, etc.).
Future<void> registerPushWithBackend(ApiClient api) async {
  try {
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  } catch (e, st) {
    debugPrint('Firebase init skipped or failed: $e\n$st');
    return;
  }

  final messaging = FirebaseMessaging.instance;
  await messaging.requestPermission();

  final token = await messaging.getToken();
  if (token == null || token.isEmpty) return;

  try {
    await api.dio.post('/devices/tokens', data: {
      'token': token,
      'platform': defaultTargetPlatform.name,
    });
  } catch (e, st) {
    debugPrint('Device token POST failed: $e\n$st');
  }

  FirebaseMessaging.instance.onTokenRefresh.listen((t) async {
    try {
      await api.dio.post('/devices/tokens', data: {
        'token': t,
        'platform': defaultTargetPlatform.name,
      });
    } catch (_) {}
  });
}
