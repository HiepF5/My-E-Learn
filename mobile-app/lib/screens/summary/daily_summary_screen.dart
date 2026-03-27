import 'package:flutter/material.dart';

class DailySummaryScreen extends StatelessWidget {
  const DailySummaryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daily Summary')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(
            child: ListTile(
              title: Text('15 words reviewed'),
              subtitle: Text('4 mistakes, 2 weak words, streak +1'),
            ),
          ),
        ],
      ),
    );
  }
}
