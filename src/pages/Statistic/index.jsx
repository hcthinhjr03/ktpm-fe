import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

function Statistic() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Statistic</h1>
      <Space direction="vertical" size="middle" style={{ display: 'flex', marginBottom: 20, alignItems: 'center' }}>
        <Button 
          type="primary" 
          size="large" 
          style={{ backgroundColor: "#FF7F50", width: 300 }}
          onClick={() => handleNavigate("/statistic/water-service")}
        >
          Thống kê khách hàng 
        </Button>
        <Button 
          type="primary" 
          size="large" 
          style={{ backgroundColor: "#FF7F50", width: 300 }}
          onClick={() => handleNavigate("/statistic/water-service")}
        >
          Thống kê dịch vụ nước 
        </Button>
        <Button 
          type="primary" 
          size="large" 
          style={{ backgroundColor: "#FF7F50", width: 300 }}
          onClick={() => handleNavigate("/statistic/water-service")}
        >
          Thống kê doanh thu
        </Button>
      </Space>
    </div>
  );
}

export default Statistic;