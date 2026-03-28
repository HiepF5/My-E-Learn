import { useEffect, useMemo, useState } from "react";
import { Card, Input, List, Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function LearnVocabularyListPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/vocabulary");
        const data = res.data?.data || [];
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => {
      const w = String(r.word || "").toLowerCase();
      const m = String(r.meaning || "").toLowerCase();
      return w.includes(s) || m.includes(s);
    });
  }, [rows, q]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Typography.Title level={2}>Vocabulary</Typography.Title>
      <Typography.Paragraph type="secondary">Browse words — same list as the mobile app.</Typography.Paragraph>
      <Input.Search
        placeholder="Search word or meaning"
        allowClear
        style={{ maxWidth: 400, marginBottom: 16 }}
        onChange={(e) => setQ(e.target.value)}
      />
      <Card className="learn-card">
        <List
          dataSource={filtered}
          locale={{ emptyText: "No vocabulary" }}
          renderItem={(row) => (
            <List.Item>
              <Link to={`/learn/vocabulary/${row.id}`}>
                <Typography.Text strong>{row.word || `Word #${row.id}`}</Typography.Text>
              </Link>
              <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }} ellipsis>
                {row.meaning || "—"}
              </Typography.Paragraph>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
