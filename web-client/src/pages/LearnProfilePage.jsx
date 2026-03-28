import { Link, useNavigate } from "react-router-dom";
import { Button, Card, List, Typography } from "antd";
import {
  ExperimentOutlined,
  FireOutlined,
  HistoryOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

export default function LearnProfilePage() {
  const navigate = useNavigate();
  const username = typeof localStorage !== "undefined" ? localStorage.getItem("username") || "—" : "—";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div>
      <Typography.Title level={2}>Profile</Typography.Title>
      <Typography.Paragraph>
        Signed in as <strong>{username}</strong>
      </Typography.Paragraph>
      <Card className="learn-card">
        <List
          itemLayout="horizontal"
          dataSource={[
            {
              icon: <FireOutlined />,
              title: <Link to="/learn/streak">Streak &amp; heatmap</Link>,
              desc: "Same as mobile streak screen",
            },
            {
              icon: <ExperimentOutlined />,
              title: <Link to="/learn/lab">Learning lab</Link>,
              desc: "Sentence mining, dictation, grammar",
            },
            {
              icon: <HistoryOutlined />,
              title: <Link to="/learn/summary">Daily summary + Phase K</Link>,
              desc: "Speaking, writing, AI feedback",
            },
            {
              icon: <UnorderedListOutlined />,
              title: <Link to="/learn/vocabulary">Vocabulary</Link>,
              desc: "Browse words and notes",
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta avatar={item.icon} title={item.title} description={item.desc} />
            </List.Item>
          )}
        />
      </Card>
      <Button danger icon={<LogoutOutlined />} onClick={logout} style={{ marginTop: 16 }}>
        Logout
      </Button>
    </div>
  );
}
