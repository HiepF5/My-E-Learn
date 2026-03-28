import { useEffect, useState } from "react";
import { Button, Card, Input, List, Spin, Typography, message } from "antd";
import api from "../services/api";

export default function LearnDailySummaryPage() {
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState([]);
  const [writing, setWriting] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [sPrompt, setSPrompt] = useState("");
  const [sText, setSText] = useState("");
  const [wPrompt, setWPrompt] = useState("");
  const [wText, setWText] = useState("");
  const [fText, setFText] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [s, w, f] = await Promise.all([
        api.get("/speaking-records", { params: { limit: 20 } }),
        api.get("/writing-records", { params: { limit: 20 } }),
        api.get("/ai/feedback", { params: { limit: 20 } }),
      ]);
      setSpeaking(Array.isArray(s.data?.data) ? s.data.data : []);
      setWriting(Array.isArray(w.data?.data) ? w.data.data : []);
      setFeedback(Array.isArray(f.data?.data) ? f.data.data : []);
    } catch {
      message.error("Could not load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveSpeaking = async () => {
    try {
      await api.post("/speaking-records", {
        prompt_text: sPrompt.trim() || null,
        transcript_text: sText.trim() || null,
      });
      setSPrompt("");
      setSText("");
      message.success("Saved");
      load();
    } catch (e) {
      message.error(e.response?.data?.message || "Failed");
    }
  };

  const saveWriting = async () => {
    try {
      await api.post("/writing-records", {
        prompt_text: wPrompt.trim() || null,
        written_text: wText.trim() || null,
      });
      setWPrompt("");
      setWText("");
      message.success("Saved");
      load();
    } catch (e) {
      message.error(e.response?.data?.message || "Failed");
    }
  };

  const saveFeedback = async () => {
    const t = fText.trim();
    if (!t) return;
    try {
      await api.post("/ai/feedback", { feedback_text: t, source_type: "general" });
      setFText("");
      message.success("Saved");
      load();
    } catch (e) {
      message.error(e.response?.data?.message || "Failed");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Typography.Title level={2}>Daily summary + Phase K</Typography.Title>
      <Typography.Paragraph type="secondary">Speaking, writing, and AI feedback — aligned with mobile Phase K.</Typography.Paragraph>

      <Card className="learn-card" style={{ marginBottom: 16 }}>
        <Typography.Paragraph strong>15 words reviewed (placeholder card)</Typography.Paragraph>
        <Typography.Paragraph type="secondary">4 mistakes, 2 weak words, streak +1 — full analytics when metrics land.</Typography.Paragraph>
      </Card>

      <Card className="learn-card" title="Speaking record" style={{ marginBottom: 16 }}>
        <Input placeholder="Prompt" value={sPrompt} onChange={(e) => setSPrompt(e.target.value)} style={{ marginBottom: 8 }} />
        <Input placeholder="Transcript" value={sText} onChange={(e) => setSText(e.target.value)} style={{ marginBottom: 8 }} />
        <Button type="primary" onClick={saveSpeaking}>
          Save speaking
        </Button>
        <List
          style={{ marginTop: 16 }}
          dataSource={speaking.slice(0, 5)}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item.transcript_text || "—"}</Typography.Text>
              <Typography.Text type="secondary"> Score: {item.score ?? "—"}</Typography.Text>
            </List.Item>
          )}
        />
      </Card>

      <Card className="learn-card" title="Writing record" style={{ marginBottom: 16 }}>
        <Input placeholder="Prompt" value={wPrompt} onChange={(e) => setWPrompt(e.target.value)} style={{ marginBottom: 8 }} />
        <Input placeholder="Written text" value={wText} onChange={(e) => setWText(e.target.value)} style={{ marginBottom: 8 }} />
        <Button type="primary" onClick={saveWriting}>
          Save writing
        </Button>
        <List
          style={{ marginTop: 16 }}
          dataSource={writing.slice(0, 5)}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item.written_text || "—"}</Typography.Text>
              <Typography.Text type="secondary"> Score: {item.score ?? "—"}</Typography.Text>
            </List.Item>
          )}
        />
      </Card>

      <Card className="learn-card" title="AI feedback">
        <Input.TextArea rows={3} value={fText} onChange={(e) => setFText(e.target.value)} placeholder="Feedback text" />
        <Button type="primary" style={{ marginTop: 8 }} onClick={saveFeedback}>
          Save feedback
        </Button>
        <List
          style={{ marginTop: 16 }}
          dataSource={feedback.slice(0, 5)}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item.feedback_text || "—"}</Typography.Text>
              <Typography.Text type="secondary"> {item.source_type || ""}</Typography.Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
