import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Modal, Radio, Space, Spin, Typography, message } from "antd";
import api from "../services/api";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function currentTouchStep(touch) {
  if (!touch) return 1;
  if (!touch.touch1_done) return 1;
  if (!touch.touch2_done) return 2;
  if (!touch.touch3_done) return 3;
  return 4;
}

function stepLabel(step) {
  if (step === 1) return "Recognize";
  if (step === 2) return "Type";
  if (step === 3) return "Sentence";
  return "Done";
}

export default function LearnReviewPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [touch, setTouch] = useState(null);
  const [submittingTouch, setSubmittingTouch] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [vocabOptions, setVocabOptions] = useState([]);
  const [ratingBusy, setRatingBusy] = useState(false);
  const [againOpen, setAgainOpen] = useState(false);
  const [againPool, setAgainPool] = useState([]);
  const [againPick, setAgainPick] = useState(null);

  const current = items[index];
  const wordId = current ? Number(current.word_id) : null;

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/review/today", { params: { limit: 20 } });
      const rows = res.data?.data || [];
      setItems(Array.isArray(rows) ? rows : []);
      setIndex(0);
      setFlipped(false);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadVocabOptions = useCallback(async () => {
    try {
      const res = await api.get("/vocabulary");
      const raw = res.data?.data || [];
      if (!Array.isArray(raw)) return;
      setVocabOptions(
        raw.map((row) => ({
          id: Number(row.id),
          word: String(row.word || "").trim() || `Word #${row.id}`,
        }))
      );
    } catch {
      setVocabOptions([]);
    }
  }, []);

  useEffect(() => {
    loadQueue();
    loadVocabOptions();
  }, [loadQueue, loadVocabOptions]);

  useEffect(() => {
    if (!wordId) {
      setTouch(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/review/touch/${wordId}`);
        if (!cancelled) setTouch(res.data?.data || null);
      } catch {
        if (!cancelled) setTouch(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wordId]);

  useEffect(() => {
    setFlipped(false);
  }, [wordId]);

  const step = currentTouchStep(touch);
  const canRate = step >= 4;

  const wordLabel = useMemo(() => {
    if (!current) return "";
    const w = current.word;
    if (w && String(w).trim()) return String(w).trim();
    const opt = vocabOptions.find((v) => v.id === wordId);
    return opt?.word || `Word #${wordId}`;
  }, [current, vocabOptions, wordId]);

  const wordForId = (id) => {
    const opt = vocabOptions.find((v) => v.id === id);
    return opt?.word || `Word #${id}`;
  };

  const completeTouchStep = async () => {
    if (!wordId || submittingTouch) return;
    setSubmittingTouch(true);
    try {
      await api.patch(`/review/touch/${wordId}`, { touch_step: step, done: true });
      const res = await api.get(`/review/touch/${wordId}`);
      setTouch(res.data?.data || null);
    } catch {
      message.error("Could not save touch step");
    } finally {
      setSubmittingTouch(false);
    }
  };

  const submitReview = useCallback(
    async (rating, answerResult, selectedWordId) => {
      if (!wordId || ratingBusy) return;
      const idx = index;
      const list = items;
      setRatingBusy(true);
      try {
        const body = {
          word_id: wordId,
          answer_result: answerResult,
          rating,
        };
        if (selectedWordId != null) body.selected_word_id = selectedWordId;
        await api.post("/review/submit", body);
        const next = idx + 1;
        if (next < list.length) {
          setIndex(next);
        } else {
          setItems([]);
          setIndex(0);
          message.success("Done for today");
        }
        setTouch(null);
        setFlipped(false);
      } catch (e) {
        message.error(e.response?.data?.message || "Submit failed");
      } finally {
        setRatingBusy(false);
      }
    },
    [wordId, ratingBusy, index, items]
  );

  const openAgainModal = useCallback(() => {
    if (!wordId) return;
    const pool = shuffle(vocabOptions.filter((v) => v.id !== wordId))
      .slice(0, 3)
      .map((v) => v.id);
    if (!pool.length) {
      message.warning("Not enough other words for mistake picker.");
      return;
    }
    setAgainPool(pool);
    setAgainPick(null);
    setAgainOpen(true);
  }, [wordId, vocabOptions]);

  const confirmAgain = async () => {
    if (againPick == null) {
      message.warning("Pick a word");
      return;
    }
    setAgainOpen(false);
    await submitReview("Again", false, againPick);
  };

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!current || ratingBusy) return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      if (!canRate) return;
      if (e.key === "1") {
        e.preventDefault();
        openAgainModal();
      }
      if (e.key === "2") {
        e.preventDefault();
        submitReview("Hard", true);
      }
      if (e.key === "3") {
        e.preventDefault();
        submitReview("Good", true);
      }
      if (e.key === "4") {
        e.preventDefault();
        submitReview("Easy", true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, canRate, ratingBusy, openAgainModal, submitReview]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!current) {
    return (
      <div>
        <Typography.Title level={2}>Review</Typography.Title>
        <Typography.Paragraph>Done for today — no due cards in the queue.</Typography.Paragraph>
        <Button type="primary" onClick={loadQueue}>
          Refresh queue
        </Button>
      </div>
    );
  }

  const meaning = current.meaning || "—";
  const example = current.example_sentence || "";
  const phonetic = current.phonetic || "";

  return (
    <div>
      <Typography.Title level={2}>Review</Typography.Title>
      <Typography.Paragraph type="secondary">
        Space: flip · 1–4: rate (when enabled) — Again / Hard / Good / Easy
      </Typography.Paragraph>
      <Typography.Text>
        Card {index + 1} / {items.length} · SRS level {current.level ?? "—"}
      </Typography.Text>
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        <Typography.Text strong>
          {canRate ? "Ready to rate" : `Step ${step} / 3 — ${stepLabel(step)}`}
        </Typography.Text>
      </div>

      <Card className="learn-card">
        <div className={`flip-scene ${flipped ? "flipped" : ""}`}>
          <div className="flip-scene-inner">
            <div className="flip-face flip-face-front">
              <Typography.Title level={2} style={{ textAlign: "center", marginTop: 24 }}>
                {wordLabel}
              </Typography.Title>
              {phonetic ? (
                <Typography.Title level={4} type="secondary" style={{ textAlign: "center" }}>
                  {phonetic}
                </Typography.Title>
              ) : null}
            </div>
            <div className="flip-face flip-face-back">
              <Typography.Title level={5} style={{ color: "#7BC47F" }}>
                Meaning
              </Typography.Title>
              <Typography.Paragraph>{meaning}</Typography.Paragraph>
              {example ? (
                <>
                  <Typography.Title level={5} style={{ color: "#7BC47F" }}>
                    Example
                  </Typography.Title>
                  <Typography.Paragraph>{example}</Typography.Paragraph>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flip-hint">Press Space to flip</div>

        {!canRate ? (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Typography.Text type="secondary">
              3-touch: R:{touch?.touch1_done ? "✓" : "·"} T:{touch?.touch2_done ? "✓" : "·"} S:
              {touch?.touch3_done ? "✓" : "·"}
            </Typography.Text>
            <div style={{ marginTop: 12 }}>
              <Button type="primary" onClick={completeTouchStep} loading={submittingTouch}>
                Complete {stepLabel(step)}
              </Button>
            </div>
          </div>
        ) : (
          <Space wrap style={{ marginTop: 24, width: "100%", justifyContent: "center" }}>
            <Button onClick={openAgainModal} disabled={ratingBusy}>
              Again (1)
            </Button>
            <Button onClick={() => submitReview("Hard", true)} disabled={ratingBusy}>
              Hard (2)
            </Button>
            <Button type="primary" onClick={() => submitReview("Good", true)} disabled={ratingBusy}>
              Good (3)
            </Button>
            <Button onClick={() => submitReview("Easy", true)} disabled={ratingBusy}>
              Easy (4)
            </Button>
          </Space>
        )}
      </Card>

      <Modal
        title="Which word did you confuse with?"
        open={againOpen}
        onOk={confirmAgain}
        onCancel={() => setAgainOpen(false)}
        okText="Submit"
      >
        <Radio.Group
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
          value={againPick}
          onChange={(e) => setAgainPick(e.target.value)}
        >
          {againPool.map((id) => (
            <Radio key={id} value={id}>
              {wordForId(id)}
            </Radio>
          ))}
        </Radio.Group>
      </Modal>
    </div>
  );
}
