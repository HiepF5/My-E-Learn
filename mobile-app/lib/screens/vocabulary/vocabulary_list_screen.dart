import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/vocabulary_row.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/vocabulary_service.dart';
import '../../widgets/app_bottom_nav.dart';

class VocabularyListScreen extends ConsumerStatefulWidget {
  const VocabularyListScreen({super.key});

  @override
  ConsumerState<VocabularyListScreen> createState() => _VocabularyListScreenState();
}

class _VocabularyListScreenState extends ConsumerState<VocabularyListScreen> {
  bool _loading = true;
  String _q = '';
  List<VocabularyRow> _rows = const [];

  @override
  void initState() {
    super.initState();
    _load();
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
    final filtered = _rows.where((r) {
      if (_q.trim().isEmpty) return true;
      final s = _q.toLowerCase();
      final word = r.word.toLowerCase();
      final m = r.meaning?.toLowerCase() ?? '';
      return word.contains(s) || m.contains(s);
    }).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Vocabulary')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                  child: TextField(
                    decoration: const InputDecoration(
                      hintText: 'Search word or meaning',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                    onChanged: (v) => setState(() => _q = v),
                  ),
                ),
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (context, i) {
                      final r = filtered[i];
                      return ListTile(
                        title: Text(r.word),
                        subtitle: Text(
                          (r.meaning != null && r.meaning!.isNotEmpty)
                              ? r.meaning!
                              : (r.exampleSentence ?? ''),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        trailing: Text(
                          r.difficulty != null ? 'D${r.difficulty}' : '',
                          style: Theme.of(context).textTheme.labelSmall,
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
      bottomNavigationBar: const AppBottomNav(currentPath: '/vocabulary'),
    );
  }
}
