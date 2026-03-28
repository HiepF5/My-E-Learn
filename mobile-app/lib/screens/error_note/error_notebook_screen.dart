import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/error_service.dart';
import '../../widgets/app_bottom_nav.dart';

class ErrorNotebookScreen extends ConsumerStatefulWidget {
  const ErrorNotebookScreen({super.key});

  @override
  ConsumerState<ErrorNotebookScreen> createState() => _ErrorNotebookScreenState();
}

class _ErrorNotebookScreenState extends ConsumerState<ErrorNotebookScreen> {
  List<dynamic> _items = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final api = ref.read(apiClientProvider);
    final service = ErrorService(api, CacheService());
    final data = await service.getErrors();
    if (!mounted) return;
    setState(() {
      _items = data;
      _loading = false;
    });
  }

  static DateTime? _parseCreated(Map<String, dynamic> item) {
    final v = item['created_at'] ?? item['createdAt'];
    if (v == null) return null;
    if (v is String) {
      final d = DateTime.tryParse(v);
      return d?.toLocal();
    }
    return null;
  }

  static DateTime _dateOnly(DateTime d) => DateTime(d.year, d.month, d.day);

  static String _sectionTitle(DateTime day, DateTime todayStart) {
    if (day == todayStart) return 'Hôm nay';
    if (day == todayStart.subtract(const Duration(days: 1))) return 'Hôm qua';
    return '${day.day.toString().padLeft(2, '0')}/${day.month.toString().padLeft(2, '0')}/${day.year}';
  }

  List<Widget> _buildGroupedList(BuildContext context) {
    final now = DateTime.now();
    final todayStart = _dateOnly(now);

    final withDay = <({Map<String, dynamic> item, DateTime? day})>[];
    for (final raw in _items) {
      final item = Map<String, dynamic>.from(raw as Map);
      final created = _parseCreated(item);
      final day = created != null ? _dateOnly(created) : null;
      withDay.add((item: item, day: day));
    }

    withDay.sort((a, b) {
      final da = a.day;
      final db = b.day;
      if (da == null && db == null) return 0;
      if (da == null) return 1;
      if (db == null) return -1;
      return db.compareTo(da);
    });

    final groups = <DateTime?, List<Map<String, dynamic>>>{};
    for (final row in withDay) {
      groups.putIfAbsent(row.day, () => []).add(row.item);
    }

    final children = <Widget>[];
    for (final entry in groups.entries) {
      final day = entry.key;
      final title = day == null
          ? 'Không rõ ngày'
          : _sectionTitle(day, todayStart);
      children.add(
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            title,
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: Theme.of(context).colorScheme.primary,
                  fontWeight: FontWeight.w700,
                ),
          ),
        ),
      );
      for (final item in entry.value) {
        children.add(
          ListTile(
            title: Text(item['wrong_text']?.toString() ?? '-'),
            subtitle: Text(
              'Đúng: ${item['corrected_text'] ?? '-'} · Lặp: ${item['repeat_count'] ?? 0}',
            ),
            trailing: Icon(
              (item['fixed'] == true) ? Icons.check_circle : Icons.error_outline,
              color: (item['fixed'] == true)
                  ? Theme.of(context).colorScheme.tertiary
                  : Theme.of(context).colorScheme.error,
            ),
          ),
        );
      }
    }
    return children;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Error Notebook')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _items.isEmpty
              ? Center(
                  child: Text(
                    'Chưa có lỗi ghi nhận.',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                )
              : ListView(
                  children: _buildGroupedList(context),
                ),
      bottomNavigationBar: const AppBottomNav(currentPath: '/errors'),
    );
  }
}
