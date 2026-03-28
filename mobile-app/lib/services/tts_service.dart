import 'package:flutter_tts/flutter_tts.dart';

/// Lightweight English TTS for word playback (CORE FEATURES: audio per word).
class TtsService {
  TtsService._();
  static final TtsService instance = TtsService._();

  final FlutterTts _tts = FlutterTts();
  bool _ready = false;

  Future<void> _ensure() async {
    if (_ready) return;
    await _tts.setLanguage('en-US');
    await _tts.setSpeechRate(0.45);
    await _tts.setVolume(1);
    _ready = true;
  }

  Future<void> speak(String text) async {
    final t = text.trim();
    if (t.isEmpty) return;
    try {
      await _ensure();
      await _tts.stop();
      await _tts.speak(t);
    } catch (_) {}
  }

  Future<void> stop() async {
    try {
      await _tts.stop();
    } catch (_) {}
  }
}
