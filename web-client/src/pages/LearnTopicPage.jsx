import { useEffect, useState } from "react";
import { Card, List, Spin, Typography } from "antd";
import api from "../services/api";

export default function LearnTopicPage() {
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/topics");
        const rows = res.data?.data || [];
        if (!cancelled) setTopics(Array.isArray(rows) ? rows : []);
      } catch {
        if (!cancelled) setTopics([]);
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
      <Typography.Title level={2}>Topics</Typography.Title>
      <Typography.Paragraph type="secondary">Read-only list from GET /topics.</Typography.Paragraph>
      <Card className="learn-card">
        <List
          dataSource={topics}
          locale={{ emptyText: "No topics" }}
          renderItem={(t) => (
            <List.Item>
              <List.Item.Meta title={t.topic_name} description={t.description || t.level || ""} />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
