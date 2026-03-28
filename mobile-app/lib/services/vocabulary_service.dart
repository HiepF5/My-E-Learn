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

  Future<VocabularyRow?> getVocabularyById(int id) async {
    if (id <= 0) return null;
    try {
      final res = await _apiClient.dio.get('/vocabulary/$id');
      final d = res.data['data'];
      if (d is Map) {
        return VocabularyRow.fromJson(d.cast<String, dynamic>());
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  Future<List<Map<String, dynamic>>> getCollocations(int wordId) async {
    if (wordId <= 0) return [];
    try {
      final res = await _apiClient.dio.get('/vocabulary/$wordId/collocations');
      final raw = res.data['data'];
      if (raw is! List) return [];
      return raw.map((e) => (e as Map).cast<String, dynamic>()).toList();
    } catch (_) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> getWordFamily(int wordId) async {
    if (wordId <= 0) return [];
    try {
      final res = await _apiClient.dio.get('/vocabulary/$wordId/word-family');
      final raw = res.data['data'];
      if (raw is! List) return [];
      return raw.map((e) => (e as Map).cast<String, dynamic>()).toList();
    } catch (_) {
      return [];
    }
  }
}
