import 'package:flutter/material.dart';

class TodayProgressCard extends StatelessWidget {
  const TodayProgressCard({
    super.key,
    required this.reviewDue,
    required this.newWords,
    required this.topErrors,
  });

  final int reviewDue;
  final int newWords;
  final int topErrors;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Today Mission', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Text('Review due: $reviewDue'),
            Text('New words: $newWords'),
            Text('Top errors to fix: $topErrors'),
          ],
        ),
      ),
    );
  }
}
