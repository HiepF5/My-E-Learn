import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static const _tokenKey = 'auth_token';
  static const _usernameKey = 'auth_username';

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<void> saveAuth({
    required String token,
    required String username,
  }) async {
    await _storage.write(key: _tokenKey, value: token);
    await _storage.write(key: _usernameKey, value: username);
  }

  Future<String?> readToken() => _storage.read(key: _tokenKey);

  Future<String?> readUsername() => _storage.read(key: _usernameKey);

  Future<void> clearAuth() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _usernameKey);
  }
}
