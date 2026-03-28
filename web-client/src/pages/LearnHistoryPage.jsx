import { Typography } from "antd";

export default function LearnHistoryPage() {
  return (
    <div>
      <Typography.Title level={2}>Learning history</Typography.Title>
      <Typography.Paragraph>
        Placeholder for 7-day review chart and streaks. Tracked in{" "}
        <code>doc/LEARNING_PLATFORM_BACKLOG.md</code> (Chart.js + metrics API).
      </Typography.Paragraph>
    </div>
  );
}
