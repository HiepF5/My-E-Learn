import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/review_item.dart';
import '../../models/touch_history_item.dart';
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
  TouchHistoryItem? _touch;
  bool _submittingTouch = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final service = ReviewService(ref.read(apiClientProvider), CacheService());
    final data = await service.getTodayReview(limit: 20);
    TouchHistoryItem? touch;
    if (data.isNotEmpty) {
      touch = await service.getTouchHistory(data.first.wordId);
    }
    if (!mounted) return;
    setState(() {
      _items = data;
      _touch = touch;
      _loading = false;
      _index = 0;
    });
  }

  Future<void> _loadTouchForCurrent() async {
    if (_items.isEmpty || _index >= _items.length) {
      if (!mounted) return;
      setState(() => _touch = null);
      return;
    }
    final service = ReviewService(ref.read(apiClientProvider), CacheService());
    final touch = await service.getTouchHistory(_items[_index].wordId);
    if (!mounted) return;
    setState(() => _touch = touch);
  }

  Future<void> _completeTouchStep(int step) async {
    if (_items.isEmpty || _index >= _items.length) return;
    if (_submittingTouch) return;
    final current = _items[_index];
    final service = ReviewService(ref.read(apiClientProvider), CacheService());
    setState(() => _submittingTouch = true);
    await service.patchTouchStep(wordId: current.wordId, touchStep: step, done: true);
    await _loadTouchForCurrent();
    if (!mounted) return;
    setState(() => _submittingTouch = false);
  }

  Future<void> _rate(String rating, bool correct) async {
    if (_items.isEmpty || _index >= _items.length) return;
    final current = _items[_index];
    final service = ReviewService(ref.read(apiClientProvider), CacheService());
    await service.submitReview(wordId: current.wordId, answerResult: correct, rating: rating);
    if (!mounted) return;
    setState(() {
      _index += 1;
      _touch = null;
    });
    await _loadTouchForCurrent();
  }

  int _currentTouchStep(TouchHistoryItem? touch) {
    if (touch == null) return 1;
    if (!touch.touch1Done) return 1;
    if (!touch.touch2Done) return 2;
    if (!touch.touch3Done) return 3;
    return 4;
  }

  String _stepLabel(int step) {
    if (step == 1) return 'Recognize';
    if (step == 2) return 'Type';
    if (step == 3) return 'Sentence';
    return 'Done';
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
      final step = _currentTouchStep(_touch);
      final canRate = step == 4;
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
                    Text('3-touch current step: ${_stepLabel(step)}'),
                    const SizedBox(height: 8),
                    Text(
                      'Progress: '
                      'R:${_touch?.touch1Done == true ? "x" : "-"} '
                      'T:${_touch?.touch2Done == true ? "x" : "-"} '
                      'S:${_touch?.touch3Done == true ? "x" : "-"}',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            if (!canRate)
              FilledButton(
                onPressed: _submittingTouch ? null : () => _completeTouchStep(step),
                child: Text(_submittingTouch ? 'Saving...' : 'Complete ${_stepLabel(step)}'),
              ),
            if (!canRate) const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                OutlinedButton(
                  onPressed: canRate ? () => _rate('Again', false) : null,
                  child: const Text('Again'),
                ),
                OutlinedButton(
                  onPressed: canRate ? () => _rate('Hard', true) : null,
                  child: const Text('Hard'),
                ),
                FilledButton(
                  onPressed: canRate ? () => _rate('Good', true) : null,
                  child: const Text('Good'),
                ),
                FilledButton(
                  onPressed: canRate ? () => _rate('Easy', true) : null,
                  child: const Text('Easy'),
                ),
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
