import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import SettingsForm from './SettingsForm';
import useLanguage from '@/locale/useLanguage';

export default function CompanySettingsModule({ config }) {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection
        title={translate('Cài đặt công ty')}
        description={translate('Cập nhật thông tin công ty của bạn')}
      >
        <SettingsForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}