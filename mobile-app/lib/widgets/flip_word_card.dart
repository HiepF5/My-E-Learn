import 'package:flip_card/flip_card.dart';
import 'package:flutter/material.dart';

import '../services/tts_service.dart';
import '../theme/app_theme.dart';

/// Rounded flashcard with horizontal flip (doc: front word + IPA + speaker; back meaning + example).
class FlipWordCard extends StatelessWidget {
  const FlipWordCard({
    super.key,
    required this.flipKey,
    required this.word,
    this.phonetic,
    this.meaning,
    this.exampleSentence,
    this.minHeight = 280,
  });

  final Object flipKey;
  final String word;
  final String? phonetic;
  final String? meaning;
  final String? exampleSentence;
  final double minHeight;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: double.infinity,
      height: minHeight,
      child: FlipCard(
        key: ValueKey(flipKey),
        fill: Fill.fillBack,
        direction: FlipDirection.HORIZONTAL,
        front: _face(
          context,
          child: _buildFront(context, scheme),
        ),
        back: _face(
          context,
          child: _buildBack(context, scheme),
        ),
      ),
    );
  }

  Widget _face(BuildContext context, {required Widget child}) {
    return Material(
      color: Theme.of(context).colorScheme.surfaceContainerHighest.withValues(alpha: 0.65),
      borderRadius: BorderRadius.circular(AppRadii.card),
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: child,
      ),
    );
  }

  Widget _buildFront(BuildContext context, ColorScheme scheme) {
    final ph = phonetic?.trim();
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          word,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.w700,
                letterSpacing: -0.5,
              ),
        ),
        if (ph != null && ph.isNotEmpty) ...[
          const SizedBox(height: 10),
          Text(
            ph,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: scheme.onSurfaceVariant,
                  fontWeight: FontWeight.w500,
                ),
          ),
        ],
        const SizedBox(height: 8),
        IconButton.filledTonal(
          onPressed: () => TtsService.instance.speak(word),
          icon: const Icon(Icons.volume_up_rounded),
          tooltip: 'Phát âm',
        ),
      ],
    );
  }

  Widget _buildBack(BuildContext context, ColorScheme scheme) {
    final m = meaning?.trim();
    final ex = exampleSentence?.trim();
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _block(
            context,
            label: 'Meaning',
            body: (m != null && m.isNotEmpty) ? m : '—',
            scheme: scheme,
          ),
          if (ex != null && ex.isNotEmpty) ...[
            const SizedBox(height: 16),
            _block(
              context,
              label: 'Example',
              body: ex,
              scheme: scheme,
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.center,
              child: TextButton.icon(
                onPressed: () => TtsService.instance.speak(ex),
                icon: const Icon(Icons.volume_up_rounded, size: 20),
                label: const Text('Play example'),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _block(BuildContext context, {required String label, required String body, required ColorScheme scheme}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: scheme.primary,
                fontWeight: FontWeight.w600,
              ),
        ),
        const SizedBox(height: 6),
        Text(
          body,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.35),
        ),
      ],
    );
  }
}
