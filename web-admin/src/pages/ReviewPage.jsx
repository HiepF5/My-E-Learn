import { useEffect, useState } from "react";
import { Alert, Table, Typography } from "antd";
import api from "../services/api";

function ReviewPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/review/today?limit=50");
        setData(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load review queue");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Typography.Title level={3}>Review Queue</Typography.Title>
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} /> : null}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        columns={[
          { title: "Word ID", dataIndex: "word_id" },
          { title: "Level", dataIndex: "level" },
          { title: "Wrong", dataIndex: "wrong_count" },
          { title: "Correct", dataIndex: "correct_count" },
          { title: "Next review", dataIndex: "next_review" },
        ]}
      />
    </>
  );
}

export default ReviewPage;
