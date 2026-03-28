import { useEffect, useState } from "react";
import { Card, Col, Row, Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function LearnDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/topics/today", { params: { review_cap: 20 } });
        if (!cancelled) setMission(res.data?.data || null);
      } catch {
        if (!cancelled) setMission(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  const topicName = mission?.today_plan?.topic?.topic_name || "—";
  const reviewDue = mission?.review_due_count ?? 0;
  const topErrors = mission?.top_errors_count ?? 0;

  return (
    <div>
      <Typography.Title level={2}>Dashboard</Typography.Title>
      <Typography.Paragraph type="secondary">
        Today&apos;s topic, review queue, weak signals — same data as the mobile home mission.
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="learn-card" title="Today's topic">
            <Typography.Text strong>{topicName}</Typography.Text>
            <div style={{ marginTop: 12 }}>
              <Link to="/learn/topic">Open topic screen</Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="learn-card" title="Review queue">
            <Typography.Title level={3} style={{ marginTop: 0 }}>
              {reviewDue}
            </Typography.Title>
            <Typography.Text type="secondary">words due (cap 20)</Typography.Text>
            <div style={{ marginTop: 12 }}>
              <Link to="/learn/review">Start review</Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="learn-card" title="Mistake notebook">
            <Typography.Title level={3} style={{ marginTop: 0 }}>
              {topErrors}
            </Typography.Title>
            <Typography.Text type="secondary">top errors to fix</Typography.Text>
            <div style={{ marginTop: 12 }}>
              <Link to="/learn/errors">Open errors</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
