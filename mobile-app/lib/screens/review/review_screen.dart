import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/review_item.dart';
import '../../models/touch_history_item.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_client.dart';
import '../../services/cache_service.dart';
import '../../services/learning_state_service.dart';
import '../../services/review_service.dart';
import '../../widgets/app_bottom_nav.dart';
import '../../theme/app_theme.dart';
import '../../widgets/review_flashcard.dart';
import '../../widgets/review_rating_bar.dart';

class ReviewScreen extends ConsumerStatefulWidget {
  const ReviewScreen({super.key, this.reviewLimit = 20});

  /// Max cards from GET /review/today (Quick 3 min uses 5).
  final int reviewLimit;

  @override
  ConsumerState<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends ConsumerState<ReviewScreen> {
  List<ReviewItem> _items = const [];
  int _index = 0;
  bool _loading = true;
  TouchHistoryItem? _touch;
  bool _submittingTouch = false;
  bool _rateAck = false;
  int _ratedThisSession = 0;
  Map<int, String> _wordLabelById = const {};
  List<VocabularyOption> _vocabularyOptions = const [];
  late final PageController _pageController;
  late final ApiClient _api;

  int get _safeLimit => widget.reviewLimit.clamp(1, 100);

  @override
  void initState() {
    super.initState();
    _api = ref.read(apiClientProvider);
    _pageController = PageController();
    _load();
  }

  @override
  void dispose() {
    _persistExitState();
    _pageController.dispose();
    super.dispose();
  }

  void _persistExitState() {
    if (_items.isEmpty || _index >= _items.length) return;
    unawaited(
      LearningStateService(_api).patch(
        lastReviewWordId: _items[_index].wordId,
        lastScreen: 'review',
      ),
    );
  }

  Future<void> _load() async {
    final service = ReviewService(_api, CacheService());
    final learning = LearningStateService(_api);
    unawaited(learning.patch(lastScreen: 'review'));

    final data = await service.getTodayReview(limit: _safeLimit);
    final wordMap = await service.getVocabularyWordMapByIds(data.map((e) => e.wordId).toList());
    final vocabOptions = await service.getVocabularyOptions();
    final ls = await learning.getState();

    var startIndex = 0;
    if (ls.lastReviewWordId != null && data.isNotEmpty) {
      final j = data.indexWhere((e) => e.wordId == ls.lastReviewWordId);
      if (j >= 0) startIndex = j;
    }

    TouchHistoryItem? touch;
    if (data.isNotEmpty && startIndex < data.length) {
      touch = await service.getTouchHistory(data[startIndex].wordId);
    }
    if (!mounted) return;
    setState(() {
      _items = data;
      _wordLabelById = wordMap;
      _vocabularyOptions = vocabOptions;
      _touch = touch;
      _loading = false;
      _index = startIndex;
      _ratedThisSession = 0;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_pageController.hasClients || data.isEmpty) return;
      _pageController.jumpToPage(startIndex);
    });
  }

  Future<void> _loadTouchForCurrent() async {
    if (_items.isEmpty || _index >= _items.length) {
      if (!mounted) return;
      setState(() => _touch = null);
      return;
    }
    final service = ReviewService(_api, CacheService());
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
    final service = ReviewService(_api, CacheService());
    setState(() => _submittingTouch = true);
    await service.patchTouchStep(wordId: current.wordId, touchStep: step, done: true);
    await _loadTouchForCurrent();
    if (!mounted) return;
    setState(() => _submittingTouch = false);
  }

  Future<void> _showSessionCompleteDialog() async {
    final n = _ratedThisSession;
    if (!mounted) return;
    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Hoàn thành phiên'),
        content: Text(
          n > 0
              ? 'Bạn đã ôn $n từ trong phiên này. Hẹn gặp lại!'
              : 'Bạn đã xong hàng đợi hôm nay.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  Future<void> _rate(String rating, bool correct) async {
    if (_items.isEmpty || _index >= _items.length) return;
    final current = _items[_index];
    final service = ReviewService(_api, CacheService());
    final learning = LearningStateService(_api);
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
    setState(() => _rateAck = true);
    await Future.delayed(const Duration(milliseconds: 380));
    if (!mounted) return;
    setState(() => _rateAck = false);

    setState(() => _ratedThisSession++);
    final next = _index + 1;

    if (next < _items.length) {
      await learning.patch(
        lastReviewWordId: _items[next].wordId,
        lastScreen: 'review',
      );
      setState(() {
        _index = next;
        _touch = null;
      });
      await _pageController.animateToPage(
        next,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutCubic,
      );
      await _loadTouchForCurrent();
    } else {
      await learning.patch(clearLastReviewWord: true, lastScreen: 'review');
      await _showSessionCompleteDialog();
      if (!mounted) return;
      setState(() {
        _index = next;
        _touch = null;
        _items = [];
      });
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
      body = Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Done for today'),
            if (_ratedThisSession > 0) ...[
              const SizedBox(height: 12),
              Text(
                'Đã ôn $_ratedThisSession từ trong phiên này',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ],
          ],
        ),
      );
    } else {
      final step = _currentTouchStep(_touch);
      final canRate = step >= 4;

      final scheme = Theme.of(context).colorScheme;
      body = Stack(
        children: [
          Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${_index + 1} / ${_items.length}',
                          style: Theme.of(context).textTheme.titleSmall,
                        ),
                        Text(
                          step <= 3 ? 'Bước $step / 3 · ${_stepLabel(step)}' : 'Sẵn sàng chấm điểm',
                          style: Theme.of(context).textTheme.labelLarge?.copyWith(
                                color: scheme.primary,
                                fontWeight: FontWeight.w600,
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(AppRadii.progress),
                      child: LinearProgressIndicator(
                        value: step <= 3 ? step / 3 : 1,
                        minHeight: 6,
                        backgroundColor: scheme.surfaceContainerHighest,
                        color: step <= 3 ? scheme.primary : scheme.tertiary,
                      ),
                    ),
                  ],
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
                    final label = (item.word != null && item.word!.trim().isNotEmpty)
                        ? item.word!.trim()
                        : _wordForId(item.wordId);
                    if (i != _index) {
                      return ReviewFlashcard(
                        wordId: item.wordId,
                        wordLabel: label,
                        meaning: item.meaning,
                        exampleSentence: item.exampleSentence,
                        phonetic: item.phonetic,
                        subtitle: 'Next card after you rate',
                        showTouch: false,
                      );
                    }
                    return ReviewFlashcard(
                      wordId: item.wordId,
                      wordLabel: label,
                      meaning: item.meaning,
                      exampleSentence: item.exampleSentence,
                      phonetic: item.phonetic,
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
          ),
          if (_rateAck)
            Positioned.fill(
              child: IgnorePointer(
                child: Center(
                  child: Icon(
                    Icons.check_circle_rounded,
                    size: 88,
                    color: scheme.primary.withValues(alpha: 0.92),
                  )
                      .animate()
                      .scale(
                        duration: 220.ms,
                        curve: Curves.easeOutBack,
                        begin: const Offset(0.35, 0.35),
                        end: const Offset(1, 1),
                      )
                      .fadeIn(duration: 120.ms),
                ),
              ),
            ),
        ],
      );
    }

    final title = _safeLimit <= 5 ? 'Quick review' : 'Review';
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: body,
      bottomNavigationBar: const AppBottomNav(currentPath: '/review'),
    );
  }
}
