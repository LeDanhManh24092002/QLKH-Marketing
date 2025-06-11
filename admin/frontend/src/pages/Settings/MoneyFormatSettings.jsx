import useLanguage from '@/locale/useLanguage';

import MoneyFormatSettingsModule from '@/modules/SettingModule/MoneyFormatSettingsModule';

export default function MoneyFormatSettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('Cài đặt'),
    DATATABLE_TITLE: translate('Danh sách cài đặt'),
    ADD_NEW_ENTITY: translate('Thêm cài đặt mới'),
    ENTITY_NAME: translate('Cài đặt'),
    SETTINGS_TITLE: translate('Cài đặt định dạng tiền tệ'),
  };

  const configPage = {
    entity,
    settingsCategory: 'money_format_settings',
    ...Labels,
  };
  return <MoneyFormatSettingsModule config={configPage} />;
}