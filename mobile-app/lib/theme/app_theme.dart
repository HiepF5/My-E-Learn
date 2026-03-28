import 'package:flutter/material.dart';

/// Design tokens — xanh lá non / mint nhẹ (CORE FEATURES + UI DESIGN PRINCIPLE).
abstract final class AppColors {
  /// Xanh lá chính (tươi, không gắt)
  static const Color primaryGreen = Color(0xFF7BC47F);
  static const Color secondaryMint = Color(0xFFA8D5BA);
  static const Color surfaceMint = Color(0xFFF6FBF7);
  static const Color surfaceVariant = Color(0xFFE8F3EA);
}

abstract final class AppRadii {
  static const double card = 22;
  static const double button = 16;
  static const double progress = 12;
}

class AppTheme {
  AppTheme._();

  static ThemeData light() {
    final base = ColorScheme.fromSeed(
      seedColor: AppColors.primaryGreen,
      brightness: Brightness.light,
    );

    final scheme = base.copyWith(
      primary: const Color(0xFF5FAF64),
      onPrimary: Colors.white,
      primaryContainer: const Color(0xFFD4ECD9),
      onPrimaryContainer: const Color(0xFF1B3D22),
      secondary: AppColors.secondaryMint,
      onSecondary: const Color(0xFF1E2D22),
      secondaryContainer: const Color(0xFFE0F0E4),
      onSecondaryContainer: const Color(0xFF1E2D22),
      tertiary: const Color(0xFF8BC99A),
      surface: AppColors.surfaceMint,
      onSurface: const Color(0xFF1C2B21),
      onSurfaceVariant: const Color(0xFF3D5345),
      surfaceContainerHighest: AppColors.surfaceVariant,
      outline: const Color(0xFF8DB896),
      outlineVariant: const Color(0xFFC5DEC9),
    );

    final cardShape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadii.card),
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: scheme.surface,
      appBarTheme: AppBarTheme(
        centerTitle: true,
        elevation: 0,
        scrolledUnderElevation: 0.5,
        backgroundColor: scheme.surface,
        foregroundColor: scheme.onSurface,
        surfaceTintColor: Colors.transparent,
      ),
      cardTheme: CardThemeData(
        elevation: 1,
        shadowColor: const Color(0xFF2D6B3A).withValues(alpha: 0.08),
        color: Colors.white,
        shape: cardShape,
        clipBehavior: Clip.antiAlias,
        margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: scheme.surface,
        indicatorColor: scheme.primaryContainer,
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return TextStyle(color: scheme.primary, fontWeight: FontWeight.w600, fontSize: 12);
          }
          return TextStyle(color: scheme.onSurfaceVariant, fontSize: 12);
        }),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          return IconThemeData(
            color: states.contains(WidgetState.selected) ? scheme.primary : scheme.onSurfaceVariant,
          );
        }),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: scheme.primary,
          foregroundColor: scheme.onPrimary,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadii.button),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: scheme.primary,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadii.button),
          ),
        ),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: scheme.primary,
        foregroundColor: scheme.onPrimary,
        elevation: 2,
        highlightElevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadii.card),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: scheme.secondaryContainer,
        labelStyle: TextStyle(color: scheme.onSecondaryContainer, fontSize: 13),
        side: BorderSide.none,
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: scheme.outlineVariant),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: scheme.primary, width: 2),
        ),
      ),
    );
  }
}
