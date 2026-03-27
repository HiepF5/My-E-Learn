import { useEffect, useState } from "react";
import { Alert, Space, Switch, Table, Tag, Typography } from "antd";
import api from "../services/api";

function ErrorPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/errors");
      setData(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load errors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleFixed = async (row, checked) => {
    await api.patch(`/errors/${row.id}/fixed`, { fixed: checked });
    load();
  };

  return (
    <>
      <Typography.Title level={3}>Error Notebook</Typography.Title>
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} /> : null}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        columns={[
          { title: "Type", dataIndex: "error_type" },
          { title: "Wrong", dataIndex: "wrong_text" },
          { title: "Corrected", dataIndex: "corrected_text" },
          {
            title: "Repeat",
            dataIndex: "repeat_count",
            render: (v) => <Tag color={v >= 3 ? "red" : "blue"}>{v}</Tag>,
          },
          {
            title: "Fixed",
            dataIndex: "fixed",
            render: (_, row) => (
              <Space>
                <Switch checked={!!row.fixed} onChange={(checked) => toggleFixed(row, checked)} />
              </Space>
            ),
          },
        ]}
      />
    </>
  );
}

export default ErrorPage;
