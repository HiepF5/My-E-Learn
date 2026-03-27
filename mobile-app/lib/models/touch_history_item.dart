class TouchHistoryItem {
  const TouchHistoryItem({
    required this.touch1Done,
    required this.touch2Done,
    required this.touch3Done,
    required this.eligibleForLearned,
  });

  final bool touch1Done;
  final bool touch2Done;
  final bool touch3Done;
  final bool eligibleForLearned;

  factory TouchHistoryItem.fromJson(Map<String, dynamic> json) {
    return TouchHistoryItem(
      touch1Done: json["touch1_done"] == true,
      touch2Done: json["touch2_done"] == true,
      touch3Done: json["touch3_done"] == true,
      eligibleForLearned: json["eligible_for_learned"] == true,
    );
  }
}
