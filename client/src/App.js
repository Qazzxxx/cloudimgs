import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, message } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  UploadOutlined,
  PictureOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import UploadComponent from "./components/UploadComponent";
import ImageGallery from "./components/ImageGallery";
import StatsComponent from "./components/StatsComponent";
import LogoWithText from "./components/LogoWithText";
import axios from "axios";

const { Header, Content, Sider } = Layout;

// 主应用组件
function AppContent() {
  const [selectedKey, setSelectedKey] = useState("upload");
  const [stats, setStats] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 根据当前路由设置选中的菜单项
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/upload") {
      setSelectedKey("upload");
    } else if (path === "/gallery") {
      setSelectedKey("gallery");
    } else if (path === "/stats") {
      setSelectedKey("stats");
    }
  }, [location.pathname]);

  // 获取统计信息
  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("获取统计信息失败:", error);
    }
  };

  // 获取图片列表
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/images");
      if (response.data.success) {
        setImages(response.data.data);
      }
    } catch (error) {
      console.error("获取图片列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 删除图片
  const handleDeleteImage = async (filename) => {
    try {
      await axios.delete(`/api/images/${filename}`);
      message.success("图片删除成功");
      fetchImages();
      fetchStats();
    } catch (error) {
      console.error("删除图片失败:", error);
    }
  };

  // 上传成功后刷新数据
  const handleUploadSuccess = () => {
    fetchImages();
    fetchStats();
  };

  // 菜单点击处理
  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    switch (key) {
      case "upload":
        navigate("/upload");
        break;
      case "gallery":
        navigate("/gallery");
        break;
      case "stats":
        navigate("/stats");
        break;
      default:
        navigate("/upload");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchImages();
  }, []);

  const menuItems = [
    {
      key: "upload",
      icon: <UploadOutlined />,
      label: "上传图片",
    },
    {
      key: "gallery",
      icon: <PictureOutlined />,
      label: "图片管理",
    },
    {
      key: "stats",
      icon: <DashboardOutlined />,
      label: "统计信息",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <LogoWithText
            size={32}
            titleLevel={3}
            style={{ verticalAlign: "middle" }}
          />
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <UploadComponent onUploadSuccess={handleUploadSuccess} />
                }
              />
              <Route
                path="/upload"
                element={
                  <UploadComponent onUploadSuccess={handleUploadSuccess} />
                }
              />
              <Route
                path="/gallery"
                element={
                  <ImageGallery
                    images={images}
                    loading={loading}
                    onDelete={handleDeleteImage}
                    onRefresh={fetchImages}
                  />
                }
              />
              <Route path="/stats" element={<StatsComponent stats={stats} />} />
              <Route
                path="*"
                element={
                  <UploadComponent onUploadSuccess={handleUploadSuccess} />
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

// 主App组件
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
