import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/vocabulary_row.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/vocabulary_service.dart';
import '../../widgets/app_bottom_nav.dart';

class VocabularyDetailScreen extends ConsumerStatefulWidget {
  const VocabularyDetailScreen({super.key, required this.wordId});

  final int wordId;

  @override
  ConsumerState<VocabularyDetailScreen> createState() => _VocabularyDetailScreenState();
}

class _VocabularyDetailScreenState extends ConsumerState<VocabularyDetailScreen> {
  bool _loading = true;
  VocabularyRow? _row;
  List<Map<String, dynamic>> _collocations = const [];
  List<Map<String, dynamic>> _family = const [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final svc = VocabularyService(ref.read(apiClientProvider), CacheService());
    final row = await svc.getVocabularyById(widget.wordId);
    final c = await svc.getCollocations(widget.wordId);
    final f = await svc.getWordFamily(widget.wordId);
    if (!mounted) return;
    setState(() {
      _row = row;
      _collocations = c;
      _family = f;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final r = _row;

    return Scaffold(
      appBar: AppBar(
        title: Text(r?.word ?? 'Word #${widget.wordId}'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : r == null
              ? const Center(child: Text('Not found'))
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    if (r.phonetic != null && r.phonetic!.trim().isNotEmpty)
                      Text(r.phonetic!, style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 8),
                    if (r.meaning != null && r.meaning!.isNotEmpty)
                      Text(r.meaning!, style: Theme.of(context).textTheme.bodyLarge),
                    if (r.exampleSentence != null && r.exampleSentence!.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Text(r.exampleSentence!, style: Theme.of(context).textTheme.bodyMedium),
                    ],
                    const SizedBox(height: 20),
                    Text('Collocations', style: Theme.of(context).textTheme.titleSmall),
                    const SizedBox(height: 8),
                    if (_collocations.isEmpty)
                      Text('None', style: Theme.of(context).textTheme.bodySmall)
                    else
                      ..._collocations.map((m) {
                        final text = m['collocation'] as String? ?? m['text'] as String? ?? '$m';
                        final ex = m['example'] as String?;
                        return ListTile(
                          dense: true,
                          title: Text(text),
                          subtitle: ex != null && ex.isNotEmpty ? Text(ex) : null,
                        );
                      }),
                    const SizedBox(height: 16),
                    Text('Word family', style: Theme.of(context).textTheme.titleSmall),
                    const SizedBox(height: 8),
                    if (_family.isEmpty)
                      Text('None', style: Theme.of(context).textTheme.bodySmall)
                    else
                      ..._family.map((m) {
                        final rel = m['related_word'] as String? ?? m['word'] as String? ?? '$m';
                        final type = m['relation_type'] as String?;
                        return ListTile(
                          dense: true,
                          title: Text(rel),
                          subtitle: type != null && type.isNotEmpty ? Text(type) : null,
                        );
                      }),
                  ],
                ),
      bottomNavigationBar: const AppBottomNav(currentPath: '/vocabulary'),
    );
  }
}
