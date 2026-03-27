import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
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
    final res = await api.dio.get('/errors');
    if (!mounted) return;
    setState(() {
      _items = (res.data['data'] as List<dynamic>? ?? []);
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Error Notebook')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.separated(
              itemBuilder: (_, i) {
                final item = _items[i] as Map<String, dynamic>;
                return ListTile(
                  title: Text(item['wrong_text']?.toString() ?? '-'),
                  subtitle: Text(
                    'Corrected: ${item['corrected_text'] ?? '-'} | Repeat: ${item['repeat_count'] ?? 0}',
                  ),
                  trailing: Icon(
                    (item['fixed'] == true) ? Icons.check_circle : Icons.error_outline,
                    color: (item['fixed'] == true) ? Colors.green : Colors.orange,
                  ),
                );
              },
              separatorBuilder: (_, __) => const Divider(height: 1),
              itemCount: _items.length,
            ),
      bottomNavigationBar: const AppBottomNav(currentPath: '/errors'),
    );
  }
}
