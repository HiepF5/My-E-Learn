class TodayMission {
  const TodayMission({
    required this.date,
    required this.generatedAt,
    required this.reviewDueCount,
    required this.topErrorsCount,
    this.newWordsTarget,
    this.reviewQueueTarget,
    this.touchFocus,
    this.todayPlan,
  });

  final String date;
  final String generatedAt;
  final int reviewDueCount;
  final int topErrorsCount;
  final int? newWordsTarget;
  final int? reviewQueueTarget;
  final int? touchFocus;
  final Map<String, dynamic>? todayPlan;

  String? get primaryTopicName {
    final t = todayPlan?['topic'];
    if (t is Map<String, dynamic>) {
      return t['topic_name'] as String?;
    }
    return null;
  }

  String? get primaryTopicLevel {
    final t = todayPlan?['topic'];
    if (t is Map<String, dynamic>) {
      return t['level'] as String?;
    }
    return null;
  }

  factory TodayMission.fromJson(Map<String, dynamic> json) {
    final plan = json['today_plan'];
    return TodayMission(
      date: json['date'] as String? ?? '',
      generatedAt: json['generated_at'] as String? ?? '',
      reviewDueCount: (json['review_due_count'] as num?)?.toInt() ?? 0,
      topErrorsCount: (json['top_errors_count'] as num?)?.toInt() ?? 0,
      newWordsTarget: (json['new_words_target'] as num?)?.toInt(),
      reviewQueueTarget: (json['review_queue_target'] as num?)?.toInt(),
      touchFocus: (json['touch_focus'] as num?)?.toInt(),
      todayPlan: plan is Map<String, dynamic> ? plan : null,
    );
  }
}
