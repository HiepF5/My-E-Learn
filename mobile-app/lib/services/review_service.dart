import '../models/review_item.dart';
import '../models/touch_history_item.dart';
import 'api_client.dart';
import 'cache_service.dart';

class ReviewService {
  ReviewService(this._apiClient, this._cacheService);
  final ApiClient _apiClient;
  final CacheService _cacheService;
  static const _pendingReviewKey = 'pending_review_submit';
  static const _pendingTouchKey = 'pending_touch_patch';

  Future<List<ReviewItem>> getTodayReview({int limit = 20}) async {
    await syncPendingActions();
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
    final payload = {
      'word_id': wordId,
      'answer_result': answerResult,
      'rating': rating,
    };

    try {
      await _apiClient.dio.post('/review/submit', data: payload);
    } catch (_) {
      await _enqueuePending(_pendingReviewKey, payload);
    }
  }

  Future<TouchHistoryItem?> getTouchHistory(int wordId) async {
    try {
      final res = await _apiClient.dio.get('/review/touch/$wordId');
      return TouchHistoryItem.fromJson((res.data['data'] as Map).cast<String, dynamic>());
    } catch (_) {
      return null;
    }
  }

  Future<void> patchTouchStep({
    required int wordId,
    required int touchStep,
    bool done = true,
  }) async {
    final payload = {
      'word_id': wordId,
      'touch_step': touchStep,
      'done': done,
    };

    try {
      await _apiClient.dio.patch('/review/touch/$wordId', data: {
        'touch_step': touchStep,
        'done': done,
      });
    } catch (_) {
      await _enqueuePending(_pendingTouchKey, payload);
    }
  }

  Future<void> syncPendingActions() async {
    await _syncPendingReviews();
    await _syncPendingTouches();
  }

  Future<void> _syncPendingReviews() async {
    final items = _readPending(_pendingReviewKey);
    if (items.isEmpty) return;

    final failed = <Map<String, dynamic>>[];
    for (final item in items) {
      try {
        await _apiClient.dio.post('/review/submit', data: item);
      } catch (_) {
        failed.add(item);
      }
    }
    await _cacheService.writeJson(_pendingReviewKey, failed);
  }

  Future<void> _syncPendingTouches() async {
    final items = _readPending(_pendingTouchKey);
    if (items.isEmpty) return;

    final failed = <Map<String, dynamic>>[];
    for (final item in items) {
      try {
        final wordId = item['word_id'];
        await _apiClient.dio.patch('/review/touch/$wordId', data: {
          'touch_step': item['touch_step'],
          'done': item['done'],
        });
      } catch (_) {
        failed.add(item);
      }
    }
    await _cacheService.writeJson(_pendingTouchKey, failed);
  }

  Future<void> _enqueuePending(String key, Map<String, dynamic> payload) async {
    final items = _readPending(key);
    items.add(payload);
    await _cacheService.writeJson(key, items);
  }

  List<Map<String, dynamic>> _readPending(String key) {
    final cached = _cacheService.readJson<List<dynamic>>(key) ?? [];
    return cached.map((e) => (e as Map).cast<String, dynamic>()).toList();
  }
}
