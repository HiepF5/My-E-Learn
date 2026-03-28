import { useState } from "react";
import { Button, Card, Input, Space, Typography, message } from "antd";
import api from "../services/api";

export default function LearnLearningLabPage() {
  const [busy, setBusy] = useState(false);
  const [sentence, setSentence] = useState("");
  const [dictExpected, setDictExpected] = useState("");
  const [dictUser, setDictUser] = useState("");
  const [grammar, setGrammar] = useState("");

  const post = async (path, body) => {
    setBusy(true);
    try {
      await api.post(path, body);
      message.success("Saved");
    } catch (e) {
      message.error(e.response?.data?.message || "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Typography.Title level={2}>Learning lab</Typography.Title>
      <Typography.Paragraph type="secondary">
        Same Phase 5 endpoints as the mobile app: sentence mining, dictation, grammar micro.
      </Typography.Paragraph>
      <Space direction="vertical" size="middle" style={{ width: "100%", maxWidth: 640 }}>
        <Card className="learn-card" title="Mine a sentence">
          <Input.TextArea
            rows={3}
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Paste a sentence you want to remember"
          />
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            loading={busy}
            onClick={() => post("/learning/sentence-mining", { sentence_text: sentence })}
          >
            Save sentence
          </Button>
        </Card>
        <Card className="learn-card" title="Dictation check">
          <Input placeholder="Expected" value={dictExpected} onChange={(e) => setDictExpected(e.target.value)} style={{ marginBottom: 8 }} />
          <Input placeholder="What you heard / typed" value={dictUser} onChange={(e) => setDictUser(e.target.value)} />
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            loading={busy}
            onClick={() =>
              post("/learning/dictation", {
                expected_text: dictExpected,
                user_transcript: dictUser,
              })
            }
          >
            Submit dictation
          </Button>
        </Card>
        <Card className="learn-card" title="Grammar micro (today)">
          <Input.TextArea rows={2} value={grammar} onChange={(e) => setGrammar(e.target.value)} placeholder="Your answer" />
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            loading={busy}
            onClick={() =>
              post("/learning/grammar-micro", {
                user_answer: grammar,
                prompt: "Daily micro (web)",
              })
            }
          >
            Log grammar
          </Button>
        </Card>
      </Space>
    </div>
  );
}
