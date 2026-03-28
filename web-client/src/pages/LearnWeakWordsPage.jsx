import { useEffect, useState } from "react";
import { Card, List, Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function LearnWeakWordsPage() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [labels, setLabels] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/weak-words", { params: { limit: 50 } });
        const raw = res.data?.data || [];
        const list = Array.isArray(raw) ? raw : [];
        const ids = list.map((e) => Number(e.word_id)).filter((id) => id > 0);
        let map = {};
        if (ids.length) {
          try {
            const vres = await api.get("/vocabulary");
            const rows = vres.data?.data || [];
            if (Array.isArray(rows)) {
              map = Object.fromEntries(
                rows.filter((r) => ids.includes(Number(r.id))).map((r) => [Number(r.id), String(r.word || "").trim() || `Word #${r.id}`])
              );
            }
          } catch {
            map = {};
          }
        }
        if (!cancelled) {
          setEntries(list);
          setLabels(map);
        }
      } catch {
        if (!cancelled) {
          setEntries([]);
          setLabels({});
        }
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

  return (
    <div>
      <Typography.Title level={2}>Your weak words</Typography.Title>
      <Typography.Paragraph type="secondary">Same ranking as the mobile app (GET /weak-words).</Typography.Paragraph>
      {entries.length === 0 ? (
        <Typography.Paragraph>
          No weak words yet — keep reviewing; we surface words you miss often.
        </Typography.Paragraph>
      ) : (
        <Card className="learn-card">
          <List
            dataSource={entries}
            renderItem={(e) => {
              const wid = Number(e.word_id);
              const label = labels[wid] || `Word #${wid}`;
              return (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Link to={`/learn/vocabulary/${wid}`}>{label}</Link>
                    }
                    description={
                      <>
                        Score {Number(e.weak_score ?? 0).toFixed(1)} · wrong {e.wrong_count_snapshot ?? 0} · recent{" "}
                        {e.recent_wrong_count ?? 0}
                      </>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      )}
    </div>
  );
}
