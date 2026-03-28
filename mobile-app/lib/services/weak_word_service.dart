import 'api_client.dart';

class WeakWordEntry {
  const WeakWordEntry({
    required this.wordId,
    required this.weakScore,
    this.wrongCountSnapshot,
    this.correctCountSnapshot,
    this.recentWrongCount,
  });

  final int wordId;
  final double weakScore;
  final int? wrongCountSnapshot;
  final int? correctCountSnapshot;
  final int? recentWrongCount;

  factory WeakWordEntry.fromJson(Map<String, dynamic> json) {
    return WeakWordEntry(
      wordId: (json['word_id'] as num?)?.toInt() ?? 0,
      weakScore: (json['weak_score'] as num?)?.toDouble() ?? 0,
      wrongCountSnapshot: (json['wrong_count_snapshot'] as num?)?.toInt(),
      correctCountSnapshot: (json['correct_count_snapshot'] as num?)?.toInt(),
      recentWrongCount: (json['recent_wrong_count'] as num?)?.toInt(),
    );
  }
}

class WeakWordService {
  WeakWordService(this._api);

  final ApiClient _api;

  Future<List<WeakWordEntry>> list({int limit = 40}) async {
    final res = await _api.dio.get('/weak-words', queryParameters: {'limit': limit});
    final raw = res.data['data'];
    if (raw is! List) return [];
    return raw
        .map((e) => WeakWordEntry.fromJson((e as Map).cast<String, dynamic>()))
        .where((w) => w.wordId > 0)
        .toList();
  }
}
