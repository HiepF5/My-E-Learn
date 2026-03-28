import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:math';
import '../../models/review_item.dart';
import '../../models/touch_history_item.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/review_service.dart';
import '../../widgets/app_bottom_nav.dart';
import '../../widgets/review_flashcard.dart';
import '../../widgets/review_rating_bar.dart';

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
  Map<int, String> _wordLabelById = const {};
  List<VocabularyOption> _vocabularyOptions = const [];
  late final PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _load();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final service = ReviewService(ref.read(apiClientProvider), CacheService());
    final data = await service.getTodayReview(limit: 20);
    final wordMap = await service.getVocabularyWordMapByIds(data.map((e) => e.wordId).toList());
    final vocabOptions = await service.getVocabularyOptions();
    TouchHistoryItem? touch;
    if (data.isNotEmpty) {
      touch = await service.getTouchHistory(data.first.wordId);
    }
    if (!mounted) return;
    setState(() {
      _items = data;
      _wordLabelById = wordMap;
      _vocabularyOptions = vocabOptions;
      _touch = touch;
      _loading = false;
      _index = 0;
    });
    if (data.isNotEmpty && _pageController.hasClients) {
      _pageController.jumpToPage(0);
    }
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

  Future<void> _onPageChanged(int i) async {
    setState(() => _index = i);
    await _loadTouchForCurrent();
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
    int? selectedWordId;
    if (!correct) {
      selectedWordId = await _askSelectedWordId();
      if (selectedWordId == null) return;
    }
    await service.submitReview(
      wordId: current.wordId,
      answerResult: correct,
      rating: rating,
      selectedWordId: selectedWordId,
    );
    if (!mounted) return;
    final next = _index + 1;
    setState(() {
      _index = next;
      _touch = null;
    });
    if (next < _items.length) {
      await _pageController.animateToPage(
        next,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutCubic,
      );
      await _loadTouchForCurrent();
    }
  }

  Future<int?> _askSelectedWordId() async {
    final currentWordId = _items[_index].wordId;
    final optionIds = _buildMcqOptions(currentWordId).where((wid) => wid != currentWordId).toList();

    if (optionIds.isEmpty) return null;

    final result = await showDialog<int>(
      context: context,
      builder: (ctx) {
        int? selectedId;
        return StatefulBuilder(
          builder: (dialogContext, setDialogState) => AlertDialog(
            title: const Text('Ban da chon nham tu nao?'),
            content: SizedBox(
              width: 360,
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: optionIds
                      .map(
                        (wid) => RadioListTile<int>(
                          value: wid,
                          groupValue: selectedId,
                          onChanged: (value) => setDialogState(() => selectedId = value),
                          title: Text(_wordForId(wid)),
                          subtitle: Text('ID: $wid'),
                        ),
                      )
                      .toList(),
                ),
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: selectedId == null ? null : () => Navigator.of(ctx).pop(selectedId),
                child: const Text('Submit'),
              ),
            ],
          ),
        );
      },
    );
    return result;
  }

  List<int> _buildMcqOptions(int currentWordId) {
    VocabularyOption? currentMeta;
    for (final v in _vocabularyOptions) {
      if (v.id == currentWordId) {
        currentMeta = v;
        break;
      }
    }
    if (currentMeta == null) {
      final fallback = _items.map((e) => e.wordId).where((id) => id != currentWordId).toSet().toList();
      fallback.shuffle();
      return [currentWordId, ...fallback.take(3)];
    }

    final meta = currentMeta;
    final topicSet = meta.topicIds.toSet();
    final candidates = _vocabularyOptions.where((v) => v.id != currentWordId).toList();

    final sameTopic = candidates
        .where((v) => topicSet.isNotEmpty && v.topicIds.any(topicSet.contains))
        .toList();
    final closeDifficulty = candidates
        .where((v) => (v.difficulty - meta.difficulty).abs() <= 1)
        .toList();

    final rnd = Random();
    final picked = <int>{};

    void pickFrom(List<VocabularyOption> source, int targetCount) {
      final pool = source.where((v) => !picked.contains(v.id)).toList()..shuffle(rnd);
      for (final v in pool) {
        if (picked.length >= targetCount) break;
        picked.add(v.id);
      }
    }

    pickFrom(sameTopic, 3);
    pickFrom(closeDifficulty, 3);
    pickFrom(candidates, 3);

    final options = <int>[currentWordId, ...picked.take(3)];
    options.shuffle(rnd);
    return options;
  }

  String _wordForId(int wordId) {
    final inQueue = _wordLabelById[wordId];
    if (inQueue != null && inQueue.isNotEmpty) return inQueue;
    for (final v in _vocabularyOptions) {
      if (v.id == wordId) return v.word;
    }
    return 'Word #$wordId';
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
      final step = _currentTouchStep(_touch);
      final canRate = step >= 4;

      body = Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: Text(
              '${_index + 1} / ${_items.length}',
              style: Theme.of(context).textTheme.titleSmall,
            ),
          ),
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              onPageChanged: _onPageChanged,
              itemCount: _items.length,
              itemBuilder: (context, i) {
                final item = _items[i];
                final label = _wordForId(item.wordId);
                if (i != _index) {
                  return ReviewFlashcard(
                    wordLabel: label,
                    subtitle: 'Swipe to this card to review',
                    showTouch: false,
                  );
                }
                return ReviewFlashcard(
                  wordLabel: label,
                  subtitle: 'SRS level ${item.level}',
                  showTouch: true,
                  touch: _touch,
                  touchStep: step,
                  stepLabel: _stepLabel,
                  onCompleteTouchStep: () => _completeTouchStep(step),
                  submittingTouch: _submittingTouch,
                );
              },
            ),
          ),
          ReviewRatingBar(
            enabled: canRate,
            onAgain: () => _rate('Again', false),
            onHard: () => _rate('Hard', true),
            onGood: () => _rate('Good', true),
            onEasy: () => _rate('Easy', true),
          ),
        ],
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Review')),
      body: body,
      bottomNavigationBar: const AppBottomNav(currentPath: '/review'),
    );
  }
}
