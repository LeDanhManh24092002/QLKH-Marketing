import useLanguage from '@/locale/useLanguage';

import GeneralSettingsModule from '@/modules/SettingModule/GeneralSettingsModule';

export default function GeneralSettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('Cài đặt'),
    DATATABLE_TITLE: translate('Danh sách cài đặt'),
    ADD_NEW_ENTITY: translate('Thêm cài đặt mới'),
    ENTITY_NAME: translate('Cài đặt'),

    SETTINGS_TITLE: translate('Cài đặt chung'),
  };

  const configPage = {
    entity,
    settingsCategory: 'app_settings',
    ...Labels,
  };
  return <GeneralSettingsModule config={configPage} />;
}