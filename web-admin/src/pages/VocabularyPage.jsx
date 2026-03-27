import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../services/api";

function VocabularyPage() {
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
      const res = await api.get("/vocabulary");
      setItems(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load vocabulary");
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
      [item.word, item.meaning, item.example_sentence].some((v) =>
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
    form.setFieldsValue({
      ...row,
      topic_ids: (row.topic_ids || []).join(","),
    });
    setOpen(true);
  };

  const onDelete = async (row) => {
    await api.delete(`/vocabulary/${row.id}`);
    load();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      topic_ids: String(values.topic_ids || "")
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => Number.isInteger(n) && n > 0),
    };

    if (editing) await api.put(`/vocabulary/${editing.id}`, payload);
    else await api.post("/vocabulary", payload);

    setOpen(false);
    load();
  };

  const handleCsvImport = async (file) => {
    const text = await file.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    const rows = parsed.data || [];

    for (const row of rows) {
      const payload = {
        word: row.word,
        meaning: row.meaning || null,
        topic_ids: row.topic
          ? row.topic
              .split("|")
              .map((n) => Number(n.trim()))
              .filter((n) => Number.isInteger(n) && n > 0)
          : [],
      };
      if (payload.word) await api.post("/vocabulary", payload);
    }
    load();
    return false;
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 70 },
    { title: "Word", dataIndex: "word" },
    { title: "Meaning", dataIndex: "meaning" },
    { title: "Difficulty", dataIndex: "difficulty", width: 100 },
    {
      title: "Topics",
      dataIndex: "topic_ids",
      render: (topicIds) => (
        <Space wrap>
          {(topicIds || []).map((id) => (
            <Tag key={id}>{id}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Action",
      width: 180,
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => onEdit(row)}>
            Edit
          </Button>
          <Button danger size="small" onClick={() => onDelete(row)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Typography.Title level={3}>Vocabulary Manager</Typography.Title>
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} /> : null}
      <Space style={{ marginBottom: 12 }}>
        <Input.Search
          allowClear
          placeholder="Search word/meaning/example"
          onSearch={setSearch}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={onCreate}>
          Add Vocabulary
        </Button>
        <Upload beforeUpload={handleCsvImport} showUploadList={false} accept=".csv">
          <Button icon={<UploadOutlined />}>Import CSV</Button>
        </Upload>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <Modal
        title={editing ? "Update Vocabulary" : "Create Vocabulary"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Word" name="word" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Meaning" name="meaning">
            <Input />
          </Form.Item>
          <Form.Item label="Example sentence" name="example_sentence">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Difficulty (1-5)" name="difficulty">
            <InputNumber min={1} max={5} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Topic IDs (comma separated)"
            name="topic_ids"
            tooltip="Example: 1,2,3"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default VocabularyPage;
