import { Form, Input, Select } from 'antd';

import useLanguage from '@/locale/useLanguage';

export default function LeadForm() {
  const translate = useLanguage();
  return (
    <>
      <Form.Item
        label={translate('Tên')}
        name="firstName"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Họ')}
        name="lastName"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Email')}
        name="email"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Số điện thoại')}
        name="phone"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="tel" />
      </Form.Item>

      <Form.Item
        label={translate('Công ty')}
        name="company"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Vị trí trong công ty')}
        name="jobTitle"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={translate('Địa chỉ')} name="address">
        <Input />
      </Form.Item>

      <Form.Item label={translate('Quốc gia')} name="country">
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Trạng thái')}
        name="status"
        rules={[
          {
            required: false,
          },
        ]}
        initialValue={'new'}
      >
        <Select
          options={[
            { value: 'new', label: translate('Mới') },
            { value: 'reached', label: translate('Đã liên hệ') },
            { value: 'interested', label: translate('Quan tâm') },
            { value: 'not interested', label: translate('Không quan tâm') },
          ]}
        ></Select>
      </Form.Item>

      <Form.Item label={translate('Ghi chú')} name="notes">
        <Input />
      </Form.Item>

      <Form.Item label={translate('Nguồn')} name="source">
        <Input placeholder="ví dụ: linkedin, website, quảng cáo..." />
      </Form.Item>
    </>
  );
}