import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../models/vocabulary_row.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/vocabulary_service.dart';
import '../../widgets/flip_word_card.dart';

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
                          return _BrowseFlipPage(row: _rows[i]);
                        },
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        'Swipe to browse. This does not affect your review schedule.',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                      ),
                    ),
                  ],
                ),
    );
  }
}

class _BrowseFlipPage extends StatelessWidget {
  const _BrowseFlipPage({required this.row});

  final VocabularyRow row;

  @override
  Widget build(BuildContext context) {
    final r = row;
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              Expanded(
                child: FlipWordCard(
                  flipKey: r.id,
                  word: r.word,
                  phonetic: r.phonetic,
                  meaning: r.meaning,
                  exampleSentence: r.exampleSentence,
                  minHeight: 280,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Chạm thẻ để lật',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
