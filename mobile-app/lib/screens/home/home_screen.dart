import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/review_service.dart';
import '../../widgets/app_bottom_nav.dart';
import '../../widgets/today_progress_card.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int reviewDue = 0;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final api = ref.read(apiClientProvider);
    final service = ReviewService(api, CacheService());
    try {
      final list = await service.getTodayReview(limit: 20);
      if (!mounted) return;
      setState(() => reviewDue = list.length);
    } catch (_) {
      if (!mounted) return;
      setState(() => reviewDue = 0);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Today Mission')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TodayProgressCard(reviewDue: reviewDue, newWords: 3, topErrors: 2),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              title: const Text('Today Topic'),
              subtitle: const Text('Daily Communication'),
              trailing: FilledButton(
                onPressed: () => context.go('/topic'),
                child: const Text('Open'),
              ),
            ),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: () => context.go('/review'),
            child: const Text('Start Review'),
          ),
        ],
      ),
      bottomNavigationBar: const AppBottomNav(currentPath: '/'),
    );
  }
}
