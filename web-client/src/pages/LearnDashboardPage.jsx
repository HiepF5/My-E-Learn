import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Space, Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function LearnDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState(null);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [mRes, sRes] = await Promise.all([
          api.get("/topics/today", { params: { review_cap: 20 } }),
          api.get("/streak/current").catch(() => ({ data: { data: {} } })),
        ]);
        if (!cancelled) {
          setMission(mRes.data?.data || null);
          const s = sRes.data?.data || {};
          setStreakDays(Number(s.current_streak) || 0);
        }
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
      <Typography.Title level={2}>Today</Typography.Title>
      <Link to="/learn/review">
        <Button type="primary" size="large" style={{ marginBottom: 16 }}>
          Start Learning
        </Button>
      </Link>
      <Typography.Paragraph type="secondary">
        Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"} — same
        mission data as the mobile home screen.
      </Typography.Paragraph>
      {streakDays > 0 ? (
        <Typography.Paragraph>
          <Link to="/learn/streak">{streakDays} day streak</Link>
        </Typography.Paragraph>
      ) : null}
      <SpaceActions reviewDue={reviewDue} topicName={topicName} topErrors={topErrors} />
    </div>
  );
}

function SpaceActions({ reviewDue, topicName, topErrors }) {
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
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
      <Space size="large" wrap style={{ marginBottom: 24 }}>
        <Link to="/learn/review?limit=5">Quick 3 min (5 words)</Link>
        <Link to="/learn/weak-words">Your weak words</Link>
        <Link to="/learn/vocabulary">Browse vocabulary</Link>
      </Space>
    </>
  );
}
