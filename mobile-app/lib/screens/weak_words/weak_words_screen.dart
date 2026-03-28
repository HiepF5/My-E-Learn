import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/review_service.dart';
import '../../services/weak_word_service.dart';
import '../../widgets/app_bottom_nav.dart';

class WeakWordsScreen extends ConsumerStatefulWidget {
  const WeakWordsScreen({super.key});

  @override
  ConsumerState<WeakWordsScreen> createState() => _WeakWordsScreenState();
}

class _WeakWordsScreenState extends ConsumerState<WeakWordsScreen> {
  bool _loading = true;
  List<WeakWordEntry> _entries = const [];
  Map<int, String> _labels = const {};

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final api = ref.read(apiClientProvider);
    final weakSvc = WeakWordService(api);
    final reviewSvc = ReviewService(api, CacheService());
    try {
      final entries = await weakSvc.list(limit: 50);
      final ids = entries.map((e) => e.wordId).toList();
      final labels = ids.isEmpty ? <int, String>{} : await reviewSvc.getVocabularyWordMapByIds(ids);
      if (!mounted) return;
      setState(() {
        _entries = entries;
        _labels = labels;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _entries = [];
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Your weak words')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _entries.isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Text(
                      'No weak words yet — keep reviewing; we surface words you miss often.',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _entries.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, i) {
                    final e = _entries[i];
                    final label = _labels[e.wordId] ?? 'Word #${e.wordId}';
                    return ListTile(
                      title: Text(label),
                      subtitle: Text(
                        'Score ${e.weakScore.toStringAsFixed(1)} · wrong ${e.wrongCountSnapshot ?? 0} · recent ${e.recentWrongCount ?? 0}',
                        maxLines: 2,
                      ),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => context.push('/vocabulary/${e.wordId}'),
                    );
                  },
                ),
      bottomNavigationBar: const AppBottomNav(currentPath: '/weak-words'),
    );
  }
}
