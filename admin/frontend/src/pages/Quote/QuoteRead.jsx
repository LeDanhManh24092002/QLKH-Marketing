import useLanguage from '@/locale/useLanguage';
import ReadQuoteModule from '@/modules/QuoteModule/ReadQuoteModule';

export default function QuoteRead() {
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
  return <ReadQuoteModule config={configPage} />;
}