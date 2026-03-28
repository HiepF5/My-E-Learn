import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../models/vocabulary_row.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/vocabulary_service.dart';

/// Browse-only flashcards: swipe between words; no SRS grading (Quizlet-style preview).
class VocabularyBrowseFlashcardScreen extends ConsumerStatefulWidget {
  const VocabularyBrowseFlashcardScreen({super.key});

  @override
  ConsumerState<VocabularyBrowseFlashcardScreen> createState() =>
      _VocabularyBrowseFlashcardScreenState();
}

class _VocabularyBrowseFlashcardScreenState extends ConsumerState<VocabularyBrowseFlashcardScreen> {
  bool _loading = true;
  List<VocabularyRow> _rows = const [];
  final PageController _pageController = PageController();
  int _index = 0;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final svc = VocabularyService(ref.read(apiClientProvider), CacheService());
    final rows = await svc.listVocabulary();
    if (!mounted) return;
    setState(() {
      _rows = rows;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Browse flashcards'),
        actions: [
          if (_rows.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Center(
                child: Text(
                  '${_index + 1} / ${_rows.length}',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
              ),
            ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _rows.isEmpty
              ? Center(
                  child: TextButton(
                    onPressed: () => context.pop(),
                    child: const Text('No words — back'),
                  ),
                )
              : Column(
                  children: [
                    Expanded(
                      child: PageView.builder(
                        controller: _pageController,
                        itemCount: _rows.length,
                        onPageChanged: (i) => setState(() => _index = i),
                        itemBuilder: (context, i) {
                          return _BrowseFlipCard(row: _rows[i]);
                        },
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        'Swipe to browse. This does not affect your review schedule.',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.black54),
                      ),
                    ),
                  ],
                ),
    );
  }
}

class _BrowseFlipCard extends StatefulWidget {
  const _BrowseFlipCard({required this.row});

  final VocabularyRow row;

  @override
  State<_BrowseFlipCard> createState() => _BrowseFlipCardState();
}

class _BrowseFlipCardState extends State<_BrowseFlipCard> {
  bool _showBack = false;

  @override
  void didUpdateWidget(covariant _BrowseFlipCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.row.id != widget.row.id) {
      _showBack = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    final r = widget.row;
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Card(
        elevation: 2,
        child: InkWell(
          onTap: () => setState(() => _showBack = !_showBack),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 260),
              switchInCurve: Curves.easeOutCubic,
              switchOutCurve: Curves.easeInCubic,
              transitionBuilder: (child, anim) {
                final slide = Tween<Offset>(
                  begin: const Offset(0, 0.05),
                  end: Offset.zero,
                ).animate(CurvedAnimation(parent: anim, curve: Curves.easeOutCubic));
                return FadeTransition(
                  opacity: anim,
                  child: SlideTransition(position: slide, child: child),
                );
              },
              child: _showBack ? _back(context, r) : _front(context, r),
            ),
          ),
        ),
      ),
    );
  }

  Widget _front(BuildContext context, VocabularyRow r) {
    return Column(
      key: ValueKey('f-${r.id}'),
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          r.word,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 12),
        Text(
          'Tap to show meaning',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Colors.black45),
        ),
      ],
    );
  }

  Widget _back(BuildContext context, VocabularyRow r) {
    final ph = r.phonetic?.trim();
    final meaning = r.meaning?.trim();
    final ex = r.exampleSentence?.trim();
    return Column(
      key: ValueKey('b-${r.id}'),
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (ph != null && ph.isNotEmpty)
          Text(ph, textAlign: TextAlign.center, style: Theme.of(context).textTheme.titleSmall),
        if (ph != null && ph.isNotEmpty) const SizedBox(height: 8),
        Text(
          (meaning != null && meaning.isNotEmpty) ? meaning : 'No meaning',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        if (ex != null && ex.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text(ex, textAlign: TextAlign.center, style: Theme.of(context).textTheme.bodyMedium),
        ],
      ],
    );
  }
}
