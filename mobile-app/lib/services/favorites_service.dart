import 'api_client.dart';

class FavoritesService {
  FavoritesService(this._api);

  final ApiClient _api;

  Future<bool> isFavorite(int wordId) async {
    try {
      final res = await _api.dio.get('/favorites/check/$wordId');
      final d = res.data['data'];
      if (d is Map && d['is_favorite'] == true) return true;
    } catch (_) {}
    return false;
  }

  Future<void> add(int wordId) async {
    await _api.dio.post('/favorites', data: {'word_id': wordId});
  }

  Future<void> remove(int wordId) async {
    await _api.dio.delete('/favorites/$wordId');
  }
}
