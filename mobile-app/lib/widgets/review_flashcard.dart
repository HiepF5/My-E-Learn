import 'package:flutter/material.dart';
import '../models/touch_history_item.dart';

/// Flashcard with tap-to-flip (front: word; back: meaning / example). SRS advance stays post-grade only.
class ReviewFlashcard extends StatefulWidget {
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
  State<ReviewFlashcard> createState() => _ReviewFlashcardState();
}

class _ReviewFlashcardState extends State<ReviewFlashcard> {
  bool _showBack = false;

  @override
  void didUpdateWidget(covariant ReviewFlashcard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.wordId != widget.wordId) {
      _showBack = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    final labelFn = widget.stepLabel ??
        (int s) {
          if (s == 1) return 'Recognize';
          if (s == 2) return 'Type';
          if (s == 3) return 'Sentence';
          return 'Done';
        };
    final canRate = widget.touchStep >= 4;

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
                Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () => setState(() => _showBack = !_showBack),
                    borderRadius: BorderRadius.circular(8),
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 220),
                      transitionBuilder: (child, anim) =>
                          FadeTransition(opacity: anim, child: child),
                      child: _showBack ? _buildBack(context) : _buildFront(context),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text(
                    'Tap card to flip',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Colors.black45),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  widget.subtitle,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.black54),
                ),
                if (widget.showTouch) ...[
                  const SizedBox(height: 20),
                  Text(
                    '3-touch: ${labelFn(widget.touchStep)}',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'R:${widget.touch?.touch1Done == true ? "✓" : "·"} '
                    'T:${widget.touch?.touch2Done == true ? "✓" : "·"} '
                    'S:${widget.touch?.touch3Done == true ? "✓" : "·"}',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  if (!canRate && widget.onCompleteTouchStep != null) ...[
                    const SizedBox(height: 20),
                    FilledButton(
                      onPressed: widget.submittingTouch ? null : widget.onCompleteTouchStep,
                      child: Text(
                        widget.submittingTouch ? 'Saving...' : 'Complete ${labelFn(widget.touchStep)}',
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

  Widget _buildFront(BuildContext context) {
    return Column(
      key: const ValueKey('front'),
      children: [
        Text(
          widget.wordLabel,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w600),
        ),
      ],
    );
  }

  Widget _buildBack(BuildContext context) {
    final meaning = widget.meaning?.trim();
    final ex = widget.exampleSentence?.trim();
    final ph = widget.phonetic?.trim();
    return Column(
      key: const ValueKey('back'),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (ph != null && ph.isNotEmpty)
          Text(ph, textAlign: TextAlign.center, style: Theme.of(context).textTheme.titleSmall),
        if (ph != null && ph.isNotEmpty) const SizedBox(height: 8),
        Text(
          (meaning != null && meaning.isNotEmpty) ? meaning : 'No meaning yet',
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
