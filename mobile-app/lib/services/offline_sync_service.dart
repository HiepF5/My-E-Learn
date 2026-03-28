import 'review_service.dart';
import 'api_client.dart';
import 'cache_service.dart';

/// Offline helpers: flush pending review actions and cache server vocabulary for offline browse.
class OfflineSyncService {
  OfflineSyncService(this._apiClient, this._cacheService);

  final ApiClient _apiClient;
  final CacheService _cacheService;

  static const _vocabSyncKey = 'vocabulary_full_sync';
  static const _vocabSyncCursorKey = 'vocabulary_sync_cursor';

  /// Flush queued review/touch actions written to Hive while offline.
  Future<void> pushPendingLearningActions() async {
    final review = ReviewService(_apiClient, _cacheService);
    await review.syncPendingActions();
  }

  /// Delta sync from `GET /vocabulary/sync` and merge into Hive (server wins per row).
  Future<void> syncVocabularyCache() async {
    await syncVocabularyDelta();
  }

  Future<void> syncVocabularyDelta() async {
    try {
      final cursor = _cacheService.readJson<String>(_vocabSyncCursorKey);
      final res = await _apiClient.dio.get(
        '/vocabulary/sync',
        queryParameters: (cursor != null && cursor.isNotEmpty) ? {'since': cursor} : null,
      );
      final d = res.data['data'];
      if (d is! Map) return;
      final items = d['items'] as List<dynamic>? ?? [];
      final nextCursor = d['sync_cursor'] as String?;
      if (nextCursor != null && nextCursor.isNotEmpty) {
        await _cacheService.writeJson(_vocabSyncCursorKey, nextCursor);
      }
      if (items.isEmpty) return;

      final existing = _cacheService.readJson<List<dynamic>>(_vocabSyncKey) ?? [];
      final byId = <int, Map<String, dynamic>>{};
      for (final e in existing) {
        if (e is Map) {
          final m = Map<String, dynamic>.from(e);
          final id = (m['id'] as num?)?.toInt();
          if (id != null) byId[id] = m;
        }
      }
      for (final e in items) {
        if (e is Map) {
          final m = Map<String, dynamic>.from(e);
          final id = (m['id'] as num?)?.toInt();
          if (id != null) byId[id] = m;
        }
      }
      await _cacheService.writeJson(_vocabSyncKey, byId.values.toList());
    } catch (_) {
      /* keep last cache */
    }
  }

  /// Last successful vocabulary snapshot (same shape as API list).
  List<dynamic>? readCachedVocabulary() {
    return _cacheService.readJson<List<dynamic>>(_vocabSyncKey);
  }
}
