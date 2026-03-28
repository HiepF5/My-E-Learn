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
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.local_fire_department_outlined),
              title: const Text('Streak & heatmap'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.push('/streak'),
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.science_outlined),
              title: const Text('Learning lab'),
              subtitle: const Text('Sentence mining, dictation, grammar'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.push('/learning'),
            ),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: () async {
                await ref.read(authProvider.notifier).logout();
                if (!context.mounted) return;
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
