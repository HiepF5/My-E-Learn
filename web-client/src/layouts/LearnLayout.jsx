import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Layout, Menu } from "antd";
import {
  HomeOutlined,
  ReadOutlined,
  TagsOutlined,
  BugOutlined,
  HistoryOutlined,
  LogoutOutlined,
  BookOutlined,
  FallOutlined,
  FireOutlined,
  UserOutlined,
  ExperimentOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const items = [
  { key: "/learn/dashboard", icon: <HomeOutlined />, label: <Link to="/learn/dashboard">Today</Link> },
  { key: "/learn/review", icon: <ReadOutlined />, label: <Link to="/learn/review">Review</Link> },
  { key: "/learn/vocabulary", icon: <BookOutlined />, label: <Link to="/learn/vocabulary">Vocabulary</Link> },
  { key: "/learn/weak-words", icon: <FallOutlined />, label: <Link to="/learn/weak-words">Weak words</Link> },
  { key: "/learn/streak", icon: <FireOutlined />, label: <Link to="/learn/streak">Streak</Link> },
  { key: "/learn/topic", icon: <TagsOutlined />, label: <Link to="/learn/topic">Topics</Link> },
  { key: "/learn/errors", icon: <BugOutlined />, label: <Link to="/learn/errors">Errors</Link> },
  { key: "/learn/history", icon: <HistoryOutlined />, label: <Link to="/learn/history">History</Link> },
  { key: "/learn/lab", icon: <ExperimentOutlined />, label: <Link to="/learn/lab">Learning lab</Link> },
  { key: "/learn/summary", icon: <FileTextOutlined />, label: <Link to="/learn/summary">Daily summary</Link> },
  { key: "/learn/profile", icon: <UserOutlined />, label: <Link to="/learn/profile">Profile</Link> },
];

function menuSelectedKey(pathname) {
  if (pathname.startsWith("/learn/vocabulary")) return "/learn/vocabulary";
  return pathname;
}

export default function LearnLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} theme="light" style={{ borderRight: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="learn-brand" style={{ background: "#7BC47F" }}>
          MY LEARN E — Learn
        </div>
        <Menu
          mode="inline"
          selectedKeys={[menuSelectedKey(location.pathname)]}
          items={items}
          style={{ borderRight: 0 }}
        />
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
