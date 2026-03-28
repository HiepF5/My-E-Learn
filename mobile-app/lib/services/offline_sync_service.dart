import 'review_service.dart';
import 'api_client.dart';
import 'cache_service.dart';

/// Hooks for future offline-first sync; currently delegates to [ReviewService.syncPendingActions].
class OfflineSyncService {
  OfflineSyncService(this._apiClient, this._cacheService);

  final ApiClient _apiClient;
  final CacheService _cacheService;

  /// Flush queued review/touch actions written to Hive while offline.
  Future<void> pushPendingLearningActions() async {
    final review = ReviewService(_apiClient, _cacheService);
    await review.syncPendingActions();
  }
}
