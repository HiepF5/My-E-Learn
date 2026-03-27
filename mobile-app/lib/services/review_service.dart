import '../models/review_item.dart';
import 'api_client.dart';
import 'cache_service.dart';

class ReviewService {
  ReviewService(this._apiClient, this._cacheService);
  final ApiClient _apiClient;
  final CacheService _cacheService;

  Future<List<ReviewItem>> getTodayReview({int limit = 20}) async {
    try {
      final res = await _apiClient.dio.get('/review/today', queryParameters: {'limit': limit});
      final raw = (res.data['data'] as List<dynamic>? ?? []);
      await _cacheService.writeJson('review_today', raw);
      return raw.map((e) => ReviewItem.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      final cached = _cacheService.readJson<List<dynamic>>('review_today') ?? [];
      return cached.map((e) => ReviewItem.fromJson((e as Map).cast<String, dynamic>())).toList();
    }
  }

  Future<void> submitReview({
    required int wordId,
    required bool answerResult,
    required String rating,
  }) async {
    await _apiClient.dio.post('/review/submit', data: {
      'word_id': wordId,
      'answer_result': answerResult,
      'rating': rating,
    });
  }
}
