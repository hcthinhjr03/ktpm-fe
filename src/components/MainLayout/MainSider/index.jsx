import { Button, Layout, Menu, theme, ConfigProvider } from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  NotificationOutlined,
  UserOutlined,
  DesktopOutlined,
  PieChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
const { Sider } = Layout;

const items = [
  {
    key: "",
    icon: <PieChartOutlined />,
    label: "Homepage",
  },
  {
    key: "management",
    icon: <DesktopOutlined />,
    label: "Management",
  },
  {
    key: "mainfunction",
    icon: <NotificationOutlined />,
    label: "MainFunction",
  },
  {
    key: "statistic",
    icon: <UserOutlined />,
    label: "Statistic",
  },
];

function MainSider() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(
    location.pathname.substring(1) || ""
  );

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleSelect = (item) => {
    navigate(`/${item.key}`);
    setSelectedKey(item.key);
  };
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemSelectedColor: "#FF7F50",
              itemSelectedBg: "#f7e9e3",
              iconSize: 22,
            },
          },
        }}
      >
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={220}
          style={{
            background: colorBgContainer,
            
            // height: "540px"
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '18px',
              width: 64,
              height: 64,
            }}
          />
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{
              //height: "100%",
              borderRight: 0,
              fontSize: "17px",
            }}
            items={items}
            onSelect={handleSelect}
          />
        </Sider>
      </ConfigProvider>
    </>
  );
}

export default MainSider;