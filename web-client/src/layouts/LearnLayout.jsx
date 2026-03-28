import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Layout, Menu } from "antd";
import {
  HomeOutlined,
  ReadOutlined,
  TagsOutlined,
  BugOutlined,
  HistoryOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const items = [
  { key: "/learn/dashboard", icon: <HomeOutlined />, label: <Link to="/learn/dashboard">Dashboard</Link> },
  { key: "/learn/review", icon: <ReadOutlined />, label: <Link to="/learn/review">Review</Link> },
  { key: "/learn/topic", icon: <TagsOutlined />, label: <Link to="/learn/topic">Topic</Link> },
  { key: "/learn/errors", icon: <BugOutlined />, label: <Link to="/learn/errors">Errors</Link> },
  { key: "/learn/history", icon: <HistoryOutlined />, label: <Link to="/learn/history">History</Link> },
];

export default function LearnLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} theme="light" style={{ borderRight: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="learn-brand" style={{ background: "#7BC47F" }}>
          MY LEARN E
        </div>
        <Menu mode="inline" selectedKeys={[location.pathname]} items={items} style={{ borderRight: 0 }} />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Button icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Button>
        </Header>
        <Content className="learn-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
