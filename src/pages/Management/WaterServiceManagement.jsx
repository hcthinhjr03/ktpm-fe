import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

function WaterServiceManagement() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/management");
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
      <h1>Quản lý dịch vụ nước</h1>
      <p>Trang quản lý dịch vụ nước với các chức năng riêng biệt.</p>
    </div>
  );
}

export default WaterServiceManagement;