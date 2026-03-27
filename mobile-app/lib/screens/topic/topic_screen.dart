import 'package:flutter/material.dart';

class TopicScreen extends StatelessWidget {
  const TopicScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('One Topic Today')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(
            child: ListTile(
              title: Text('Daily Communication'),
              subtitle: Text('10 words, 3 sample sentences, 1 speaking prompt'),
            ),
          ),
        ],
      ),
    );
  }
}
