import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import PaymentDataTableModule from '@/modules/PaymentModule/PaymentDataTableModule';

import { useMoney, useDate } from '@/settings';

export default function Payment() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();
  const searchConfig = {
    entity: 'client',
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const deleteModalLabels = ['number'];
  const dataTableColumns = [
    {
      title: translate('Số thanh toán'),
      dataIndex: 'number',
    },
    {
      title: translate('Khách hàng'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('Số tiền'),
      dataIndex: 'amount',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (amount, record) =>
        moneyFormatter({ amount: amount, currency_code: record.currency }),
    },
    {
      title: translate('Ngày'),
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Số hóa đơn'),
      dataIndex: ['invoice', 'number'],
    },
    {
      title: translate('Năm'),
      dataIndex: ['invoice', 'year'],
    },
    {
      title: translate('Phương thức thanh toán'),
      dataIndex: ['paymentMode', 'name'],
    },
  ];

  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: translate('Thanh toán'),
    DATATABLE_TITLE: translate('Danh sách thanh toán'),
    ADD_NEW_ENTITY: translate('Thêm thanh toán mới'),
    ENTITY_NAME: translate('Thanh toán'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    disableAdd: true,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return <PaymentDataTableModule config={config} />;
}