import useLanguage from '@/locale/useLanguage';
import RecordPaymentModule from '@/modules/InvoiceModule/RecordPaymentModule';

export default function InvoiceRecord() {
  const entity = 'invoice';
  const translate = useLanguage();
  const Labels = {
    PANEL_TITLE: translate('Hóa đơn'),
    DATATABLE_TITLE: translate('Danh sách hóa đơn'),
    ADD_NEW_ENTITY: translate('Thêm hóa đơn mới'),
    ENTITY_NAME: translate('Hóa đơn'),

    RECORD_ENTITY: translate('Ghi nhận thanh toán'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <RecordPaymentModule config={configPage} />;
}