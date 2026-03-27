import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/phase_k_service.dart';

class DailySummaryScreen extends ConsumerStatefulWidget {
  const DailySummaryScreen({super.key});

  @override
  ConsumerState<DailySummaryScreen> createState() => _DailySummaryScreenState();
}

class _DailySummaryScreenState extends ConsumerState<DailySummaryScreen> {
  bool _loading = true;
  List<dynamic> _speaking = const [];
  List<dynamic> _writing = const [];
  List<dynamic> _feedback = const [];
  final _sPromptCtrl = TextEditingController();
  final _sTextCtrl = TextEditingController();
  final _wPromptCtrl = TextEditingController();
  final _wTextCtrl = TextEditingController();
  final _fTextCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _sPromptCtrl.dispose();
    _sTextCtrl.dispose();
    _wPromptCtrl.dispose();
    _wTextCtrl.dispose();
    _fTextCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final service = PhaseKService(ref.read(apiClientProvider), CacheService());
    final s = await service.getSpeakingRecords();
    final w = await service.getWritingRecords();
    final f = await service.getAiFeedback();
    if (!mounted) return;
    setState(() {
      _speaking = s;
      _writing = w;
      _feedback = f;
      _loading = false;
    });
  }

  Future<void> _saveSpeaking() async {
    final service = PhaseKService(ref.read(apiClientProvider), CacheService());
    await service.createSpeakingRecord(
      promptText: _sPromptCtrl.text.trim().isEmpty ? null : _sPromptCtrl.text.trim(),
      transcriptText: _sTextCtrl.text.trim().isEmpty ? null : _sTextCtrl.text.trim(),
    );
    _sPromptCtrl.clear();
    _sTextCtrl.clear();
    _load();
  }

  Future<void> _saveWriting() async {
    final service = PhaseKService(ref.read(apiClientProvider), CacheService());
    await service.createWritingRecord(
      promptText: _wPromptCtrl.text.trim().isEmpty ? null : _wPromptCtrl.text.trim(),
      writtenText: _wTextCtrl.text.trim().isEmpty ? null : _wTextCtrl.text.trim(),
    );
    _wPromptCtrl.clear();
    _wTextCtrl.clear();
    _load();
  }

  Future<void> _saveFeedback() async {
    final value = _fTextCtrl.text.trim();
    if (value.isEmpty) return;
    final service = PhaseKService(ref.read(apiClientProvider), CacheService());
    await service.createAiFeedback(feedbackText: value);
    _fTextCtrl.clear();
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daily Summary + Phase K')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                const Card(
                  child: ListTile(
                    title: Text('15 words reviewed'),
                    subtitle: Text('4 mistakes, 2 weak words, streak +1'),
                  ),
                ),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Speaking record'),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _sPromptCtrl,
                          decoration: const InputDecoration(labelText: 'Prompt'),
                        ),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _sTextCtrl,
                          decoration: const InputDecoration(labelText: 'Transcript'),
                        ),
                        const SizedBox(height: 8),
                        FilledButton(onPressed: _saveSpeaking, child: const Text('Save speaking')),
                      ],
                    ),
                  ),
                ),
                ..._speaking.take(3).map((e) {
                  final item = (e as Map).cast<String, dynamic>();
                  return ListTile(
                    title: Text(item['transcript_text']?.toString() ?? '-'),
                    subtitle: Text('Score: ${item['score'] ?? '-'}'),
                  );
                }),
                const Divider(),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Writing record'),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _wPromptCtrl,
                          decoration: const InputDecoration(labelText: 'Prompt'),
                        ),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _wTextCtrl,
                          decoration: const InputDecoration(labelText: 'Written text'),
                        ),
                        const SizedBox(height: 8),
                        FilledButton(onPressed: _saveWriting, child: const Text('Save writing')),
                      ],
                    ),
                  ),
                ),
                ..._writing.take(3).map((e) {
                  final item = (e as Map).cast<String, dynamic>();
                  return ListTile(
                    title: Text(item['written_text']?.toString() ?? '-'),
                    subtitle: Text('Score: ${item['score'] ?? '-'}'),
                  );
                }),
                const Divider(),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('AI feedback'),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _fTextCtrl,
                          decoration: const InputDecoration(labelText: 'Feedback text'),
                        ),
                        const SizedBox(height: 8),
                        FilledButton(onPressed: _saveFeedback, child: const Text('Save feedback')),
                      ],
                    ),
                  ),
                ),
                ..._feedback.take(3).map((e) {
                  final item = (e as Map).cast<String, dynamic>();
                  return ListTile(
                    title: Text(item['feedback_text']?.toString() ?? '-'),
                    subtitle: Text('Type: ${item['source_type'] ?? '-'}'),
                  );
                }),
              ],
            ),
    );
  }
}
