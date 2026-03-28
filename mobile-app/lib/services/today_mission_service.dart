import '../models/today_mission.dart';
import 'api_client.dart';
import 'cache_service.dart';

class TodayMissionService {
  TodayMissionService(this._apiClient, this._cacheService);

  final ApiClient _apiClient;
  final CacheService _cacheService;

  static const _cacheKey = 'today_mission';

  Future<TodayMission?> getTodayMission({int? reviewCap}) async {
    try {
      final res = await _apiClient.dio.get(
        '/topics/today',
        queryParameters: {
          if (reviewCap != null) 'review_cap': reviewCap,
        },
      );
      final raw = res.data;
      final data = raw is Map ? raw['data'] : null;
      if (data is! Map<String, dynamic>) return null;
      final mission = TodayMission.fromJson(data);
      await _cacheService.writeJson(_cacheKey, data);
      return mission;
    } catch (_) {
      final cached = _cacheService.readJson<Map<String, dynamic>>(_cacheKey);
      if (cached != null) {
        return TodayMission.fromJson(cached);
      }
      return null;
    }
  }
}
