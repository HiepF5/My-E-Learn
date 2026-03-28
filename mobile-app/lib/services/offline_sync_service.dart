import 'review_service.dart';
import 'api_client.dart';
import 'cache_service.dart';

/// Offline helpers: flush pending review actions and cache server vocabulary for offline browse.
class OfflineSyncService {
  OfflineSyncService(this._apiClient, this._cacheService);

  final ApiClient _apiClient;
  final CacheService _cacheService;

  static const _vocabSyncKey = 'vocabulary_full_sync';

  /// Flush queued review/touch actions written to Hive while offline.
  Future<void> pushPendingLearningActions() async {
    final review = ReviewService(_apiClient, _cacheService);
    await review.syncPendingActions();
  }

  /// Pull full vocabulary list into Hive for list/detail when network drops.
  Future<void> syncVocabularyCache() async {
    try {
      final res = await _apiClient.dio.get('/vocabulary');
      final raw = res.data['data'];
      if (raw is List) {
        await _cacheService.writeJson(_vocabSyncKey, raw);
      }
    } catch (_) {
      /* keep last cache */
    }
  }

  /// Last successful vocabulary snapshot (same shape as API list).
  List<dynamic>? readCachedVocabulary() {
    return _cacheService.readJson<List<dynamic>>(_vocabSyncKey);
  }
}
