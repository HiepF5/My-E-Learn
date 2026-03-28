import 'api_client.dart';

class LearningState {
  const LearningState({this.lastReviewWordId, this.lastScreen});

  final int? lastReviewWordId;
  final String? lastScreen;

  factory LearningState.fromJson(Map<String, dynamic> json) {
    return LearningState(
      lastReviewWordId: (json['last_review_word_id'] as num?)?.toInt(),
      lastScreen: json['last_screen'] as String?,
    );
  }
}

class LearningStateService {
  LearningStateService(this._api);

  final ApiClient _api;

  Future<LearningState> getState() async {
    try {
      final res = await _api.dio.get('/me/learning-state');
      final d = res.data['data'];
      if (d is Map) {
        return LearningState.fromJson(d.cast<String, dynamic>());
      }
    } catch (_) {}
    return const LearningState();
  }

  /// Sends PATCH. Use [clearLastReviewWord] to set `last_review_word_id` to null on server.
  Future<void> patch({
    int? lastReviewWordId,
    bool clearLastReviewWord = false,
    String? lastScreen,
  }) async {
    final body = <String, dynamic>{};
    if (clearLastReviewWord) {
      body['last_review_word_id'] = null;
    } else if (lastReviewWordId != null) {
      body['last_review_word_id'] = lastReviewWordId;
    }
    if (lastScreen != null) {
      body['last_screen'] = lastScreen;
    }
    if (body.isEmpty) return;
    try {
      await _api.dio.patch('/me/learning-state', data: body);
    } catch (_) {}
  }
}
