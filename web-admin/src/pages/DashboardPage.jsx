import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography } from "antd";
import api from "../services/api";

function DashboardPage() {
  const [stats, setStats] = useState({
    vocabularyCount: 0,
    reviewDue: 0,
    topErrors: 0,
  });

  useEffect(() => {
    const load = async () => {
      const [vocabRes, reviewRes, errorsRes] = await Promise.all([
        api.get("/vocabulary").catch(() => ({ data: { data: [] } })),
        api.get("/review/today").catch(() => ({ data: { data: [] } })),
        api.get("/errors/top-repeated?limit=5").catch(() => ({ data: { data: [] } })),
      ]);

      setStats({
        vocabularyCount: vocabRes.data?.data?.length || 0,
        reviewDue: reviewRes.data?.data?.length || 0,
        topErrors: errorsRes.data?.data?.length || 0,
      });
    };

    load();
  }, []);

  return (
    <>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Vocabulary Total" value={stats.vocabularyCount} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Review Due Today" value={stats.reviewDue} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Top Repeated Errors" value={stats.topErrors} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default DashboardPage;
