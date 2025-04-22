import React from "react";
import { Layout, theme, ConfigProvider } from "antd";
import MainHeader from "./MainHeader";
import MainSider from "./MainSider";
import MainFooter from "./MainFooter";
import { Outlet } from "react-router-dom";
const { Content } = Layout;

function MainLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
          }
        }}
      >
        <Layout>
          <MainHeader />
          <Layout>
            <MainSider />
            <Layout
              style={{
                padding: "0 24px 24px",
              }}
            >
              <Content
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 510,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Outlet />
              </Content>
            </Layout>
          </Layout>   
          <MainFooter />
        </Layout>
      </ConfigProvider>
    </>
  );
}

export default MainLayout;