import { useEffect, useState } from "react";
import { Alert, Button, InputNumber, Space, Table, Typography, message } from "antd";
import api from "../services/api";

function ReviewPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedWordById, setSelectedWordById] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

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

  const submitReview = async ({ wordId, answerResult, rating, selectedWordId }) => {
    try {
      setSubmittingId(wordId);
      const payload = {
        word_id: wordId,
        answer_result: answerResult,
        rating,
      };
      if (selectedWordId) payload.selected_word_id = selectedWordId;
      await api.post("/review/submit", payload);
      setData((prev) => prev.filter((item) => item.word_id !== wordId));
      message.success("Review submitted");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleAgain = async (row) => {
    const selectedWordId = Number(selectedWordById[row.word_id]);
    if (!selectedWordId || selectedWordId <= 0) {
      message.error("Nhap selected_word_id > 0 truoc khi submit Again");
      return;
    }
    await submitReview({
      wordId: row.word_id,
      answerResult: false,
      rating: "Again",
      selectedWordId,
    });
  };

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
          {
            title: "selected_word_id",
            render: (_, row) => (
              <InputNumber
                min={1}
                value={selectedWordById[row.word_id]}
                onChange={(value) =>
                  setSelectedWordById((prev) => ({
                    ...prev,
                    [row.word_id]: value ?? undefined,
                  }))
                }
              />
            ),
          },
          {
            title: "Actions",
            render: (_, row) => (
              <Space>
                <Button
                  danger
                  loading={submittingId === row.word_id}
                  onClick={() => handleAgain(row)}
                >
                  Again
                </Button>
                <Button
                  loading={submittingId === row.word_id}
                  onClick={() =>
                    submitReview({
                      wordId: row.word_id,
                      answerResult: true,
                      rating: "Hard",
                    })
                  }
                >
                  Hard
                </Button>
                <Button
                  type="primary"
                  loading={submittingId === row.word_id}
                  onClick={() =>
                    submitReview({
                      wordId: row.word_id,
                      answerResult: true,
                      rating: "Good",
                    })
                  }
                >
                  Good
                </Button>
                <Button
                  type="primary"
                  loading={submittingId === row.word_id}
                  onClick={() =>
                    submitReview({
                      wordId: row.word_id,
                      answerResult: true,
                      rating: "Easy",
                    })
                  }
                >
                  Easy
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </>
  );
}

export default ReviewPage;
