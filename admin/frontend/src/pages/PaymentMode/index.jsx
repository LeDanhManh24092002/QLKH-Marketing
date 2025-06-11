import React from 'react';

import useLanguage from '@/locale/useLanguage';

import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule/CrudModule';
import PaymentModeForm from '@/forms/PaymentModeForm';

export default function PaymentMode() {
  const translate = useLanguage();
  const entity = 'paymentMode';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const deleteModalLabels = ['name'];

  const readColumns = [
    {
      title: translate('Phương thức thanh toán'),
      dataIndex: 'name',
    },
    {
      title: translate('Mô tả'),
      dataIndex: 'description',
    },
    {
      title: translate('Mặc định'),
      dataIndex: 'isDefault',
    },
    {
      title: translate('Kích hoạt'),
      dataIndex: 'enabled',
    },
  ];
  const dataTableColumns = [
    {
      title: translate('Phương thức thanh toán'),
      dataIndex: 'name',
    },
    {
      title: translate('Mô tả'),
      dataIndex: 'description',
    },
    {
      title: translate('Mặc định'),
      dataIndex: 'isDefault',
      key: 'isDefault',
      onCell: (record, rowIndex) => {
        return {
          props: {
            style: {
              width: '60px',
            },
          },
        };
      },
      render: (_, record) => {
        return (
          <Switch
            checked={record.isDefault}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        );
      },
    },
    {
      title: translate('Kích hoạt'),
      dataIndex: 'enabled',
      key: 'enabled',
      onCell: (record, rowIndex) => {
        return {
          props: {
            style: {
              width: '60px',
            },
          },
        };
      },
      render: (_, record) => {
        return (
          <Switch
            checked={record.enabled}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        );
      },
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('Phương thức thanh toán'),
    DATATABLE_TITLE: translate('Danh sách phương thức thanh toán'),
    ADD_NEW_ENTITY: translate('Thêm phương thức thanh toán mới'),
    ENTITY_NAME: translate('Phương thức thanh toán'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    readColumns,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<PaymentModeForm />}
      updateForm={<PaymentModeForm isUpdateForm={true} />}
      config={config}
    />
  );
}