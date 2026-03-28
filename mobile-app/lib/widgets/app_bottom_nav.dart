import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AppBottomNav extends StatelessWidget {
  const AppBottomNav({super.key, required this.currentPath});

  final String currentPath;

  int _indexFromPath() {
    if (currentPath.startsWith('/review')) return 1;
    if (currentPath.startsWith('/errors')) return 2;
    if (currentPath.startsWith('/profile')) return 3;
    if (currentPath.startsWith('/vocabulary')) return 0;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      selectedIndex: _indexFromPath(),
      onDestinationSelected: (index) {
        switch (index) {
          case 0:
            context.go('/');
            break;
          case 1:
            context.go('/review');
            break;
          case 2:
            context.go('/errors');
            break;
          case 3:
            context.go('/profile');
            break;
          default:
            context.go('/');
        }
      },
      destinations: const [
        NavigationDestination(icon: Icon(Icons.home_outlined), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.timer_outlined), label: 'Review'),
        NavigationDestination(icon: Icon(Icons.bug_report_outlined), label: 'Errors'),
        NavigationDestination(icon: Icon(Icons.person_outline), label: 'Profile'),
      ],
    );
  }
}
