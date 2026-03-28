import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import api from "../services/api";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/login", values);
      const user = res.data?.data?.user;
      if (!user) {
        setError("Invalid response");
        return;
      }
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("userRole", user.role || "USER");
      navigate("/learn/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F6FBF7",
      }}
    >
      <Card className="learn-card" style={{ width: 420 }}>
        <Typography.Title level={3}>Learner login</Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginTop: -8 }}>
          Same API as mobile. Use demo learner <code>demo</code> / <code>demo123</code> after seed.
        </Typography.Paragraph>
        {error ? <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} /> : null}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Username" name="username" rules={[{ required: true }]}>
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
