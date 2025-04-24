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
  Modal
} from "antd";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeftOutlined, 
  FilterOutlined, 
  ReloadOutlined, 
  EyeOutlined, 
  DollarOutlined
} from "@ant-design/icons";
import dayjs from 'dayjs';
import { 
  getWaterServiceStatistics, 
  getWaterServiceBills 
} from "../../services/WaterServiceStatisticService";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function WaterServiceStatistic() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  
  // For detailed view
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [detailedBills, setDetailedBills] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch statistics on component mount and when date range changes
  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const [fromDate, toDate] = dateRange;
      const data = await getWaterServiceStatistics(fromDate, toDate);
      
      // Sort by revenue from highest to lowest
      const sortedData = data.sort((a, b) => b.revenue - a.revenue);
      
      setStatistics(sortedData);
      
      // Calculate totals
      const revenue = sortedData.reduce((sum, item) => sum + item.revenue, 0);
      const contracts = sortedData.reduce((sum, item) => sum + item.totalContracts, 0);
      
      setTotalRevenue(revenue);
      setTotalContracts(contracts);
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
  };

  const handleFilter = () => {
    fetchStatistics();
  };

  const handleResetFilter = () => {
    setDateRange([null, null]);
    // Re-fetch statistics without date filters
    fetchStatistics();
  };

  const handleViewDetails = async (service) => {
    setSelectedService(service);
    setDetailModalVisible(true);
    setDetailLoading(true);
    
    try {
      const [fromDate, toDate] = dateRange;
      const billsData = await getWaterServiceBills(service.serviceId, fromDate, toDate);
      setDetailedBills(billsData);
    } catch (error) {
      console.error("Error fetching detailed bills:", error);
      message.error("Không thể tải dữ liệu chi tiết. Vui lòng thử lại sau!");
    } finally {
      setDetailLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
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
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => formatCurrency(revenue),
      sorter: (a, b) => a.revenue - b.revenue,
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
    },
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
            <Space>
              <Text strong>Khoảng thời gian:</Text>
              <RangePicker 
                value={dateRange}
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
              />
              <Button 
                type="primary" 
                icon={<FilterOutlined />} 
                onClick={handleFilter}
                style={{ backgroundColor: "#FF7F50" }}
              >
                Lọc
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
              title="Tổng doanh thu"
              value={totalRevenue}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarOutlined />}
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
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Doanh thu"
                  value={selectedService.revenue}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ color: '#FF7F50' }}
                />
              </Col>
            </Row>

            <Card title="Thông tin dịch vụ" style={{ marginTop: 16 }}>
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

            <Card title="Danh sách hóa đơn" style={{ marginTop: 16 }}>
              <Spin spinning={detailLoading}>
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
              </Spin>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default WaterServiceStatistic;