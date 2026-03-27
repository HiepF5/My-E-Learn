import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_client.dart';
import '../services/secure_storage_service.dart';

final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());
final secureStorageProvider = Provider<SecureStorageService>(
  (ref) => SecureStorageService(),
);

class AuthState {
  const AuthState({this.token, this.username, this.isReady = false});
  final String? token;
  final String? username;
  final bool isReady;

  bool get isLoggedIn => token != null && token!.isNotEmpty;

  AuthState copyWith({String? token, String? username, bool? isReady}) {
    return AuthState(
      token: token ?? this.token,
      username: username ?? this.username,
      isReady: isReady ?? this.isReady,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._ref) : super(const AuthState()) {
    _bootstrapAuth();
  }
  final Ref _ref;

  Future<void> _bootstrapAuth() async {
    final storage = _ref.read(secureStorageProvider);
    final token = await storage.readToken();
    final username = await storage.readUsername();
    if (token != null && token.isNotEmpty) {
      _ref.read(apiClientProvider).setBearerToken(token);
      state = AuthState(token: token, username: username, isReady: true);
      return;
    }
    state = const AuthState(isReady: true);
  }

  Future<void> login({
    required String username,
    required String password,
  }) async {
    final api = _ref.read(apiClientProvider);
    final res = await api.dio.post('/auth/login', data: {
      'username': username,
      'password': password,
    });
    final token = res.data['data']['token'] as String?;
    if (token == null || token.isEmpty) {
      throw Exception('Empty token');
    }
    await _ref.read(secureStorageProvider).saveAuth(token: token, username: username);
    state = state.copyWith(token: token, username: username, isReady: true);
    api.setBearerToken(token);
  }

  Future<void> logout() async {
    await _ref.read(secureStorageProvider).clearAuth();
    state = const AuthState(isReady: true);
    _ref.read(apiClientProvider).setBearerToken(null);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(ref),
);
