import 'package:flutter/material.dart';

import '../models/touch_history_item.dart';
import 'flip_word_card.dart';

/// SRS flashcard: [FlipWordCard] for flip + rounded card; touch + rating stay outside flip area.
class ReviewFlashcard extends StatelessWidget {
  const ReviewFlashcard({
    super.key,
    required this.wordId,
    required this.wordLabel,
    this.meaning,
    this.exampleSentence,
    this.phonetic,
    required this.subtitle,
    this.showTouch = true,
    this.touch,
    this.touchStep = 1,
    this.stepLabel,
    this.onCompleteTouchStep,
    this.submittingTouch = false,
  });

  final int wordId;
  final String wordLabel;
  final String? meaning;
  final String? exampleSentence;
  final String? phonetic;
  final String subtitle;
  final bool showTouch;
  final TouchHistoryItem? touch;
  final int touchStep;
  final String Function(int step)? stepLabel;
  final VoidCallback? onCompleteTouchStep;
  final bool submittingTouch;

  @override
  Widget build(BuildContext context) {
    final labelFn = stepLabel ??
        (int s) {
          if (s == 1) return 'Recognize';
          if (s == 2) return 'Type';
          if (s == 3) return 'Sentence';
          return 'Done';
        };
    final canRate = touchStep >= 4;

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(8),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                FlipWordCard(
                  flipKey: wordId,
                  word: wordLabel,
                  phonetic: phonetic,
                  meaning: meaning,
                  exampleSentence: exampleSentence,
                  minHeight: showTouch ? 260 : 280,
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 10),
                  child: Text(
                    'Chạm thẻ để lật',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  subtitle,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ),
                if (showTouch) ...[
                  const SizedBox(height: 18),
                  Text(
                    '3-touch: ${labelFn(touchStep)}',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'R:${touch?.touch1Done == true ? "✓" : "·"} '
                    'T:${touch?.touch2Done == true ? "✓" : "·"} '
                    'S:${touch?.touch3Done == true ? "✓" : "·"}',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  if (!canRate && onCompleteTouchStep != null) ...[
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: submittingTouch ? null : onCompleteTouchStep,
                      child: Text(
                        submittingTouch ? 'Đang lưu...' : 'Hoàn thành ${labelFn(touchStep)}',
                      ),
                    ),
                  ],
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
