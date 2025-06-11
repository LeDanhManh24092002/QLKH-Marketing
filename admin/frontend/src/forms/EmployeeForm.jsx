import { Form, Input, Select } from 'antd';
import { DatePicker } from 'antd';
import { validatePhoneNumber } from '@/utils/helpers';
import { useDate } from '@/settings';

import useLanguage from '@/locale/useLanguage';

export default function EmployeeForm() {
  const translate = useLanguage();
  const { dateFormat } = useDate();

  return (
    <>
      <Form.Item
        name="name"
        label={translate('Tên')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="surname"
        label={translate('Họ')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="birthday"
        label={translate('Ngày sinh')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <DatePicker placeholder={translate('Chọn ngày')} format={dateFormat} />
      </Form.Item>
      <Form.Item
        name="birthplace"
        label={translate('Nơi sinh')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="gender"
        label={translate('Giới tính')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Select.Option value="men">{translate('Nam')}</Select.Option>
          <Select.Option value="women">{translate('Nữ')}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="email"
        label={translate('Email')}
        rules={[
          {
            type: 'email',
          },
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label={translate('Số điện thoại')}
        rules={[
          {
            required: true,
          },
          {
            pattern: validatePhoneNumber, // importing regex from helper.js utility file to validate
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="department"
        label={translate('Phòng ban')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="position"
        label={translate('Vị trí')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label={translate('Địa chỉ')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="state"
        label={translate('Tỉnh/Thành phố')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
    </>
  );
}