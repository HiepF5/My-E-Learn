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

  static const double _radius = 20;

  @override
  Widget build(BuildContext context) {
    final baseOutlined = Theme.of(context).outlinedButtonTheme.style;
    final baseFilled = Theme.of(context).filledButtonTheme.style;
    final outlinedShape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(_radius),
    );
    final filledShape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(_radius),
    );

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
                  style: baseOutlined?.copyWith(
                    minimumSize: const WidgetStatePropertyAll(Size(0, 52)),
                    padding: const WidgetStatePropertyAll(
                      EdgeInsets.symmetric(horizontal: 8, vertical: 14),
                    ),
                    shape: WidgetStatePropertyAll(outlinedShape),
                  ),
                  onPressed: enabled ? onAgain : null,
                  child: const Text('Again'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton(
                  style: baseOutlined?.copyWith(
                    minimumSize: const WidgetStatePropertyAll(Size(0, 52)),
                    padding: const WidgetStatePropertyAll(
                      EdgeInsets.symmetric(horizontal: 8, vertical: 14),
                    ),
                    shape: WidgetStatePropertyAll(outlinedShape),
                  ),
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
                  style: baseFilled?.copyWith(
                    minimumSize: const WidgetStatePropertyAll(Size(0, 52)),
                    padding: const WidgetStatePropertyAll(
                      EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                    ),
                    shape: WidgetStatePropertyAll(filledShape),
                  ),
                  onPressed: enabled ? onGood : null,
                  child: const Text('Good'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: FilledButton.tonal(
                  style: baseFilled?.copyWith(
                    minimumSize: const WidgetStatePropertyAll(Size(0, 52)),
                    padding: const WidgetStatePropertyAll(
                      EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                    ),
                    shape: WidgetStatePropertyAll(
                      RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(_radius),
                      ),
                    ),
                  ),
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
