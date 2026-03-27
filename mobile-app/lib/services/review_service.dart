import '../models/review_item.dart';
import 'api_client.dart';

class ReviewService {
  ReviewService(this._apiClient);
  final ApiClient _apiClient;

  Future<List<ReviewItem>> getTodayReview({int limit = 20}) async {
    final res = await _apiClient.dio.get('/review/today', queryParameters: {'limit': limit});
    final data = (res.data['data'] as List<dynamic>? ?? [])
        .map((e) => ReviewItem.fromJson(e as Map<String, dynamic>))
        .toList();
    return data;
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
