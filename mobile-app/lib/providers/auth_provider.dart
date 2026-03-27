import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_client.dart';

final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());

class AuthState {
  const AuthState({this.token, this.username});
  final String? token;
  final String? username;

  bool get isLoggedIn => token != null && token!.isNotEmpty;

  AuthState copyWith({String? token, String? username}) {
    return AuthState(
      token: token ?? this.token,
      username: username ?? this.username,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._ref) : super(const AuthState());
  final Ref _ref;

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
    state = state.copyWith(token: token, username: username);
    api.setBearerToken(token);
  }

  void logout() {
    state = const AuthState();
    _ref.read(apiClientProvider).setBearerToken(null);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(ref),
);
