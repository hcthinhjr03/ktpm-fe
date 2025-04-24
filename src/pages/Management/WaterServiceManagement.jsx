import React, { useState, useEffect, useCallback } from "react";
import { 
  Button, 
  Table, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Popconfirm, 
  message, 
  Divider,
  Typography,
  DatePicker,
  InputNumber,
  Card,
} from "antd";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
} from "@ant-design/icons";
import { 
  getAllWaterServices, 
  createWaterService, 
  updateWaterService,
  getWaterServiceById,
  deleteWaterService,
} from "../../services/WaterServiceService";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

function WaterServiceManagement() {
  const navigate = useNavigate();
  const [waterServices, setWaterServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentService, setCurrentService] = useState(null);
  const [priceRates, setPriceRates] = useState([]);

  // Fetch all water services on component mount
  const fetchWaterServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllWaterServices();
      setWaterServices(data);
      
      // Check if undo is available
      const undoAvailable = await canUndo();
      setCanUndoAction(undoAvailable);
    } catch (error) {
      message.error("Không thể tải dữ liệu dịch vụ nước");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWaterServices();
  }, [fetchWaterServices]);

  const handleBack = () => {
    navigate("/management");
  };

  const showModal = async (record = null) => {
    if (record) {
      setLoading(true);
      try {
        const latestData = await getWaterServiceById(record.serviceId);
        setCurrentService(latestData);

        form.setFieldsValue({
          serviceName: latestData.serviceName,
          description: latestData.description,
          unit: latestData.unit,
        });
        
        const formattedPriceRates = latestData.priceRates ? latestData.priceRates.map(rate => ({
          ...rate,
          effectiveDate: rate.effectiveDate ? dayjs(rate.effectiveDate) : null,
          expiryDate: rate.expiryDate ? dayjs(rate.expiryDate) : null,
        })) : [];
        
        setPriceRates(formattedPriceRates);
      } catch (error) {
        message.error("Không thể tải thông tin dịch vụ nước");
        console.error("Error fetching water service details:", error);
        return; 
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentService(null);
      form.resetFields();
      setPriceRates([]);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setCurrentService(null);
    setPriceRates([]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const formattedPriceRates = priceRates.map(rate => ({
        ...(rate.rateId && { rateId: rate.rateId }),
        fromAmount: rate.fromAmount,
        toAmount: rate.toAmount,
        unitPrice: rate.unitPrice,
        effectiveDate: rate.effectiveDate ? dayjs(rate.effectiveDate).format('YYYY-MM-DD') : null,
        expiryDate: rate.expiryDate ? dayjs(rate.expiryDate).format('YYYY-MM-DD') : null
      }));

      const serviceData = {
        ...values,
        priceRates: formattedPriceRates
      };

      if (currentService) {
        await updateWaterService(currentService.serviceId, {
          ...serviceData,
          serviceId: currentService.serviceId
        });
        message.success("Cập nhật dịch vụ nước thành công");
      } else {
        // Create new service
        await createWaterService(serviceData);
        message.success("Thêm dịch vụ nước mới thành công");
      }
      
      setIsModalVisible(false);
      fetchWaterServices();
      form.resetFields();
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại");
    }
  };

  const handleDelete = async (id) => {
    setLoading(true); 
    try {
      await deleteWaterService(id);
      
      setWaterServices(prevServices => 
        prevServices.filter(service => service.serviceId !== id)
      );
      
      message.success("Xóa dịch vụ nước thành công");

      // Check if undo is available after deletion
      const undoAvailable = await canUndo();
      setCanUndoAction(undoAvailable);
    } catch (error) {
      console.error("Error deleting water service:", error);
      message.error("Không thể xóa dịch vụ nước");
      
      fetchWaterServices();
    } finally {
      setLoading(false);
    }
  };

  const addPriceRate = () => {
    const newRate = {
      fromAmount: 0,
      toAmount: 0,
      unitPrice: 0,
      effectiveDate: dayjs(),
      expiryDate: dayjs().add(1, 'year'),
      key: Date.now() 
    };
    setPriceRates([...priceRates, newRate]);
  };

  const updatePriceRate = (index, field, value) => {
    const newRates = [...priceRates];
    newRates[index][field] = value;
    setPriceRates(newRates);
  };

  const removePriceRate = (index) => {
    const newRates = [...priceRates];
    newRates.splice(index, 1);
    setPriceRates(newRates);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'serviceId',
      key: 'serviceId',
      width: 80,
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
    },
    {
      title: 'Số mức giá',
      key: 'priceRatesCount',
      width: 120,
      render: (_, record) => (record.priceRates ? record.priceRates.length : 0),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
            style={{ backgroundColor: "#FF7F50" }}
          />
          <Popconfirm
            title="Xác nhận xóa?"
            description="Bạn có chắc chắn muốn xóa dịch vụ nước này?"
            onConfirm={() => handleDelete(record.serviceId)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ style: { backgroundColor: "#FF7F50" } }}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Quản lý dịch vụ nước</Title>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchWaterServices}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            style={{ backgroundColor: "#FF7F50" }}
          >
            Thêm dịch vụ nước
          </Button>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={waterServices} 
        rowKey="serviceId" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={currentService ? "Cập nhật dịch vụ nước" : "Thêm dịch vụ nước mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={800}
        okText={currentService ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        okButtonProps={{ style: { backgroundColor: "#FF7F50" } }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="serviceName"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
          >
            <Input placeholder="Nhập tên dịch vụ nước" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={3} placeholder="Nhập mô tả dịch vụ nước" />
          </Form.Item>
          
          <Form.Item
            name="unit"
            label="Đơn vị tính"
            rules={[{ required: true, message: 'Vui lòng nhập đơn vị tính' }]}
          >
            <Input placeholder="Ví dụ: m³" />
          </Form.Item>

          <Divider orientation="left">Mức giá theo lũy tiến</Divider>
          
          <div style={{ marginBottom: 16 }}>
            <Button 
              type="dashed" 
              onClick={addPriceRate} 
              style={{ width: '100%' }}
              icon={<PlusOutlined />}
            >
              Thêm mức giá mới
            </Button>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {priceRates.map((rate, index) => (
              <Card 
                key={rate.rateId || rate.key || index} 
                style={{ marginBottom: 16 }}
                title={`Mức ${index + 1}`}
                extra={
                  <Button 
                    danger 
                    onClick={() => removePriceRate(index)}
                    icon={<DeleteOutlined />}
                  />
                }
              >
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 30%' }}>
                    <Text>Từ lượng (m³)</Text>
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      value={rate.fromAmount}
                      onChange={(value) => updatePriceRate(index, 'fromAmount', value)}
                    />
                  </div>
                  <div style={{ flex: '1 1 30%' }}>
                    <Text>Đến lượng (m³)</Text>
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      value={rate.toAmount}
                      onChange={(value) => updatePriceRate(index, 'toAmount', value)}
                    />
                  </div>
                  <div style={{ flex: '1 1 30%' }}>
                    <Text>Đơn giá (VNĐ)</Text>
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      step={100}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      value={rate.unitPrice}
                      onChange={(value) => updatePriceRate(index, 'unitPrice', value)}
                    />
                  </div>
                  <div style={{ flex: '1 1 45%' }}>
                    <Text>Ngày hiệu lực</Text>
                    <DatePicker
                      style={{ width: '100%' }}
                      value={dayjs(rate.effectiveDate)}
                      onChange={(date) => updatePriceRate(index, 'effectiveDate', date)}
                    />
                  </div>
                  <div style={{ flex: '1 1 45%' }}>
                    <Text>Ngày hết hạn</Text>
                    <DatePicker
                      style={{ width: '100%' }}
                      value={dayjs(rate.expiryDate)}
                      onChange={(date) => updatePriceRate(index, 'expiryDate', date)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default WaterServiceManagement;