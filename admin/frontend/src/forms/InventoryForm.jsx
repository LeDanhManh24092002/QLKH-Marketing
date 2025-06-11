import React from 'react';
import { Form, Input, InputNumber } from 'antd';

export default function InventoryForm() {
  // Renamed to InventoryForm for clarity
  return (
    <>
      <Form.Item
        label="Sản phẩm"
        name="product"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tên sản phẩm!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Số lượng"
        name="quantity"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập số lượng!',
            type: 'number',
            min: 0, // Ensure non-negative numbers
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label="Đơn giá"
        name="unitPrice"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập đơn giá!',
            type: 'number',
            min: 0, // Ensure non-negative numbers
          },
        ]}
      >
        <InputNumber
          formatter={(value) => `$ ${value}`} // Optional: format value as currency
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')} // Optional: parse input as number
        />
      </Form.Item>
    </>
  );
}