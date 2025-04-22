import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

function MainFunction() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Main Function</h1>
      <Space direction="vertical" size="middle" style={{ display: 'flex', marginBottom: 20, alignItems: 'center' }}>
        <Button 
          type="primary" 
          size="large" 
          style={{ backgroundColor: "#FF7F50", width: 300 }}
          onClick={() => handleNavigate("/mainfunction/sign-contract")}
        >
          Kí hợp đồng với khách hàng
        </Button>
        <Button 
          type="primary" 
          size="large" 
          style={{ backgroundColor: "#FF7F50", width: 300 }}
          onClick={() => handleNavigate("/mainfunction/sign-contract")}
        >
          Tạo hoá đơn 
        </Button>
        <Button 
          type="primary" 
          size="large" 
          style={{ backgroundColor: "#FF7F50", width: 300 }}
          onClick={() => handleNavigate("/mainfunction/sign-contract")}
        >
          Nhận thanh toán hàng tháng
        </Button>
      </Space>
    </div>
  );
}

export default MainFunction;