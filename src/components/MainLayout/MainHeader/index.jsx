import { Layout } from "antd";
import { FaNetworkWired } from "react-icons/fa";
import "./MainHeader.scss";
const { Header } = Layout;

function MainHeader() {
  return (
    <>
      <Header
        className="header"
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#201e1e",
          padding: "40px 60px",
        }}
      >
        <a href="/" className="header__wrap">
          <div className="header__logo">
            <FaNetworkWired />
          </div>
          <div className="header__title">KTPM 2025</div>
        </a>
      </Header>
    </>
  );
}

export default MainHeader;