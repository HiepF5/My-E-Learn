import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/app_bottom_nav.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Username: ${auth.username ?? '-'}'),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: () {
                ref.read(authProvider.notifier).logout();
                context.go('/login');
              },
              child: const Text('Logout'),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const AppBottomNav(currentPath: '/profile'),
    );
  }
}
