import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Layout, Menu } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  ClockCircleOutlined,
  BugOutlined,
  TagsOutlined,
  FireOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const items = [
  { key: "/", icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
  {
    key: "/vocabulary",
    icon: <BookOutlined />,
    label: <Link to="/vocabulary">Vocabulary</Link>,
  },
  { key: "/review", icon: <ClockCircleOutlined />, label: <Link to="/review">Review</Link> },
  { key: "/errors", icon: <BugOutlined />, label: <Link to="/errors">Errors</Link> },
  { key: "/topics", icon: <TagsOutlined />, label: <Link to="/topics">Topics</Link> },
  { key: "/streak", icon: <FireOutlined />, label: <Link to="/streak">Streak</Link> },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220}>
        <div className="brand">MY LEARN E</div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={items} />
      </Sider>
      <Layout>
        <Header className="header">
          <Button icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Button>
        </Header>
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
