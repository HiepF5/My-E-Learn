import 'api_client.dart';
import 'cache_service.dart';

class PhaseKService {
  PhaseKService(this._apiClient, this._cacheService);
  final ApiClient _apiClient;
  final CacheService _cacheService;

  Future<List<dynamic>> getSpeakingRecords({int limit = 20}) async {
    try {
      final res = await _apiClient.dio.get('/speaking-records', queryParameters: {'limit': limit});
      final raw = (res.data['data'] as List<dynamic>? ?? []);
      await _cacheService.writeJson('phasek_speaking', raw);
      return raw;
    } catch (_) {
      return _cacheService.readJson<List<dynamic>>('phasek_speaking') ?? [];
    }
  }

  Future<List<dynamic>> getWritingRecords({int limit = 20}) async {
    try {
      final res = await _apiClient.dio.get('/writing-records', queryParameters: {'limit': limit});
      final raw = (res.data['data'] as List<dynamic>? ?? []);
      await _cacheService.writeJson('phasek_writing', raw);
      return raw;
    } catch (_) {
      return _cacheService.readJson<List<dynamic>>('phasek_writing') ?? [];
    }
  }

  Future<List<dynamic>> getAiFeedback({int limit = 20}) async {
    try {
      final res = await _apiClient.dio.get('/ai/feedback', queryParameters: {'limit': limit});
      final raw = (res.data['data'] as List<dynamic>? ?? []);
      await _cacheService.writeJson('phasek_feedback', raw);
      return raw;
    } catch (_) {
      return _cacheService.readJson<List<dynamic>>('phasek_feedback') ?? [];
    }
  }

  Future<void> createSpeakingRecord({
    String? promptText,
    String? transcriptText,
    double? score,
  }) async {
    await _apiClient.dio.post('/speaking-records', data: {
      'prompt_text': promptText,
      'transcript_text': transcriptText,
      'score': score,
    });
  }

  Future<void> createWritingRecord({
    String? promptText,
    String? writtenText,
    String? correctedText,
    double? score,
  }) async {
    await _apiClient.dio.post('/writing-records', data: {
      'prompt_text': promptText,
      'written_text': writtenText,
      'corrected_text': correctedText,
      'score': score,
    });
  }

  Future<void> createAiFeedback({
    required String feedbackText,
    String sourceType = 'general',
    String? suggestions,
    String? modelName,
  }) async {
    await _apiClient.dio.post('/ai/feedback', data: {
      'source_type': sourceType,
      'feedback_text': feedbackText,
      'suggestions': suggestions,
      'model_name': modelName,
    });
  }
}

