import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/login_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/review/review_screen.dart';
import '../screens/error_note/error_notebook_screen.dart';
import '../screens/topic/topic_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/summary/daily_summary_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authProvider);
  return GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
      GoRoute(path: '/review', builder: (_, __) => const ReviewScreen()),
      GoRoute(path: '/errors', builder: (_, __) => const ErrorNotebookScreen()),
      GoRoute(path: '/topic', builder: (_, __) => const TopicScreen()),
      GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
      GoRoute(path: '/summary', builder: (_, __) => const DailySummaryScreen()),
    ],
    redirect: (context, state) {
      final isAuth = auth.isLoggedIn;
      final onSplash = state.fullPath == '/splash';
      final onLogin = state.fullPath == '/login';
      if (onSplash) return isAuth ? '/' : '/login';
      if (!isAuth && !onLogin) return '/login';
      if (isAuth && onLogin) return '/';
      return null;
    },
  );
});
