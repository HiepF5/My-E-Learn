import { Typography } from "antd";

/**
 * Full 7-day review chart requires a metrics/time-series API (see doc/LEARNING_PLATFORM_BACKLOG.md).
 * Until then, this page documents the gap; data stays in sync via the same account as mobile.
 */
export default function LearnHistoryPage() {
  return (
    <div>
      <Typography.Title level={2}>Learning history</Typography.Title>
      <Typography.Paragraph>
        A 7-day review chart (Chart.js) will appear here once the backend exposes a history series endpoint
        (reviews per day for the current user). Tracked in{" "}
        <code>doc/LEARNING_PLATFORM_BACKLOG.md</code> — platform section.
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary">
        Streak and review counts on other screens already use the same APIs as the mobile app.
      </Typography.Paragraph>
    </div>
  );
}
