import { Result } from 'antd';
import useLanguage from '@/locale/useLanguage';
import logoIcon from '@/style/images/nexlify.png';

const About = () => {
  const translate = useLanguage();
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <img
        src={logoIcon}
        alt="Nexlify Logo"
        style={{
          height: '170px',
          marginBottom: '20px',
        }}
      />
      <Result
        status="info"
        title={'Nexlify'}
        subTitle={translate('Nexlify - Phần mềm quản lý doanh nghiệp hiện đại và hiệu quả')}
        extra={
          <>
            <p>Đồ án tốt nghiệp 2025 - Lê Danh Mạnh</p>
            <p>Version 1.0.0</p>
          </>
        }
      />
    </div>
  );
};

export default About;