import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Input, Space, Spin, Typography, message } from "antd";
import { SoundOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import api from "../services/api";
import { speakEnglish } from "../utils/speak";

export default function LearnVocabularyDetailPage() {
  const { id } = useParams();
  const wordId = Number(id);
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState(null);
  const [collocations, setCollocations] = useState([]);
  const [family, setFamily] = useState([]);
  const [favorite, setFavorite] = useState(false);
  const [note, setNote] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);

  const load = useCallback(async () => {
    if (!wordId) return;
    setLoading(true);
    try {
      const [detail, col, fam] = await Promise.all([
        api.get(`/vocabulary/${wordId}`),
        api.get(`/vocabulary/${wordId}/collocations`).catch(() => ({ data: { data: [] } })),
        api.get(`/vocabulary/${wordId}/word-family`).catch(() => ({ data: { data: [] } })),
      ]);
      setRow(detail.data?.data || null);
      const c = col.data?.data;
      const f = fam.data?.data;
      setCollocations(Array.isArray(c) ? c : []);
      setFamily(Array.isArray(f) ? f : []);

      try {
        const chk = await api.get(`/favorites/check/${wordId}`);
        setFavorite(chk.data?.data?.is_favorite === true);
      } catch {
        setFavorite(false);
      }
      try {
        const n = await api.get(`/vocabulary/${wordId}/note`);
        const t = n.data?.data?.note_text;
        setNote(typeof t === "string" ? t : "");
      } catch {
        setNote("");
      }
    } catch {
      setRow(null);
      message.error("Could not load word");
    } finally {
      setLoading(false);
    }
  }, [wordId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = async () => {
    try {
      if (favorite) {
        await api.delete(`/favorites/${wordId}`);
        setFavorite(false);
      } else {
        await api.post("/favorites", { word_id: wordId });
        setFavorite(true);
      }
    } catch {
      message.error("Could not update favorite");
    }
  };

  const saveNote = async () => {
    setNoteSaving(true);
    try {
      const t = note.trim();
      if (t === "") {
        await api.delete(`/vocabulary/${wordId}/note`);
      } else {
        await api.put(`/vocabulary/${wordId}/note`, { note_text: t });
      }
      message.success("Note saved");
    } catch {
      message.error("Could not save note");
    } finally {
      setNoteSaving(false);
    }
  };

  if (loading || !row) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  const title = row.word || `Word #${wordId}`;

  return (
    <div>
      <Space align="start" wrap style={{ marginBottom: 16 }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        <Button
          type="text"
          icon={favorite ? <StarFilled style={{ color: "#f5a623" }} /> : <StarOutlined />}
          onClick={toggleFavorite}
        >
          {favorite ? "Saved" : "Favorite"}
        </Button>
        <Button type="text" icon={<SoundOutlined />} onClick={() => speakEnglish(title)}>
          Speak
        </Button>
      </Space>

      {row.phonetic ? (
        <Typography.Paragraph type="secondary">{row.phonetic}</Typography.Paragraph>
      ) : null}

      <Card className="learn-card" title="Meaning" style={{ marginBottom: 16 }}>
        <Typography.Paragraph>{row.meaning || "—"}</Typography.Paragraph>
        {row.example_sentence ? (
          <>
            <Typography.Title level={5} style={{ color: "#7BC47F" }}>
              Example
            </Typography.Title>
            <Typography.Paragraph>{row.example_sentence}</Typography.Paragraph>
          </>
        ) : null}
      </Card>

      <Card className="learn-card" title="Your note" style={{ marginBottom: 16 }}>
        <Input.TextArea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Personal note" />
        <Button type="primary" style={{ marginTop: 8 }} onClick={saveNote} loading={noteSaving}>
          Save note
        </Button>
      </Card>

      {collocations.length > 0 ? (
        <Card className="learn-card" title="Collocations" style={{ marginBottom: 16 }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {collocations.map((c, i) => (
              <li key={i}>{typeof c === "object" ? JSON.stringify(c) : String(c)}</li>
            ))}
          </ul>
        </Card>
      ) : null}

      {family.length > 0 ? (
        <Card className="learn-card" title="Word family">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {family.map((c, i) => (
              <li key={i}>{typeof c === "object" ? JSON.stringify(c) : String(c)}</li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
