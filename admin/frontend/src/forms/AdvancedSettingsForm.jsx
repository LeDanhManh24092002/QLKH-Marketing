import { Switch, Form, Input, Button, Space, Select } from 'antd';
import { CloseOutlined, CheckOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCurrentItem } from '@/redux/crud/selectors';
import { useState } from 'react';

import useLanguage from '@/locale/useLanguage';

export function SelectType() {
  const translate = useLanguage();

  return (
    <Form.List name="settingValue" initialValue={[{ Label: '', Value: '' }]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <Space key={field.key} align="center">
              <Form.Item
                {...field}
                label={translate('Nhãn')}
                name={[field.name, 'label']}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                {...field}
                label={translate('Giá trị')}
                name={[field.name, 'Value']}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </Space>
          ))}

          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Thêm tùy chọn chọn
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}

export default function AdvancedSettingsForm({ isUpdateForm = false }) {
  const translate = useLanguage();
  const { result } = useSelector(selectCurrentItem);
  const [type, setType] = useState(null);
  const options = ['number', 'text', 'date'];

  const handleChange = (value) => {
    setType(value);
  };
  return (
    <>
      <Form.Item
        label={translate('Danh mục cài đặt')}
        name="settingCategory"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={translate('Chọn')}
          options={[
            {
              value: 'app_settings',
              label: translate('Cài đặt ứng dụng'),
            },
            {
              value: 'crm_settings',
              label: translate('Cài đặt CRM'),
            },

            {
              value: 'finance_settings',
              label: translate('Cài đặt tài chính'),
            },
            {
              value: 'company_settings',
              label: translate('Cài đặt công ty'),
            },
            {
              value: 'money_format_settings',
              label: translate('Cài đặt định dạng tiền tệ'),
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label={translate('Tên cài đặt')}
        name="settingKey"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>

      <Form.Item
        label={translate('Loại')}
        name="settingType"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={translate('Chọn')}
          onChange={handleChange}
          options={[
            {
              value: 'text',
              label: 'Văn bản',
            },
            {
              value: 'number',
              label: 'Số',
            },

            {
              value: 'date',
              label: 'Ngày',
            },
            {
              value: 'select',
              label: 'Chọn',
            },
          ]}
        />
      </Form.Item>
      {type ? (
        type === 'select' ? (
          <SelectType />
        ) : (
          <Form.Item
            label="Giá trị"
            name="settingValue"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type={type} />
          </Form.Item>
        )
      ) : null}

      <Form.Item
        label={translate('Kích hoạt')}
        name="enabled"
        style={{
          display: 'inline-block',
          width: '100%',
          paddingRight: '5px',
        }}
        valuePropName="checked"
        initialValue={true}
      >
        <Switch
          disabled={result ? result.isCoreSetting : false}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </Form.Item>
    </>
  );
}