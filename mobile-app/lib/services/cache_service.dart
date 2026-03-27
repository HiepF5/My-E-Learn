import 'package:hive_flutter/hive_flutter.dart';

class CacheService {
  static const _boxName = 'app_cache';

  static Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox(_boxName);
  }

  Box<dynamic> get _box => Hive.box(_boxName);

  Future<void> writeJson(String key, dynamic value) async {
    await _box.put(key, value);
  }

  T? readJson<T>(String key) {
    final data = _box.get(key);
    return data as T?;
  }
}
