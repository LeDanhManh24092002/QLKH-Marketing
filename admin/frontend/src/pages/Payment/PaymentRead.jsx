import useLanguage from '@/locale/useLanguage';
import ReadPaymentModule from '@/modules/PaymentModule/ReadPaymentModule';

export default function PaymentRead() {
  const translate = useLanguage();

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
  return <ReadPaymentModule config={configPage} />;
}