import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

function SignContract() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/mainfunction");
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
      <h1>Kí hợp đỒng với khách hàng</h1>
      <p>Nội dung hợp đồng sẽ được hiển thị ở đây.</p>
    </div>
  );
}

export default SignContract;