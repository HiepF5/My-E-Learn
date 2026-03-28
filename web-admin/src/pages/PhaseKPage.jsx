import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, Input, InputNumber, Space, Table, Tabs, Typography } from "antd";
import api from "../services/api";

function PhaseKPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState([]);
  const [writing, setWriting] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [form] = Form.useForm();
  const [wForm] = Form.useForm();
  const [fForm] = Form.useForm();
  const [corrForm] = Form.useForm();
  const [corrected, setCorrected] = useState(null);
  const [corrLoading, setCorrLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [sRes, wRes, fRes] = await Promise.all([
        api.get("/speaking-records?limit=30"),
        api.get("/writing-records?limit=30"),
        api.get("/ai/feedback?limit=30"),
      ]);
      setSpeaking(sRes.data?.data || []);
      setWriting(wRes.data?.data || []);
      setFeedback(fRes.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load Phase K data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submitSpeaking = async (values) => {
    await api.post("/speaking-records", values);
    form.resetFields();
    load();
  };

  const submitWriting = async (values) => {
    await api.post("/writing-records", values);
    wForm.resetFields();
    load();
  };

  const submitFeedback = async (values) => {
    await api.post("/ai/feedback", values);
    fForm.resetFields();
    load();
  };

  return (
    <>
      <Typography.Title level={3}>Phase K Lab</Typography.Title>
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} /> : null}
      <Tabs
        items={[
          {
            key: "speaking",
            label: "Speaking",
            children: (
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <Card title="Create speaking record">
                  <Form form={form} layout="vertical" onFinish={submitSpeaking}>
                    <Form.Item name="word_id" label="Word ID">
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="prompt_text" label="Prompt text">
                      <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="transcript_text" label="Transcript text">
                      <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="score" label="Score (0-100)">
                      <InputNumber min={0} max={100} style={{ width: "100%" }} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save speaking
                    </Button>
                  </Form>
                </Card>
                <Table
                  rowKey="id"
                  loading={loading}
                  dataSource={speaking}
                  columns={[
                    { title: "ID", dataIndex: "id" },
                    { title: "Word ID", dataIndex: "word_id" },
                    { title: "Transcript", dataIndex: "transcript_text" },
                    { title: "Score", dataIndex: "score" },
                    { title: "Created", dataIndex: "created_at" },
                  ]}
                />
              </Space>
            ),
          },
          {
            key: "writing",
            label: "Writing",
            children: (
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <Card title="Create writing record">
                  <Form form={wForm} layout="vertical" onFinish={submitWriting}>
                    <Form.Item name="word_id" label="Word ID">
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="prompt_text" label="Prompt text">
                      <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="written_text" label="Written text">
                      <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="corrected_text" label="Corrected text">
                      <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="score" label="Score (0-100)">
                      <InputNumber min={0} max={100} style={{ width: "100%" }} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save writing
                    </Button>
                  </Form>
                </Card>
                <Table
                  rowKey="id"
                  loading={loading}
                  dataSource={writing}
                  columns={[
                    { title: "ID", dataIndex: "id" },
                    { title: "Word ID", dataIndex: "word_id" },
                    { title: "Written text", dataIndex: "written_text" },
                    { title: "Score", dataIndex: "score" },
                    { title: "Created", dataIndex: "created_at" },
                  ]}
                />
              </Space>
            ),
          },
          {
            key: "llm-correct",
            label: "LLM sentence",
            children: (
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <Card title="Correct sentence (requires OPENAI_API_KEY on server)">
                  <Form form={corrForm} layout="vertical" onFinish={submitCorrectSentence}>
                    <Form.Item
                      name="sentence"
                      label="Sentence"
                      rules={[{ required: true, message: "Enter a sentence" }]}
                    >
                      <Input.TextArea rows={4} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={corrLoading}>
                      Correct with LLM
                    </Button>
                  </Form>
                  {corrected ? (
                    <Alert
                      style={{ marginTop: 16 }}
                      type="success"
                      message="Result"
                      description={
                        <div>
                          <div>
                            <strong>Corrected:</strong> {corrected.corrected}
                          </div>
                          {corrected.notes ? (
                            <div style={{ marginTop: 8 }}>
                              <strong>Notes:</strong> {corrected.notes}
                            </div>
                          ) : null}
                          {corrected.model ? (
                            <div style={{ marginTop: 8 }}>
                              <strong>Model:</strong> {corrected.model}
                            </div>
                          ) : null}
                        </div>
                      }
                    />
                  ) : null}
                </Card>
              </Space>
            ),
          },
          {
            key: "feedback",
            label: "AI Feedback",
            children: (
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <Card title="Create AI feedback">
                  <Form form={fForm} layout="vertical" onFinish={submitFeedback}>
                    <Form.Item name="source_type" label="Source type" initialValue="general">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="feedback_text"
                      label="Feedback text"
                      rules={[{ required: true, message: "feedback_text is required" }]}
                    >
                      <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="suggestions" label="Suggestions">
                      <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="model_name" label="Model name">
                      <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save feedback
                    </Button>
                  </Form>
                </Card>
                <Table
                  rowKey="id"
                  loading={loading}
                  dataSource={feedback}
                  columns={[
                    { title: "ID", dataIndex: "id" },
                    { title: "Type", dataIndex: "source_type" },
                    { title: "Feedback", dataIndex: "feedback_text" },
                    { title: "Model", dataIndex: "model_name" },
                    { title: "Created", dataIndex: "created_at" },
                  ]}
                />
              </Space>
            ),
          },
        ]}
      />
    </>
  );
}

export default PhaseKPage;

