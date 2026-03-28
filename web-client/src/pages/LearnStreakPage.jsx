import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Segmented, Space, Spin, Typography, message } from "antd";
import api from "../services/api";

function buildCells(heatmap, days) {
  const map = Object.fromEntries(heatmap.map((d) => [d.study_date, d.did_study === true]));
  const list = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    d.setDate(d.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    list.push({ date: iso, studied: map[iso] === true });
  }
  return list;
}

export default function LearnStreakPage() {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(90);
  const [summary, setSummary] = useState({ current_streak: 0, best_streak: 0, last_study_date: null });
  const [heatmap, setHeatmap] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cur, hm] = await Promise.all([
        api.get("/streak/current"),
        api.get("/streak/heatmap", { params: { days } }),
      ]);
      const s = cur.data?.data || {};
      setSummary({
        current_streak: s.current_streak ?? 0,
        best_streak: s.best_streak ?? 0,
        last_study_date: s.last_study_date ?? null,
      });
      const h = hm.data?.data || [];
      setHeatmap(Array.isArray(h) ? h : []);
    } catch (e) {
      message.error(e.response?.data?.message || "Could not load streak");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const cells = useMemo(() => buildCells(heatmap, days), [heatmap, days]);

  const checkIn = async () => {
    try {
      await api.post("/streak/check-in");
      message.success("Check-in recorded");
      load();
    } catch (e) {
      message.error(e.response?.data?.message || "Check-in failed");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Typography.Title level={2}>Streak</Typography.Title>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Segmented
          options={[
            { label: "30 days", value: 30 },
            { label: "90 days", value: 90 },
          ]}
          value={days}
          onChange={(v) => setDays(v)}
        />
        <Card className="learn-card">
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            {summary.current_streak} day streak
          </Typography.Title>
          <Typography.Paragraph type="secondary">Best: {summary.best_streak} days</Typography.Paragraph>
          {summary.last_study_date ? (
            <Typography.Paragraph type="secondary">Last study: {String(summary.last_study_date)}</Typography.Paragraph>
          ) : null}
          <Button type="primary" onClick={checkIn} style={{ marginTop: 8 }}>
            Check in today
          </Button>
        </Card>
        <Card className="learn-card" title="Activity">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(10px, 1fr))",
              gap: 4,
              maxWidth: 720,
            }}
          >
            {cells.map((c) => (
              <div
                key={c.date}
                title={c.date}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: c.studied ? "#7BC47F" : "rgba(0,0,0,0.08)",
                }}
              />
            ))}
          </div>
          <Typography.Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0 }}>
            Green = studied that day
          </Typography.Paragraph>
        </Card>
      </Space>
    </div>
  );
}
