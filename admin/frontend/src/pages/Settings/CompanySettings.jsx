import useLanguage from '@/locale/useLanguage';

import CompanySettingsModule from '@/modules/SettingModule/CompanySettingsModule';

export default function CompanySettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('Cài đặt'),
    DATATABLE_TITLE: translate('Danh sách cài đặt'),
    ADD_NEW_ENTITY: translate('Thêm cài đặt mới'),
    ENTITY_NAME: translate('Cài đặt'),

    SETTINGS_TITLE: translate('Cài đặt công ty'),
  };

  const configPage = {
    entity,
    settingsCategory: 'company_settings',
    ...Labels,
  };
  return <CompanySettingsModule config={configPage} />;
}