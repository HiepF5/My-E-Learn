import { useEffect, useState } from "react";
import { Alert, Table, Tag, Typography } from "antd";
import api from "../services/api";

function ErrorPatternsPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ai/error-patterns", { params: { limit: 100 } });
      const raw = res.data?.data;
      setData(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load AI error patterns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Typography.Title level={3}>AI error patterns</Typography.Title>
      <Typography.Paragraph type="secondary">
        Aggregated mistake patterns for the logged-in learner (same account as mobile). Used by the
        rule-based today plan.
      </Typography.Paragraph>
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} /> : null}
      <Table
        rowKey={(row) => `${row.id}-${row.pattern_name}`}
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 15 }}
        columns={[
          { title: "Pattern", dataIndex: "pattern_name", ellipsis: true },
          {
            title: "Count",
            dataIndex: "error_count",
            width: 100,
            render: (v) => <Tag color={Number(v) >= 5 ? "red" : "blue"}>{v}</Tag>,
          },
          {
            title: "Last detected",
            dataIndex: "last_detected_at",
            width: 220,
            render: (v) => (v ? String(v) : "—"),
          },
        ]}
      />
    </>
  );
}

export default ErrorPatternsPage;
