import React from 'react';
import { Switch, Form, Input } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

export default function CurrencyForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Tên tiền tệ"
        name="name"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tên tiền tệ!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Ký hiệu"
        name="symbol"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập ký hiệu!',
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingRight: '5px',
        }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Dấu phân cách thập phân"
        name="decimal_separator"
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingLeft: '5px',
        }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dấu phân cách hàng nghìn"
        name="thousand_separator"
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingRight: '5px',
        }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Là tiền tệ mặc định"
        name="isDefault"
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingLeft: '5px',
        }}
        valuePropName="checked"
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </>
  );
}