class VocabularyRow {
  const VocabularyRow({
    required this.id,
    required this.word,
    this.meaning,
    this.exampleSentence,
    this.difficulty,
    this.topicIds = const [],
  });

  final int id;
  final String word;
  final String? meaning;
  final String? exampleSentence;
  final int? difficulty;
  final List<int> topicIds;

  factory VocabularyRow.fromJson(Map<String, dynamic> json) {
    final rawTopics = json['topic_ids'] as List<dynamic>? ?? [];
    return VocabularyRow(
      id: (json['id'] as num?)?.toInt() ?? 0,
      word: (json['word'] as String?)?.trim() ?? '',
      meaning: json['meaning'] as String?,
      exampleSentence: json['example_sentence'] as String?,
      difficulty: (json['difficulty'] as num?)?.toInt(),
      topicIds: rawTopics.map((e) => (e as num).toInt()).toList(),
    );
  }
}
