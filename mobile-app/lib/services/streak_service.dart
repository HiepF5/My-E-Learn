import 'api_client.dart';

class StreakSummary {
  const StreakSummary({
    required this.currentStreak,
    required this.bestStreak,
    this.lastStudyDate,
  });

  final int currentStreak;
  final int bestStreak;
  final String? lastStudyDate;

  factory StreakSummary.fromJson(Map<String, dynamic> json) {
    return StreakSummary(
      currentStreak: (json['current_streak'] as num?)?.toInt() ?? 0,
      bestStreak: (json['best_streak'] as num?)?.toInt() ?? 0,
      lastStudyDate: json['last_study_date'] as String?,
    );
  }
}

class HeatmapDay {
  const HeatmapDay({required this.studyDate, required this.didStudy});

  final String studyDate;
  final bool didStudy;

  factory HeatmapDay.fromJson(Map<String, dynamic> json) {
    return HeatmapDay(
      studyDate: json['study_date'] as String? ?? '',
      didStudy: json['did_study'] == true,
    );
  }
}

class StreakService {
  StreakService(this._apiClient);

  final ApiClient _apiClient;

  Future<StreakSummary> getCurrent() async {
    final res = await _apiClient.dio.get('/streak/current');
    final d = res.data['data'];
    if (d is Map) {
      return StreakSummary.fromJson(d.cast<String, dynamic>());
    }
    return const StreakSummary(currentStreak: 0, bestStreak: 0);
  }

  Future<List<HeatmapDay>> getHeatmap({int days = 90}) async {
    final res = await _apiClient.dio.get('/streak/heatmap', queryParameters: {'days': days});
    final raw = res.data['data'];
    if (raw is! List) return [];
    return raw.map((e) => HeatmapDay.fromJson((e as Map).cast<String, dynamic>())).toList();
  }

  Future<void> checkIn() async {
    await _apiClient.dio.post('/streak/check-in');
  }
}
