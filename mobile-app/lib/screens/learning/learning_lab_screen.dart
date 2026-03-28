import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/auth_provider.dart';

/// Phase 5: minimal UI for extended learning APIs (sentence mining, dictation, grammar micro).
class LearningLabScreen extends ConsumerStatefulWidget {
  const LearningLabScreen({super.key});

  @override
  ConsumerState<LearningLabScreen> createState() => _LearningLabScreenState();
}

class _LearningLabScreenState extends ConsumerState<LearningLabScreen> {
  final _sentenceCtrl = TextEditingController();
  final _dictExpected = TextEditingController();
  final _dictUser = TextEditingController();
  final _grammarAnswer = TextEditingController();
  bool _busy = false;
  String? _msg;

  @override
  void dispose() {
    _sentenceCtrl.dispose();
    _dictExpected.dispose();
    _dictUser.dispose();
    _grammarAnswer.dispose();
    super.dispose();
  }

  Future<void> _post(String path, Map<String, dynamic> body) async {
    setState(() {
      _busy = true;
      _msg = null;
    });
    try {
      final api = ref.read(apiClientProvider);
      await api.dio.post(path, data: body);
      if (!mounted) return;
      setState(() => _msg = 'Saved');
    } catch (e) {
      if (!mounted) return;
      setState(() => _msg = 'Error: $e');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Learning lab')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Sentence mining, dictation, and grammar micro log to the server (Phase 5).',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text('Mine a sentence', style: Theme.of(context).textTheme.titleSmall),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _sentenceCtrl,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: 'Paste a sentence you want to remember',
                    ),
                  ),
                  const SizedBox(height: 8),
                  FilledButton(
                    onPressed: _busy
                        ? null
                        : () => _post('/learning/sentence-mining', {
                              'sentence_text': _sentenceCtrl.text,
                            }),
                    child: const Text('Save sentence'),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text('Dictation check', style: Theme.of(context).textTheme.titleSmall),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _dictExpected,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Expected',
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _dictUser,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'What you heard / typed',
                    ),
                  ),
                  const SizedBox(height: 8),
                  FilledButton(
                    onPressed: _busy
                        ? null
                        : () => _post('/learning/dictation', {
                              'expected_text': _dictExpected.text,
                              'user_transcript': _dictUser.text,
                            }),
                    child: const Text('Submit dictation'),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text('Grammar micro (today)', style: Theme.of(context).textTheme.titleSmall),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _grammarAnswer,
                    maxLines: 2,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: 'Your answer',
                    ),
                  ),
                  const SizedBox(height: 8),
                  FilledButton(
                    onPressed: _busy
                        ? null
                        : () => _post('/learning/grammar-micro', {
                              'user_answer': _grammarAnswer.text,
                              'prompt': 'Daily micro (mobile)',
                            }),
                    child: const Text('Log grammar'),
                  ),
                ],
              ),
            ),
          ),
          if (_msg != null) ...[
            const SizedBox(height: 16),
            Text(_msg!, textAlign: TextAlign.center),
          ],
        ],
      ),
    );
  }
}
