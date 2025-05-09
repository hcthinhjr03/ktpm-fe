import React, { useState, useEffect } from "react";
import { 
  Button, 
  Table, 
  Card, 
  Space, 
  DatePicker, 
  Typography, 
  Row, 
  Col, 
  Spin, 
  Empty, 
  message, 
  Statistic, 
  Tooltip, 
  Modal,
  Select,
  Tabs
} from "antd";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeftOutlined, 
  FilterOutlined, 
  ReloadOutlined, 
  EyeOutlined, 
  DollarOutlined,
  LineChartOutlined,
  PercentageOutlined
} from "@ant-design/icons";
import dayjs from 'dayjs';
import { 
  getWaterServiceStatistics, 
  getWaterServiceBills,
  getWaterServiceStatisticById 
} from "../../services/WaterServiceStatisticService";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

function WaterServiceStatistic() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedStrategy, setSelectedStrategy] = useState("total");
  
  // For detailed view
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [detailedBills, setDetailedBills] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailStrategy, setDetailStrategy] = useState("total");

  // Fetch statistics on component mount and when filters change
  useEffect(() => {
    fetchStatistics();
  }, [dateRange, selectedStrategy]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const [fromDate, toDate] = dateRange;
      const data = await getWaterServiceStatistics(fromDate, toDate, selectedStrategy);
      
      // Sort by revenue from highest to lowest
      const sortedData = data.sort((a, b) => b.revenueValue - a.revenueValue);
      
      setStatistics(sortedData);
      
      // Calculate totals
      const revenue = sortedData.reduce((sum, item) => sum + item.revenueValue, 0);
      setTotalRevenue(revenue);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      message.error("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/statistic");
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    // fetchStatistics will be called automatically by the useEffect
  };

  const handleStrategyChange = (value) => {
    setSelectedStrategy(value);
    // fetchStatistics will be called automatically by the useEffect
  };

  const handleFilter = () => {
    // This function is kept for the filter button, but data will refresh automatically
    // when dateRange or selectedStrategy changes
    fetchStatistics();
  };

  const handleResetFilter = () => {
    setDateRange([null, null]);
    setSelectedStrategy("total");
    // Re-fetch statistics without date filters
    fetchStatistics();
  };

  const handleViewDetails = async (service) => {
    setSelectedService(service);
    setDetailModalVisible(true);
    setDetailLoading(true);
    setDetailStrategy("total"); // Reset to default strategy when opening modal
    
    try {
      const [fromDate, toDate] = dateRange;
      
      // Get detailed service information with the same strategy
      const serviceDetail = await getWaterServiceStatisticById(
        service.serviceId, 
        fromDate, 
        toDate, 
        "total" // Always start with total for details
      );
      
      // Get detailed bills
      const billsData = await getWaterServiceBills(service.serviceId, fromDate, toDate);
      
      setSelectedService(serviceDetail);
      setDetailedBills(billsData);
    } catch (error) {
      console.error("Error fetching detailed information:", error);
      message.error("Không thể tải dữ liệu chi tiết. Vui lòng thử lại sau!");
    } finally {
      setDetailLoading(false);
    }
  };

  // For automatic detail strategy update
  const handleDetailStrategyChange = async (value) => {
    if (!selectedService) return;
    
    setDetailStrategy(value);
    setDetailLoading(true);
    
    try {
      const [fromDate, toDate] = dateRange;
      const serviceDetail = await getWaterServiceStatisticById(
        selectedService.serviceId, 
        fromDate, 
        toDate, 
        value
      );
      setSelectedService(serviceDetail);
    } catch (error) {
      console.error("Error updating service detail strategy:", error);
      message.error("Không thể cập nhật chiến lược thống kê. Vui lòng thử lại!");
    } finally {
      setDetailLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Format the revenue value based on strategy
  const formatRevenue = (value, strategy) => {
    if (strategy === "total") {
      return formatCurrency(value);
    } else if (strategy === "monthly_average") {
      return formatCurrency(value) + "/tháng";
    } else if (strategy === "growth_rate") {
      return value.toFixed(2) + "%";
    }
    return formatCurrency(value);
  };

  // Get appropriate icon for revenue strategy
  const getRevenueIcon = (strategy) => {
    switch (strategy) {
      case "total": 
        return <DollarOutlined />;
      case "monthly_average":
        return <LineChartOutlined />;
      case "growth_rate":
        return <PercentageOutlined />;
      default:
        return <DollarOutlined />;
    }
  };

  // Get title for revenue based on strategy
  const getRevenueTitle = (strategy) => {
    switch (strategy) {
      case "total":
        return "Tổng doanh thu";
      case "monthly_average":
        return "Doanh thu trung bình hàng tháng";
      case "growth_rate":
        return "Tỷ lệ tăng trưởng doanh thu";
      default:
        return "Doanh thu";
    }
  };

  // Main table columns
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
    },
    {
      title: () => {
        const title = getRevenueTitle(selectedStrategy);
        return title;
      },
      dataIndex: 'revenueValue',
      key: 'revenueValue',
      render: (value, record) => formatRevenue(value, record.revenueStrategy),
      sorter: (a, b) => a.revenueValue - b.revenueValue,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button 
            icon={<EyeOutlined />} 
            type="primary"
            onClick={() => handleViewDetails(record)}
            style={{ backgroundColor: "#FF7F50" }}
          />
        </Tooltip>
      ),
    },
  ];

  // Detail table columns for bills
  const billColumns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'billId',
      key: 'billId',
    },
    {
      title: 'Ngày lập',
      dataIndex: 'billDate',
      key: 'billDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatCurrency(amount),
    }
  ];

  // Determine the date range label for display
  const getDateRangeLabel = () => {
    const [fromDate, toDate] = dateRange;
    if (fromDate && toDate) {
      return `${fromDate.format('DD/MM/YYYY')} - ${toDate.format('DD/MM/YYYY')}`;
    }
    return "Tất cả thời gian";
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

      <Title level={2}>Thống kê dịch vụ nước theo doanh thu</Title>

      {/* Filter section */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Space direction="horizontal" wrap>
              <Text strong>Khoảng thời gian:</Text>
              <RangePicker 
                value={dateRange}
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
              />
              <Text strong>Chiến lược:</Text>
              <Select 
                value={selectedStrategy}
                onChange={handleStrategyChange}
                style={{ width: 200 }}
              >
                <Option value="total">Tổng doanh thu</Option>
                <Option value="monthly_average">Trung bình hàng tháng</Option>
                <Option value="growth_rate">Tỷ lệ tăng trưởng</Option>
              </Select>
              {/* Filter button is now optional since data auto-refreshes when filters change */}
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={fetchStatistics}
                style={{ backgroundColor: "#FF7F50" }}
              >
                Làm mới
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleResetFilter}
              >
                Đặt lại
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Text>Đang hiển thị dữ liệu: <strong>{getDateRangeLabel()}</strong></Text>
          </Col>
        </Row>
      </Card>

      {/* Stats summary */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Card>
            <Statistic
              title={getRevenueTitle(selectedStrategy)}
              value={totalRevenue}
              formatter={(value) => formatRevenue(value, selectedStrategy)}
              prefix={getRevenueIcon(selectedStrategy)}
              valueStyle={{ color: '#FF7F50' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main statistics table */}
      <Spin spinning={loading}>
        {statistics.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={statistics}
            rowKey="serviceId"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty description="Không có dữ liệu thống kê" />
        )}
      </Spin>

      {/* Detail modal */}
      <Modal
        title={`Chi tiết dịch vụ: ${selectedService?.serviceName || ''}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedService && (
          <div>
            <Spin spinning={detailLoading}>
              <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={16}>
                  <Statistic
                    title={getRevenueTitle(selectedService.revenueStrategy)}
                    value={selectedService.revenueValue}
                    formatter={(value) => formatRevenue(value, selectedService.revenueStrategy)}
                    prefix={getRevenueIcon(selectedService.revenueStrategy)}
                    valueStyle={{ color: '#FF7F50' }}
                  />
                </Col>
                <Col span={8}>
                  <Text strong>Chiến lược thống kê:</Text>
                  <Select 
                    value={detailStrategy}
                    onChange={handleDetailStrategyChange}
                    style={{ width: '100%', marginTop: 8 }}
                  >
                    <Option value="total">Tổng doanh thu</Option>
                    <Option value="monthly_average">Trung bình hàng tháng</Option>
                    <Option value="growth_rate">Tỷ lệ tăng trưởng</Option>
                  </Select>
                </Col>
              </Row>

              <Tabs defaultActiveKey="info">
                <Tabs.TabPane tab="Thông tin dịch vụ" key="info">
                  <Card>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text strong>Mã dịch vụ:</Text> {selectedService.serviceId}
                      </Col>
                      <Col span={12}>
                        <Text strong>Đơn vị tính:</Text> {selectedService.unit}
                      </Col>
                    </Row>
                    {selectedService.description && (
                      <Row style={{ marginTop: 8 }}>
                        <Col span={24}>
                          <Text strong>Mô tả:</Text> {selectedService.description}
                        </Col>
                      </Row>
                    )}
                    <Row style={{ marginTop: 8 }}>
                      <Col span={24}>
                        <Text strong>Khoảng thời gian thống kê:</Text> {' '}
                        {selectedService.fromDate ? dayjs(selectedService.fromDate).format('DD/MM/YYYY') : 'N/A'} 
                        {' - '} 
                        {selectedService.toDate ? dayjs(selectedService.toDate).format('DD/MM/YYYY') : 'N/A'}
                      </Col>
                    </Row>
                  </Card>

                  <Card title="Bảng giá dịch vụ" style={{ marginTop: 16 }}>
                    {selectedService.priceRates && selectedService.priceRates.length > 0 ? (
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
                                {new Intl.NumberFormat('vi-VN').format(rate.unitPrice)} VNĐ
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
                    ) : (
                      <Empty description="Không có dữ liệu bảng giá" />
                    )}
                  </Card>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Danh sách hóa đơn" key="bills">
                  {detailedBills.length > 0 ? (
                    <Table 
                      columns={billColumns} 
                      dataSource={detailedBills}
                      rowKey="billId"
                      pagination={{ pageSize: 5 }}
                    />
                  ) : (
                    <Empty description="Không có dữ liệu hóa đơn" />
                  )}
                </Tabs.TabPane>
              </Tabs>
            </Spin>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default WaterServiceStatistic;