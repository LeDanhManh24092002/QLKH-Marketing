import React from 'react';

import useLanguage from '@/locale/useLanguage';

import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule/CrudModule';
import TaxForm from '@/forms/TaxForm';

export default function Taxes() {
  const translate = useLanguage();
  const entity = 'taxes';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const deleteModalLabels = ['name'];

  const readColumns = [
    {
      title: translate('Tên thuế'),
      dataIndex: 'taxName',
    },
    {
      title: translate('Giá trị'),
      dataIndex: 'taxValue',
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
      title: translate('Tên thuế'),
      dataIndex: 'taxName',
    },
    {
      title: translate('Giá trị'),
      dataIndex: 'taxValue',
      render: (_, record) => {
        return <>{record.taxValue + '%'}</>;
      },
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
    PANEL_TITLE: translate('Thuế'),
    DATATABLE_TITLE: translate('Danh sách thuế'),
    ADD_NEW_ENTITY: translate('Thêm thuế mới'),
    ENTITY_NAME: translate('Thuế'),
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
      createForm={<TaxForm />}
      updateForm={<TaxForm isUpdateForm={true} />}
      config={config}
    />
  );
}