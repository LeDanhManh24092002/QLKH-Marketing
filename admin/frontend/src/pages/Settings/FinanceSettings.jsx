import useLanguage from '@/locale/useLanguage';

import FinanceSettingsModule from '@/modules/SettingModule/FinanceSettingsModule';

export default function FinanceSettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('Cài đặt'),
    DATATABLE_TITLE: translate('Danh sách cài đặt'),
    ADD_NEW_ENTITY: translate('Thêm cài đặt mới'),
    ENTITY_NAME: translate('Cài đặt'),

    SETTINGS_TITLE: translate('Cài đặt tài chính'),
  };

  const configPage = {
    entity,
    settingsCategory: 'finance_settings',
    ...Labels,
  };
  return <FinanceSettingsModule config={configPage} />;
}