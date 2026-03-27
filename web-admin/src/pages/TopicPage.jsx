import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import api from "../services/api";

function TopicPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/topics");
      setItems(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.topic_name, item.description, item.level].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [items, search]);

  const onCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const onEdit = (row) => {
    setEditing(row);
    form.setFieldsValue(row);
    setOpen(true);
  };

  const onDelete = async (row) => {
    await api.delete(`/topics/${row.id}`);
    load();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      description: values.description || null,
      level: values.level || null,
    };

    if (editing) await api.put(`/topics/${editing.id}`, payload);
    else await api.post("/topics", payload);

    setOpen(false);
    load();
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 90 },
    { title: "Name", dataIndex: "topic_name" },
    { title: "Level", dataIndex: "level", width: 120 },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Action",
      width: 200,
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => onEdit(row)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this topic?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(row)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Typography.Title level={3}>Topic Manager</Typography.Title>
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} /> : null}
      <Space style={{ marginBottom: 12 }}>
        <Input.Search
          allowClear
          placeholder="Search topic name/description/level"
          onSearch={setSearch}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320 }}
        />
        <Button type="primary" onClick={onCreate}>
          Add Topic
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <Modal title={editing ? "Update Topic" : "Create Topic"} open={open} onCancel={() => setOpen(false)} onOk={onSubmit}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Topic name"
            name="topic_name"
            rules={[{ required: true, message: "Topic name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Level" name="level" tooltip="Example: A1, A2, B1...">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default TopicPage;
