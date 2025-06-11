import { Form, Input, Select } from 'antd';
import { UploadOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { message, Upload, Button, Switch } from 'antd';

import useLanguage from '@/locale/useLanguage';

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Hình ảnh phải nhỏ hơn 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export default function AdminForm({ isUpdateForm = false, isForAdminOwner = false }) {
  const translate = useLanguage();
  return (
    <>
      <Form.Item
        label={translate('Tên')}
        name="name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label={translate('Họ')}
        name="surname"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label={translate('Email')}
        name="email"
        rules={[
          {
            required: true,
          },
          {
            type: 'email',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>

      {!isUpdateForm && (
        <Form.Item
          label={translate('Mật khẩu')}
          name="password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      )}

      <Form.Item
        label={translate('Vai trò')}
        name="role"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Select.Option value="owner" disabled={!isForAdminOwner}>
            {translate('Chủ tài khoản')}
          </Select.Option>
          <Select.Option value="admin" disabled={isForAdminOwner}>
            {translate('Quản trị viên cấp cao')}
          </Select.Option>
          <Select.Option value="manager" disabled={isForAdminOwner}>
            {translate('Quản lý')}
          </Select.Option>
          <Select.Option value="employee" disabled={isForAdminOwner}>
            {translate('Nhân viên')}
          </Select.Option>
          <Select.Option value="create_only" disabled={isForAdminOwner}>
            {translate('Chỉ tạo')}
          </Select.Option>
          <Select.Option value="read_only" disabled={isForAdminOwner}>
            {translate('Chỉ đọc')}
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={translate('Kích hoạt')}
        name="enabled"
        valuePropName={'checked'}
        initialValue={true}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>

      {/* <Form.Item
        name="file"
        label={translate('Ảnh')}
        valuePropName="fileList"
        getValueFromEvent={(e) => e.fileList}
      >
        <Upload beforeUpload={beforeUpload}>
          <Button icon={<UploadOutlined />}>{translate('Nhấn để tải lên')}</Button>
        </Upload>
      </Form.Item> */}
    </>
  );
}