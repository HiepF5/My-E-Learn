class AppEnv {
  // Example:
  // flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5000/api
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:5000/api',
  );
}
