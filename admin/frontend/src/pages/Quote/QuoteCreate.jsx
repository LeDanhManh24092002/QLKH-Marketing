import useLanguage from '@/locale/useLanguage';
import CreateQuoteModule from '@/modules/QuoteModule/CreateQuoteModule';

export default function QuoteCreate() {
  const translate = useLanguage();

  const entity = 'quote';

  const Labels = {
    PANEL_TITLE: translate('Báo giá'),
    DATATABLE_TITLE: translate('Danh sách báo giá'),
    ADD_NEW_ENTITY: translate('Thêm báo giá mới'),
    ENTITY_NAME: translate('Báo giá'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <CreateQuoteModule config={configPage} />;
}