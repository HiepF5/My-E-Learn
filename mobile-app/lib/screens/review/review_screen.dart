import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/review_item.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/review_service.dart';
import '../../widgets/app_bottom_nav.dart';

class ReviewScreen extends ConsumerStatefulWidget {
  const ReviewScreen({super.key});

  @override
  ConsumerState<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends ConsumerState<ReviewScreen> {
  List<ReviewItem> _items = const [];
  int _index = 0;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final service = ReviewService(ref.read(apiClientProvider), CacheService());
    final data = await service.getTodayReview(limit: 20);
    if (!mounted) return;
    setState(() {
      _items = data;
      _loading = false;
      _index = 0;
    });
  }

  Future<void> _rate(String rating, bool correct) async {
    if (_items.isEmpty || _index >= _items.length) return;
    final current = _items[_index];
    final service = ReviewService(ref.read(apiClientProvider), CacheService());
    await service.submitReview(wordId: current.wordId, answerResult: correct, rating: rating);
    if (!mounted) return;
    setState(() => _index += 1);
  }

  @override
  Widget build(BuildContext context) {
    Widget body;
    if (_loading) {
      body = const Center(child: CircularProgressIndicator());
    } else if (_items.isEmpty || _index >= _items.length) {
      body = const Center(child: Text('Done for today'));
    } else {
      final item = _items[_index];
      body = Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Text('Word ID: ${item.wordId}', style: Theme.of(context).textTheme.headlineSmall),
                    const SizedBox(height: 8),
                    Text('Level: ${item.level}, Wrong: ${item.wrongCount}'),
                    const SizedBox(height: 12),
                    const Text('3-touch flow: Recognize -> Type -> Sentence'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                OutlinedButton(onPressed: () => _rate('Again', false), child: const Text('Again')),
                OutlinedButton(onPressed: () => _rate('Hard', true), child: const Text('Hard')),
                FilledButton(onPressed: () => _rate('Good', true), child: const Text('Good')),
                FilledButton(onPressed: () => _rate('Easy', true), child: const Text('Easy')),
              ],
            ),
          ],
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Review')),
      body: body,
      bottomNavigationBar: const AppBottomNav(currentPath: '/review'),
    );
  }
}
