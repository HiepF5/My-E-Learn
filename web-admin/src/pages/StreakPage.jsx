import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Radio, Row, Space, Statistic, Typography } from "antd";
import api from "../services/api";

const dayOptions = [30, 90, 180];

const formatDateLabel = (isoDate) => {
  const d = new Date(isoDate);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

function StreakPage() {
  const [days, setDays] = useState(90);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    current_streak: 0,
    best_streak: 0,
    last_study_date: null,
  });
  const [heatmap, setHeatmap] = useState([]);

  const load = async (nextDays = days) => {
    try {
      setLoading(true);
      setError("");
      const [currentRes, heatmapRes] = await Promise.all([
        api.get("/streak/current"),
        api.get("/streak/heatmap", { params: { days: nextDays } }),
      ]);
      setSummary(currentRes.data?.data || {});
      setHeatmap(heatmapRes.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load streak data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(days);
  }, [days]);

  const onCheckIn = async () => {
    try {
      setLoading(true);
      await api.post("/streak/check-in");
      await load(days);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check in");
      setLoading(false);
    }
  };

  const cells = useMemo(() => {
    const map = new Map((heatmap || []).map((item) => [item.study_date, item.did_study === true]));
    const list = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      list.push({
        date: iso,
        studied: map.get(iso) === true,
      });
    }
    return list;
  }, [heatmap, days]);

  return (
    <>
      <Typography.Title level={3}>Streak & Heatmap</Typography.Title>
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} /> : null}

      <Space style={{ marginBottom: 12 }} wrap>
        <Radio.Group
          value={days}
          onChange={(e) => setDays(e.target.value)}
          options={dayOptions.map((v) => ({ label: `${v} days`, value: v }))}
          optionType="button"
        />
        <Button type="primary" onClick={onCheckIn} loading={loading}>
          Check-in Today
        </Button>
      </Space>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="Current Streak" value={summary.current_streak || 0} suffix="days" />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="Best Streak" value={summary.best_streak || 0} suffix="days" />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="Last Study Date"
              value={summary.last_study_date || "-"}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      <Card loading={loading} title={`Heatmap (${days} days)`}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {cells.map((cell) => (
            <div
              key={cell.date}
              title={`${cell.date} - ${cell.studied ? "Studied" : "No study"}`}
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: cell.studied ? "#52c41a" : "#f0f0f0",
                border: "1px solid #d9d9d9",
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: 12, color: "#666", fontSize: 12 }}>
          {cells.length ? `${formatDateLabel(cells[0].date)} -> ${formatDateLabel(cells[cells.length - 1].date)}` : ""}
        </div>
      </Card>
    </>
  );
}

export default StreakPage;
