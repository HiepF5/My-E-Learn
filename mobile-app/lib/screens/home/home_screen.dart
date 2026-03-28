import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/today_mission_service.dart';
import '../../widgets/app_bottom_nav.dart';
import '../../widgets/today_progress_card.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int reviewDue = 0;
  int newWordsTarget = 0;
  int topErrorsCount = 0;
  String topicTitle = 'Today Topic';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final api = ref.read(apiClientProvider);
    final cache = CacheService();
    final missionService = TodayMissionService(api, cache);
    try {
      final mission = await missionService.getTodayMission(reviewCap: 20);
      if (!mounted) return;
      setState(() {
        reviewDue = mission?.reviewDueCount ?? 0;
        newWordsTarget = mission?.newWordsTarget ?? 0;
        topErrorsCount = mission?.topErrorsCount ?? 0;
        topicTitle = mission?.primaryTopicName?.trim().isNotEmpty == true
            ? mission!.primaryTopicName!.trim()
            : 'Today Topic';
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        reviewDue = 0;
        newWordsTarget = 0;
        topErrorsCount = 0;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Today Mission')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TodayProgressCard(
            reviewDue: reviewDue,
            newWords: newWordsTarget,
            topErrors: topErrorsCount,
          ),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              title: const Text('Today Topic'),
              subtitle: Text(topicTitle),
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
          const SizedBox(height: 8),
          OutlinedButton(
            onPressed: () => context.go('/vocabulary'),
            child: const Text('Browse vocabulary'),
          ),
        ],
      ),
      bottomNavigationBar: const AppBottomNav(currentPath: '/'),
    );
  }
}
