import 'api_client.dart';

class VocabularyNoteService {
  VocabularyNoteService(this._api);

  final ApiClient _api;

  Future<String?> getNote(int wordId) async {
    try {
      final res = await _api.dio.get('/vocabulary/$wordId/note');
      final d = res.data['data'];
      if (d is Map) {
        final t = d['note_text'] as String?;
        if (t != null && t.trim().isNotEmpty) return t;
      }
    } catch (_) {}
    return null;
  }

  Future<void> saveNote(int wordId, String text) async {
    await _api.dio.put('/vocabulary/$wordId/note', data: {'note_text': text});
  }

  Future<void> deleteNote(int wordId) async {
    await _api.dio.delete('/vocabulary/$wordId/note');
  }
}
