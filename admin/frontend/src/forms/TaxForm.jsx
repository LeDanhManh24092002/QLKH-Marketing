import React from 'react';
import { Switch, Form, Input, InputNumber } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function TaxForm({ isUpdateForm = false }) {
    const translate = useLanguage();
    return (
        <>
            <Form.Item
                label={translate('Tên thuế')}
                name="taxName"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={translate('Giá trị')}
                name="taxValue"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập giá trị thuế!',
                        type: 'number',
                        min: 0,
                        max: 100,
                    },
                ]}
            >
                <InputNumber min={0} max={100} suffix={"%"} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label={translate('Kích hoạt')}
                name="enabled"
                style={{
                    display: 'inline-block',
                    width: 'calc(50%)',
                    paddingRight: '5px',
                }}
                valuePropName="checked"
                initialValue={true}
            >
                <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
            </Form.Item>
            <Form.Item
                label={translate('Mặc định')}
                name="isDefault"
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