import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Dropdown, Menu } from 'antd';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import moment from 'moment';

const Campaign = () => {
  const translate = useLanguage();
  const [campaigns, setCampaigns] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [form] = Form.useForm();

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:8888/api/campaign/listAll');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Fetch campaigns error:', error);
      message.error(translate('lỗi khi tải danh sách chiến dịch'));
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const showModal = (campaign = null) => {
    setEditingCampaign(campaign);
    if (campaign) {
      form.setFieldsValue({
        name: campaign.name,
        description: campaign.description,
        startDate: campaign.startDate ? moment(campaign.startDate) : null,
        endDate: campaign.endDate ? moment(campaign.endDate) : null,
        budget: campaign.budget,
        status: campaign.status,
        profitStatus: campaign.profitStatus,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        description: values.description || '',
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        budget: values.budget ? Number(values.budget) : null,
        status: values.status || 'inactive',
        ...(editingCampaign ? { profitStatus: values.profitStatus || 'neutral' } : {}),
      };

      if (editingCampaign) {
        await axios.put(`http://localhost:8888/api/campaign/update/${editingCampaign._id}`, payload);
        message.success(translate('cập nhật chiến dịch thành công'));
      } else {
        await axios.post('http://localhost:8888/api/campaign/create', payload);
        message.success(translate('tạo chiến dịch thành công'));
      }
      setIsModalVisible(false);
      fetchCampaigns();
    } catch (error) {
      console.error('Save campaign error:', error);
      message.error(translate('lỗi khi lưu chiến dịch'));
    }
  };

  const handleProfitStatusChange = async (campaignId, profitStatus) => {
    try {
      const payload = { profitStatus };
      await axios.put(`http://localhost:8888/api/campaign/update/${campaignId}`, payload);
      message.success(translate('cập nhật trạng thái lời/lỗ thành công'));
      fetchCampaigns();
    } catch (error) {
      console.error('Update profit status error:', error);
      message.error(translate('lỗi khi cập nhật trạng thái lời/lỗ'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8888/api/campaign/delete/${id}`);
      message.success(translate('xóa chiến dịch thành công'));
      fetchCampaigns();
    } catch (error) {
      console.error('Delete campaign error:', error);
      message.error(translate('lỗi khi xóa chiến dịch'));
    }
  };

  const profitStatusMenu = (campaignId) => (
    <Menu
      onClick={({ key }) => handleProfitStatusChange(campaignId, key)}
      items={[
        {
          key: 'profit',
          label: translate('lời'),
        },
        {
          key: 'loss',
          label: translate('lỗ'),
        },
        {
          key: 'neutral',
          label: translate('hòa vốn'),
        },
      ]}
    />
  );

  const columns = [
    {
      title: translate('tên chiến dịch'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/campaign/${record._id}`}>{text}</Link>,
    },
    // {
    //   title: translate('mô tả'),
    //   dataIndex: 'description',
    //   key: 'description',
    // },
    {
      title: translate('ngày bắt đầu'),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => (date ? moment(date).format('DD/MM/YYYY') : ''),
    },
    {
      title: translate('ngày kết thúc'),
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => (date ? moment(date).format('DD/MM/YYYY') : ''),
    },
    {
      title: translate('ngân sách'),
      dataIndex: 'budget',
      key: 'budget',
    },
    {
      title: translate('trạng thái'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: translate('hành động'),
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>{translate('sửa')}</Button>
          <Button danger onClick={() => handleDelete(record._id)} style={{ marginLeft: 8 }}>
            {translate('xóa')}
          </Button>
        </>
      ),
    },
    {
      title: translate('status'),
      key: 'profitStatus',
      render: (_, record) => (
        <Dropdown overlay={profitStatusMenu(record._id)} trigger={['click']}>
          <Button type="link" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        {translate('thêm chiến dịch')}
      </Button>
      <Table columns={columns} dataSource={campaigns} rowKey="_id" />
      <Modal
        title={editingCampaign ? translate('sửa chiến dịch') : translate('thêm chiến dịch')}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={translate('tên chiến dịch')}
            rules={[{ required: true, message: translate('vui lòng nhập tên chiến dịch') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label={translate('mô tả')}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="startDate" label={translate('ngày bắt đầu')}>
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="endDate" label={translate('ngày kết thúc')}>
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="budget" label={translate('ngân sách')}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label={translate('trạng thái')}>
            <Select>
              <Select.Option value="active">{translate('hoạt động')}</Select.Option>
              <Select.Option value="inactive">{translate('không hoạt động')}</Select.Option>
            </Select>
          </Form.Item>
          {editingCampaign && (
            <Form.Item name="profitStatus" label={translate('lời/lỗ')}>
              <Select>
                <Select.Option value="profit">{translate('lời')}</Select.Option>
                <Select.Option value="loss">{translate('lỗ')}</Select.Option>
                <Select.Option value="neutral">{translate('hòa vốn')}</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Campaign;