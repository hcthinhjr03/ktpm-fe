import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

function WaterServiceStatistic() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/statistic");
  };

  return (
    <div>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>
      <h1>Thống kê dịch vụ nước</h1>
      <p>Nội dung thống kê sẽ được hiển thị ở đây.</p>
    </div>
  );
}

export default WaterServiceStatistic;