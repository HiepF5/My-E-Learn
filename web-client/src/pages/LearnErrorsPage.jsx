import { useEffect, useState } from "react";
import { Card, List, Spin, Tag, Typography } from "antd";
import api from "../services/api";

export default function LearnErrorsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/errors");
        const rows = res.data?.data || [];
        if (!cancelled) setItems(Array.isArray(rows) ? rows : []);
      } catch {
        if (!cancelled) setItems([]);
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
      <Typography.Title level={2}>Error notebook</Typography.Title>
      <Typography.Paragraph type="secondary">Your logged mistakes from GET /errors.</Typography.Paragraph>
      <Card className="learn-card">
        <List
          dataSource={items}
          locale={{ emptyText: "No errors yet" }}
          renderItem={(row) => (
            <List.Item>
              <List.Item.Meta
                title={row.wrong_text || "—"}
                description={
                  <>
                    <div>Corrected: {row.corrected_text || "—"}</div>
                    <div style={{ marginTop: 4 }}>
                      <Tag color={row.fixed ? "green" : "orange"}>{row.fixed ? "Fixed" : "Open"}</Tag>
                      <span style={{ marginLeft: 8 }}>Repeat: {row.repeat_count ?? 0}</span>
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
