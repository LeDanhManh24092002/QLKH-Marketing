import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import useLanguage from '@/locale/useLanguage';
import moment from 'moment';

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const translate = useLanguage();
  const [registrations, setRegistrations] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8888/api/campaign/read/${campaignId}`);
      setCampaign(response.data);
    } catch (error) {
      message.error(translate('Lỗi khi tải thông tin chiến dịch'));
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8888/api/campaign/${campaignId}/clients`);
      setRegistrations(response.data);
    } catch (error) {
      message.error(translate('Lỗi khi tải danh sách khách hàng'));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:8888/api/registrations/${registrationId}/approve`);
      message.success(translate('Duyệt đăng ký thành công'));
      await fetchRegistrations();
    } catch (error) {
      message.error(translate('Lỗi khi duyệt đăng ký'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
    fetchRegistrations();
  }, [campaignId]);

  const columns = [
    {
      title: translate('Tên khách hàng'),
      dataIndex: ['clientId', 'name'],
      key: 'name',
      render: (text, record) => (
        <Link to={record.clientId?._id ? `/customer/read/${record.clientId._id}` : '#'}>
          {text || 'N/A'}
        </Link>
      ),
    },
    {
      title: translate('Email'),
      dataIndex: ['clientId', 'email'],
      key: 'email',
      render: (text) => text || 'N/A',
    },
    {
      title: translate('Số điện thoại'),
      dataIndex: ['clientId', 'phone'],
      key: 'phone',
      render: (text) => text || 'N/A',
    },
    {
      title: translate('Địa chỉ'),
      dataIndex: ['clientId', 'address'],
      key: 'address',
      render: (text) => text || 'N/A',
    },
    {
      title: translate('Ngày đăng ký'),
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (date) => (date ? moment(date).format('DD/MM/YYYY') : 'N/A'),
    },
    {
      title: translate('Trạng thái'),
      dataIndex: 'status',
      key: 'status',
      render: (text) => text || 'N/A',
    },
    {
      title: translate('Hành động'),
      key: 'action',
      render: (_, record) => (
        <Button
          onClick={() => handleApprove(record._id)}
          disabled={record.status === 'approved'}
          loading={loading}
        >
          {translate('Duyệt')}
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg">
      {campaign && (
        <div className="mb-4">
          <h2>{campaign.name}</h2>
          <p>{translate('Mô tả')}: {campaign.description || 'Không có mô tả'}</p>
          <p>{translate('Ngày bắt đầu')}: {campaign.startDate ? moment(campaign.startDate).format('DD/MM/YYYY') : 'Chưa xác định'}</p>
          <p>{translate('Ngày kết thúc')}: {campaign.endDate ? moment(campaign.endDate).format('DD/MM/YYYY') : 'Chưa xác định'}</p>
          <p>{translate('Ngân sách')}: {campaign.budget ? campaign.budget.toLocaleString('vi-VN') : '0'}</p>
          <p>{translate('Trạng thái')}: {campaign.status || 'Không xác định'}</p>
          <p>{translate('Lời/Lỗ')}: {campaign.profitStatus || 'Hòa vốn'}</p>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={registrations}
        rowKey="_id"
        loading={loading}
        locale={{ emptyText: translate('Không có dữ liệu') }}
        className="bg-white rounded-lg"
      />
    </div>
  );
};

export default CampaignDetail;