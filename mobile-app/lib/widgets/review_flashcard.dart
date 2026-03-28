import 'package:flutter/material.dart';
import '../models/touch_history_item.dart';

/// Swipeable flashcard body: word + optional 3-touch block.
class ReviewFlashcard extends StatelessWidget {
  const ReviewFlashcard({
    super.key,
    required this.wordLabel,
    required this.subtitle,
    this.showTouch = true,
    this.touch,
    this.touchStep = 1,
    this.stepLabel,
    this.onCompleteTouchStep,
    this.submittingTouch = false,
  });

  final String wordLabel;
  final String subtitle;
  final bool showTouch;
  final TouchHistoryItem? touch;
  final int touchStep;
  final String Function(int step)? stepLabel;
  final VoidCallback? onCompleteTouchStep;
  final bool submittingTouch;

  @override
  Widget build(BuildContext context) {
    final labelFn = stepLabel ?? (int s) {
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
          elevation: 2,
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  wordLabel,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                Text(
                  subtitle,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.black54),
                ),
                if (showTouch) ...[
                  const SizedBox(height: 20),
                  Text(
                    '3-touch: ${labelFn(touchStep)}',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleSmall,
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
                    const SizedBox(height: 20),
                    FilledButton(
                      onPressed: submittingTouch ? null : onCompleteTouchStep,
                      child: Text(submittingTouch ? 'Saving...' : 'Complete ${labelFn(touchStep)}'),
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
