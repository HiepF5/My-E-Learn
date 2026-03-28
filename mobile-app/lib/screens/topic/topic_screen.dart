import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../services/cache_service.dart';
import '../../services/today_mission_service.dart';

class TopicScreen extends ConsumerStatefulWidget {
  const TopicScreen({super.key});

  @override
  ConsumerState<TopicScreen> createState() => _TopicScreenState();
}

class _TopicScreenState extends ConsumerState<TopicScreen> {
  bool _loading = true;
  String _topicName = '';
  String? _topicLevel;
  int? _newWords;
  int? _reviewQueue;
  int? _touchFocus;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final api = ref.read(apiClientProvider);
    final mission = await TodayMissionService(api, CacheService()).getTodayMission(reviewCap: 30);
    if (!mounted) return;
    setState(() {
      _loading = false;
      _topicName = mission?.primaryTopicName?.trim().isNotEmpty == true
          ? mission!.primaryTopicName!.trim()
          : 'No topic yet';
      _topicLevel = mission?.primaryTopicLevel;
      _newWords = mission?.newWordsTarget;
      _reviewQueue = mission?.reviewQueueTarget;
      _touchFocus = mission?.touchFocus;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        appBar: AppBar(title: const Text('One Topic Today')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final parts = <String>[];
    if (_newWords != null) parts.add('${_newWords!} new words');
    if (_reviewQueue != null) parts.add('${_reviewQueue!} review queue');
    if (_touchFocus != null) parts.add('${_touchFocus!} touch focus');
    final planLine = parts.isEmpty ? 'Add topics and vocabulary to see daily targets.' : 'Targets: ${parts.join(', ')}';

    return Scaffold(
      appBar: AppBar(title: const Text('One Topic Today')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              title: Text(_topicName, style: Theme.of(context).textTheme.titleMedium),
              subtitle: Text(
                [
                  if (_topicLevel != null && _topicLevel!.isNotEmpty) 'Level: $_topicLevel',
                  planLine,
                ].where((s) => s.isNotEmpty).join('\n'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
