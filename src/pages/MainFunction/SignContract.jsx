// Contract dates
import dayjs from 'dayjs';
const currentDate = dayjs();
const oneYearLater = currentDate.add(1, 'year');import React, { useState, useEffect } from "react";
import { 
Button, 
Form, 
Select, 
DatePicker, 
Card, 
message, 
Row, 
Col, 
Typography, 
Divider, 
Spin, 
Input, 
Space, 
Modal,
Tag,
Table
} from "antd";
import { useNavigate } from "react-router-dom";
import { 
ArrowLeftOutlined, 
SearchOutlined
} from "@ant-design/icons";


// Import services
import { createContract } from "../../services/ContractService";
import { 
getAllCustomers, 
searchCustomerByIdentityCard, 
searchCustomerByPhone, 
searchCustomerByEmail, 
searchCustomerByName
} from "../../services/CustomerService";
import { getApartmentsByCustomerId } from "../../services/ApartmentService";
import { getAllWaterServices } from "../../services/WaterServiceService";

const { Title, Text } = Typography;
const { Option } = Select;

function SignContract() {
const navigate = useNavigate();
const [form] = Form.useForm();
const [loading, setLoading] = useState(false);
const [customers, setCustomers] = useState([]);
const [apartments, setApartments] = useState([]);
const [waterServices, setWaterServices] = useState([]);
const [selectedCustomer, setSelectedCustomer] = useState(null);
const [selectedApartment, setSelectedApartment] = useState(null);
const [selectedService, setSelectedService] = useState(null);

// For customer search
const [searchMode, setSearchMode] = useState(null);
const [searchValue, setSearchValue] = useState("");
const [searchCustomerModalVisible, setSearchCustomerModalVisible] = useState(false);
const [searchResults, setSearchResults] = useState([]);
const [searchLoading, setSearchLoading] = useState(false);

// Fetch data when component mounts
useEffect(() => {
  fetchInitialData();
}, []);

const fetchInitialData = async () => {
  setLoading(true);
  try {
    const [customersData, waterServicesData] = await Promise.all([
      getAllCustomers(),
      getAllWaterServices()
    ]);
    
    setCustomers(customersData || []);
    setWaterServices(waterServicesData || []);
    
    // Initialize apartments as empty - they will be loaded based on customer selection
    setApartments([]);
  } catch (error) {
    console.error("Error fetching initial data:", error);
    message.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
  } finally {
    setLoading(false);
  }
};

const handleBack = () => {
  navigate("/mainfunction");
};

// Search for customer
const searchCustomer = async () => {
  if (!searchMode || !searchValue.trim()) {
    message.warning("Vui lòng chọn loại tìm kiếm và nhập giá trị tìm kiếm");
    return;
  }
  
  setSearchLoading(true);
  try {
    let results;
    
    switch (searchMode) {
      case 'identity':
        results = await searchCustomerByIdentityCard(searchValue);
        break;
      case 'phone':
        results = await searchCustomerByPhone(searchValue);
        break;
      case 'email':
        results = await searchCustomerByEmail(searchValue);
        break;
      case 'name':
        results = await searchCustomerByName(searchValue);
        break;
      default:
        throw new Error("Invalid search mode");
    }
    
    // Handle single result vs array result based on endpoint
    if (Array.isArray(results)) {
      setSearchResults(results);
    } else if (results) {
      setSearchResults([results]);
    } else {
      setSearchResults([]);
    }
  } catch (error) {
    console.error("Error searching for customer:", error);
    setSearchResults([]);
    message.error("Không tìm thấy khách hàng hoặc có lỗi xảy ra");
  } finally {
    setSearchLoading(false);
  }
};

const selectCustomerFromSearch = (customer) => {
  setSelectedCustomer(customer);
  form.setFieldsValue({ customerId: customer.customerId });
  setSearchCustomerModalVisible(false);
  
  // Fetch and update apartments for this customer
  fetchAndUpdateApartmentsForCustomer(customer.customerId);
};

const fetchAndUpdateApartmentsForCustomer = async (customerId) => {
  try {
    const customerApartments = await getApartmentsByCustomerId(customerId);
    if (customerApartments && customerApartments.length > 0) {
      // Update apartments list to only show this customer's apartments
      setApartments(customerApartments);
      message.info(`Hiển thị ${customerApartments.length} căn hộ của khách hàng này`);
    } else {
      message.warning('Khách hàng này chưa có căn hộ nào. Vui lòng thêm căn hộ trước khi ký hợp đồng.');
      setApartments([]);
    }
  } catch (error) {
    console.error("Error fetching apartments for customer:", error);
    message.error("Không thể tải dữ liệu căn hộ của khách hàng");
  }
};

const handleCustomerChange = async (customerId) => {
  const customer = customers.find(c => c.customerId === customerId);
  setSelectedCustomer(customer);
  
  // Reset apartment selection
  form.setFieldsValue({ apartmentId: undefined });
  setSelectedApartment(null);
  
  // Fetch apartments for this customer
  try {
    const customerApartments = await getApartmentsByCustomerId(customerId);
    if (customerApartments && customerApartments.length > 0) {
      // Update apartments list to only show this customer's apartments
      setApartments(customerApartments);
      message.info(`Hiển thị ${customerApartments.length} căn hộ của khách hàng này`);
    } else {
      message.info('Khách hàng này chưa có căn hộ nào');
      setApartments([]);
    }
  } catch (error) {
    console.error("Error fetching apartments for customer:", error);
    message.error("Không thể tải dữ liệu căn hộ của khách hàng");
  }
};

const handleApartmentChange = (apartmentId) => {
  const apartment = apartments.find(a => a.apartmentId === apartmentId);
  setSelectedApartment(apartment);
};

const handleServiceChange = (serviceId) => {
  const service = waterServices.find(s => s.serviceId === serviceId);
  setSelectedService(service);
};

const showCustomerSearchModal = () => {
  setSearchValue("");
  setSearchResults([]);
  setSearchCustomerModalVisible(true);
};


const handleSubmit = async () => {
  try {
    const values = await form.validateFields();
    
    // Check if customer has any apartments
    if (apartments.length === 0) {
      message.error("Không thể tạo hợp đồng vì khách hàng chưa có căn hộ.");
      return;
    }
    
    // Format dates to the required format
    const contractData = {
      ...values,
      signDate: values.signDate.format('YYYY-MM-DD'),
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
      status: "active",
      apartment: {
        apartmentId: values.apartmentId
      },
      waterService: {
        serviceId: values.serviceId
      },
      customer: {
        customerId: values.customerId
      }
    };
    
    setLoading(true);
    
    // Call API to create contract
    const response = await createContract(contractData);
    
    if (response) {
      message.success("Ký hợp đồng thành công!");
      form.resetFields();
      setSelectedCustomer(null);
      setSelectedApartment(null);
      setSelectedService(null);
      setApartments([]);
      
      // Redirect back or to contract details
      setTimeout(() => {
        navigate("/mainfunction");
      }, 1500);
    }
  } catch (error) {
    console.error("Error creating contract:", error);
    message.error("Không thể tạo hợp đồng. Vui lòng kiểm tra lại thông tin.");
  } finally {
    setLoading(false);
  }
};

return (
  <Spin spinning={loading}>
    <div>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>
      
      <Title level={2}>Ký hợp đồng với khách hàng</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          signDate: currentDate,
          startDate: currentDate,
          endDate: oneYearLater,
        }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Card title="Thông tin khách hàng" bordered={false}>
              <Space style={{ marginBottom: 16 }}>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  onClick={showCustomerSearchModal}
                  style={{ backgroundColor: "#FF7F50" }}
                >
                  Tìm kiếm khách hàng
                </Button>
              </Space>
              
              <Form.Item
                name="customerId"
                label="Khách hàng"
                rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
              >
                <Select
                  placeholder="Chọn khách hàng"
                  onChange={handleCustomerChange}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {customers.map(customer => (
                    <Option key={customer.customerId} value={customer.customerId} label={`${customer.fullName} (${customer.identityCard})`}>
                      {customer.fullName} ({customer.identityCard})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              {selectedCustomer && (
                <div>
                  <Divider orientation="left">Thông tin chi tiết</Divider>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Text strong>Số CMND/CCCD:</Text> {selectedCustomer.identityCard}
                    </Col>
                    <Col span={8}>
                      <Text strong>Số điện thoại:</Text> {selectedCustomer.phoneNumber}
                    </Col>
                    <Col span={8}>
                      <Text strong>Email:</Text> {selectedCustomer.email}
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 8 }}>
                    <Col span={24}>
                      <Text strong>Địa chỉ:</Text> {selectedCustomer.address}
                    </Col>
                  </Row>
                </div>
              )}
            </Card>
          </Col>
          
          <Col span={24} style={{ marginTop: 16 }}>
            <Card title="Thông tin căn hộ" >
              <Form.Item
                name="apartmentId"
                label="Căn hộ"
                rules={[{ required: true, message: 'Vui lòng chọn căn hộ' }]}
                extra={!selectedCustomer ? "Vui lòng chọn khách hàng trước" : 
                       apartments.length === 0 ? "Khách hàng này chưa có căn hộ" : null}
              >
                <Select
                  placeholder="Chọn căn hộ"
                  onChange={handleApartmentChange}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  disabled={!selectedCustomer || apartments.length === 0}
                >
                  {apartments.map(apartment => (
                    <Option 
                      key={apartment.apartmentId} 
                      value={apartment.apartmentId}
                      label={`${apartment.apartmentNumber} - ${apartment.building} (${apartment.area} m²)`}
                    >
                      {apartment.apartmentNumber} - {apartment.building} ({apartment.area} m²)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              {selectedApartment && (
                <div>
                  <Divider orientation="left">Thông tin chi tiết</Divider>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Text strong>Số căn hộ:</Text> {selectedApartment.apartmentNumber}
                    </Col>
                    <Col span={8}>
                      <Text strong>Tòa nhà:</Text> {selectedApartment.building}
                    </Col>
                    <Col span={8}>
                      <Text strong>Diện tích:</Text> {selectedApartment.area} m²
                    </Col>
                  </Row>
                </div>
              )}
            </Card>
          </Col>
          
          <Col span={24} style={{ marginTop: 16 }}>
            <Card title="Thông tin dịch vụ nước" bordered={false}>
              <Form.Item
                name="serviceId"
                label="Dịch vụ nước"
                rules={[{ required: true, message: 'Vui lòng chọn dịch vụ nước' }]}
              >
                <Select
                  placeholder="Chọn dịch vụ nước"
                  onChange={handleServiceChange}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {waterServices.map(service => (
                    <Option 
                      key={service.serviceId} 
                      value={service.serviceId}
                      label={`${service.serviceName} (${service.unit})`}
                    >
                      {service.serviceName} ({service.unit})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              {selectedService && selectedService.priceRates && (
                <div>
                  <Divider orientation="left">Bảng giá lũy tiến</Divider>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>STT</th>
                        <th style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>Từ (m³)</th>
                        <th style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>Đến (m³)</th>
                        <th style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>Đơn giá (VNĐ)</th>
                        <th style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>Ngày hiệu lực</th>
                        <th style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>Ngày hết hạn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedService.priceRates.map((rate, index) => (
                        <tr key={rate.rateId || index}>
                          <td style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                          <td style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>{rate.fromAmount}</td>
                          <td style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>{rate.toAmount}</td>
                          <td style={{ border: '1px solid #eee', padding: '8px', textAlign: 'right' }}>
                            {rate.unitPrice.toLocaleString()} VNĐ
                          </td>
                          <td style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>
                            {dayjs(rate.effectiveDate).format('DD/MM/YYYY')}
                          </td>
                          <td style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>
                            {dayjs(rate.expiryDate).format('DD/MM/YYYY')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </Col>
          
          <Col span={24} style={{ marginTop: 16 }}>
            <Card title="Thông tin hợp đồng" bordered={false}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="signDate"
                    label="Ngày ký hợp đồng"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày ký hợp đồng' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="startDate"
                    label="Ngày bắt đầu hiệu lực"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="endDate"
                    label="Ngày kết thúc"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Space>
            <Button onClick={handleBack}>Hủy</Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ backgroundColor: "#FF7F50" }}
              loading={loading}
            >
              Ký hợp đồng
            </Button>
          </Space>
        </div>
      </Form>
      
      {/* Customer Search Modal */}
      <Modal
        title="Tìm kiếm khách hàng"
        open={searchCustomerModalVisible}
        onCancel={() => setSearchCustomerModalVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Select
                placeholder="Tìm theo"
                style={{ width: '100%' }}
                value={searchMode}
                onChange={setSearchMode}
              >
                <Option value="identity">CMND/CCCD</Option>
                <Option value="phone">Số điện thoại</Option>
                <Option value="email">Email</Option>
                <Option value="name">Họ tên</Option>
              </Select>
            </Col>
            <Col span={12}>
              <Input
                placeholder="Nhập giá trị tìm kiếm"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onPressEnter={searchCustomer}
              />
            </Col>
            <Col span={6}>
              <Button 
                type="primary" 
                onClick={searchCustomer}
                style={{ backgroundColor: "#FF7F50" }}
                loading={searchLoading}
              >
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </div>
        
        <Spin spinning={searchLoading}>
          {searchResults.length > 0 ? (
            <div>
              <Table
                dataSource={searchResults}
                rowKey="customerId"
                pagination={false}
                columns={[
                  {
                    title: 'Họ tên',
                    dataIndex: 'fullName',
                    key: 'fullName',
                  },
                  {
                    title: 'CMND/CCCD',
                    dataIndex: 'identityCard',
                    key: 'identityCard',
                  },
                  {
                    title: 'Số điện thoại',
                    dataIndex: 'phoneNumber',
                    key: 'phoneNumber',
                  },
                  {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                  },
                  {
                    title: 'Thao tác',
                    key: 'action',
                    render: (_, record) => (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => selectCustomerFromSearch(record)}
                        style={{ backgroundColor: "#FF7F50" }}
                      >
                        Chọn
                      </Button>
                    ),
                  },
                ]}
              />
            </div>
          ) : searchValue && !searchLoading ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Text type="secondary">Không tìm thấy khách hàng</Text>
            </div>
          ) : null}
        </Spin>
      </Modal>
    </div>
  </Spin>
);
}

export default SignContract;