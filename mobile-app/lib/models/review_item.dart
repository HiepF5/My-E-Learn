class ReviewItem {
  const ReviewItem({
    required this.id,
    required this.wordId,
    required this.level,
    required this.wrongCount,
  });

  final int id;
  final int wordId;
  final int level;
  final int wrongCount;

  factory ReviewItem.fromJson(Map<String, dynamic> json) {
    return ReviewItem(
      id: (json['id'] as num?)?.toInt() ?? 0,
      wordId: (json['word_id'] as num?)?.toInt() ?? 0,
      level: (json['level'] as num?)?.toInt() ?? 1,
      wrongCount: (json['wrong_count'] as num?)?.toInt() ?? 0,
    );
  }
}
