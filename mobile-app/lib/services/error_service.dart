import 'api_client.dart';
import 'cache_service.dart';

class ErrorService {
  ErrorService(this._apiClient, this._cacheService);
  final ApiClient _apiClient;
  final CacheService _cacheService;

  Future<List<dynamic>> getErrors() async {
    try {
      final res = await _apiClient.dio.get('/errors');
      final raw = (res.data['data'] as List<dynamic>? ?? []);
      await _cacheService.writeJson('errors_list', raw);
      return raw;
    } catch (_) {
      return _cacheService.readJson<List<dynamic>>('errors_list') ?? [];
    }
  }
}
