import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/vocabulary_row.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/favorites_service.dart';
import '../../services/vocabulary_note_service.dart';
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
  bool _favorite = false;
  final _noteCtrl = TextEditingController();
  bool _noteSaving = false;

  @override
  void dispose() {
    _noteCtrl.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final api = ref.read(apiClientProvider);
    final svc = VocabularyService(api, CacheService());
    final favSvc = FavoritesService(api);
    final noteSvc = VocabularyNoteService(api);
    final row = await svc.getVocabularyById(widget.wordId);
    final c = await svc.getCollocations(widget.wordId);
    final f = await svc.getWordFamily(widget.wordId);
    var isFav = false;
    String? note;
    try {
      isFav = await favSvc.isFavorite(widget.wordId);
      note = await noteSvc.getNote(widget.wordId);
    } catch (_) {}
    if (!mounted) return;
    setState(() {
      _row = row;
      _collocations = c;
      _family = f;
      _favorite = isFav;
      _noteCtrl.text = note ?? '';
      _loading = false;
    });
  }

  Future<void> _toggleFavorite() async {
    final api = ref.read(apiClientProvider);
    final favSvc = FavoritesService(api);
    try {
      if (_favorite) {
        await favSvc.remove(widget.wordId);
      } else {
        await favSvc.add(widget.wordId);
      }
      if (mounted) setState(() => _favorite = !_favorite);
    } catch (_) {}
  }

  Future<void> _saveNote() async {
    if (_noteSaving) return;
    setState(() => _noteSaving = true);
    final api = ref.read(apiClientProvider);
    final noteSvc = VocabularyNoteService(api);
    try {
      final t = _noteCtrl.text.trim();
      if (t.isEmpty) {
        await noteSvc.deleteNote(widget.wordId);
      } else {
        await noteSvc.saveNote(widget.wordId, t);
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Note saved')));
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Could not save note')));
      }
    } finally {
      if (mounted) setState(() => _noteSaving = false);
    }
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
        actions: [
          IconButton(
            tooltip: _favorite ? 'Remove favorite' : 'Add favorite',
            onPressed: _loading ? null : _toggleFavorite,
            icon: Icon(_favorite ? Icons.star_rounded : Icons.star_outline_rounded),
          ),
        ],
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
                    Text('Your note', style: Theme.of(context).textTheme.titleSmall),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _noteCtrl,
                      maxLines: 3,
                      decoration: const InputDecoration(
                        hintText: 'e.g. hay nhầm borrow/lend',
                        border: OutlineInputBorder(),
                        isDense: true,
                      ),
                    ),
                    const SizedBox(height: 8),
                    FilledButton.tonal(
                      onPressed: _noteSaving ? null : _saveNote,
                      child: Text(_noteSaving ? 'Saving...' : 'Save note'),
                    ),
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
