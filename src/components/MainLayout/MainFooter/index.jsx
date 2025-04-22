import { ConfigProvider, Layout } from "antd";
import "./MainFooter.scss";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
const { Footer } = Layout;

function MainFooter() {
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
          },
        }}
      >
        <Footer
          className="footer"
          style={{
            backgroundColor: "#201e1e",
          }}
        >
          <div className="footer__wrap">
            <div className="footer__social">
              <a
                href="https://www.facebook.com/cuongthinh.ha.9/"
                target="_blank"
                rel="noreferrer"
                className="footer__box"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/_https.cthinhh?igsh=bWo3YzVkeDN3NXRk"
                target="_blank"
                rel="noreferrer"
                className="footer__box"
              >
                <FaInstagram />
              </a>
              <a
                href="https://github.com/hcthinhjr03"
                target="_blank"
                rel="noreferrer"
                className="footer__box"
              >
                <FaGithub />
              </a>
            </div>
            <div className="footer__end">DESIGN: HA CUONG THINH</div>
          </div>
        </Footer>
      </ConfigProvider>
      
    </>
  );
}

export default MainFooter;