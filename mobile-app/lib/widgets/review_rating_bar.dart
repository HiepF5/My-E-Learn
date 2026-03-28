import 'package:flutter/material.dart';

/// Four SRS rating buttons (Again / Hard / Good / Easy) for review submit.
class ReviewRatingBar extends StatelessWidget {
  const ReviewRatingBar({
    super.key,
    required this.enabled,
    required this.onAgain,
    required this.onHard,
    required this.onGood,
    required this.onEasy,
  });

  final bool enabled;
  final VoidCallback onAgain;
  final VoidCallback onHard;
  final VoidCallback onGood;
  final VoidCallback onEasy;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Rate',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.labelLarge,
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: enabled ? onAgain : null,
                  child: const Text('Again'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton(
                  onPressed: enabled ? onHard : null,
                  child: const Text('Hard'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: FilledButton(
                  onPressed: enabled ? onGood : null,
                  child: const Text('Good'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: FilledButton.tonal(
                  onPressed: enabled ? onEasy : null,
                  child: const Text('Easy'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
