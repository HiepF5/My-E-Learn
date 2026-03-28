import '../models/vocabulary_row.dart';
import 'api_client.dart';
import 'cache_service.dart';

class VocabularyService {
  VocabularyService(this._apiClient, this._cacheService);

  final ApiClient _apiClient;
  final CacheService _cacheService;

  static const _cacheKey = 'vocabulary_list';

  Future<List<VocabularyRow>> listVocabulary() async {
    try {
      final res = await _apiClient.dio.get('/vocabulary');
      final raw = (res.data['data'] as List<dynamic>? ?? []);
      final rows = raw
          .map((e) => VocabularyRow.fromJson((e as Map).cast<String, dynamic>()))
          .where((r) => r.id > 0 && r.word.isNotEmpty)
          .toList();
      await _cacheService.writeJson(_cacheKey, raw);
      return rows;
    } catch (_) {
      final cached = _cacheService.readJson<List<dynamic>>(_cacheKey) ?? [];
      return cached
          .map((e) => VocabularyRow.fromJson((e as Map).cast<String, dynamic>()))
          .where((r) => r.id > 0 && r.word.isNotEmpty)
          .toList();
    }
  }
}
