import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

function Management() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Management</h1>
      <Space direction="vertical" size="middle" style={{ display: 'flex', marginBottom: 20, alignItems: 'center' }}>
        <Button 
          type="primary" 
          size="large" 
          style={{ backgroundColor: "#FF7F50", width: 300 }}
          onClick={() => handleNavigate("/management/water-service")}
        >
          Quản lý khách hàng, căn hộ
        </Button>
        <Button 
          type="primary" 
          size="large" 
          style={{ backgroundColor: "#FF7F50", width: 300 }}
          onClick={() => handleNavigate("/management/water-service")}
        >
          Quản lý dịch vụ nước
        </Button>
        <Button 
          type="primary" 
          size="large" 
          style={{ backgroundColor: "#FF7F50", width: 300 }}
          onClick={() => handleNavigate("/management/water-service")}
        >
          Quản lý mức luỹ tiến và mức giá
        </Button>
      </Space>
    </div>
  );
}

export default Management;