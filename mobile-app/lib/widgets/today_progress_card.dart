import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class TodayProgressCard extends StatelessWidget {
  const TodayProgressCard({
    super.key,
    required this.reviewDue,
    required this.newWords,
    required this.topErrors,
    this.reviewGoal = 20,
  });

  final int reviewDue;
  final int newWords;
  final int topErrors;
  /// Denominator for the review queue bar (e.g. daily cap / mission target).
  final int reviewGoal;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final goal = reviewGoal > 0 ? reviewGoal : 20;
    final reviewRatio = (reviewDue / goal).clamp(0.0, 1.0);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Today Mission', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            Text(
              'Hàng đợi ôn: $reviewDue từ (mục tiêu ~$goal)',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadii.progress),
              child: LinearProgressIndicator(
                value: reviewRatio,
                minHeight: 10,
                backgroundColor: scheme.surfaceContainerHighest,
              ),
            ),
            const SizedBox(height: 12),
            Text('New words target: $newWords'),
            Text('Top errors to fix: $topErrors'),
          ],
        ),
      ),
    );
  }
}
