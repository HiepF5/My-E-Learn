import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../services/streak_service.dart';
import '../../widgets/app_bottom_nav.dart';

class StreakScreen extends ConsumerStatefulWidget {
  const StreakScreen({super.key});

  @override
  ConsumerState<StreakScreen> createState() => _StreakScreenState();
}

class _StreakScreenState extends ConsumerState<StreakScreen> {
  bool _loading = true;
  String? _error;
  StreakSummary _summary = const StreakSummary(currentStreak: 0, bestStreak: 0);
  List<HeatmapDay> _heatmap = const [];
  int _days = 90;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    final api = ref.read(apiClientProvider);
    final svc = StreakService(api);
    try {
      final s = await svc.getCurrent();
      final h = await svc.getHeatmap(days: _days);
      if (!mounted) return;
      setState(() {
        _summary = s;
        _heatmap = h;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = '$e';
        _loading = false;
      });
    }
  }

  List<_Cell> _buildCells() {
    final map = {for (final d in _heatmap) d.studyDate: d.didStudy};
    final list = <_Cell>[];
    final today = DateTime.now();
    for (var i = _days - 1; i >= 0; i--) {
      final d = DateTime(today.year, today.month, today.day).subtract(Duration(days: i));
      final iso =
          '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
      list.add(_Cell(date: iso, studied: map[iso] == true));
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    final cells = _buildCells();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Streak'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (_error != null)
                  Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                Row(
                  children: [
                    ChoiceChip(
                      label: const Text('30d'),
                      selected: _days == 30,
                      onSelected: (_) {
                        setState(() => _days = 30);
                        _load();
                      },
                    ),
                    const SizedBox(width: 8),
                    ChoiceChip(
                      label: const Text('90d'),
                      selected: _days == 90,
                      onSelected: (_) {
                        setState(() => _days = 90);
                        _load();
                      },
                    ),
                    const SizedBox(width: 8),
                    ChoiceChip(
                      label: const Text('180d'),
                      selected: _days == 180,
                      onSelected: (_) {
                        setState(() => _days = 180);
                        _load();
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                FilledButton(
                  onPressed: () async {
                    try {
                      await StreakService(ref.read(apiClientProvider)).checkIn();
                      await _load();
                    } catch (_) {}
                  },
                  child: const Text('Check-in today'),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(title: 'Current', value: '${_summary.currentStreak} d'),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _StatCard(title: 'Best', value: '${_summary.bestStreak} d'),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text('Last study: ${_summary.lastStudyDate ?? '-'}'),
                const SizedBox(height: 16),
                Text('Heatmap ($_days days)', style: Theme.of(context).textTheme.titleSmall),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 4,
                  runSpacing: 4,
                  children: cells
                      .map(
                        (c) => Tooltip(
                          message: '${c.date} — ${c.studied ? "studied" : "no"}',
                          child: Container(
                            width: 14,
                            height: 14,
                            decoration: BoxDecoration(
                              color: c.studied ? Colors.green : Colors.grey.shade300,
                              borderRadius: BorderRadius.circular(3),
                              border: Border.all(color: Colors.grey.shade400),
                            ),
                          ),
                        ),
                      )
                      .toList(),
                ),
              ],
            ),
      bottomNavigationBar: const AppBottomNav(currentPath: '/profile'),
    );
  }
}

class _Cell {
  _Cell({required this.date, required this.studied});

  final String date;
  final bool studied;
}

class _StatCard extends StatelessWidget {
  const _StatCard({required this.title, required this.value});

  final String title;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.labelSmall),
            Text(value, style: Theme.of(context).textTheme.titleMedium),
          ],
        ),
      ),
    );
  }
}
