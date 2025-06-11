import { Space, Layout, Divider, Typography } from 'antd';
import logo from '@/style/images/nexlify-main.svg';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content
      style={{
        padding: '150px 30px 30px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        <img
          src={logo}
          alt="Nexlify"
          style={{ margin: '0 0 10px', display: 'block' }}
          height={200}
          width={520}
        />

        <Title level={1} style={{ fontSize: 28 }}>
        Tối ưu hóa quy trình quản lý khách hàng
        </Title>
        <Text>
           Đồ án tốt nghiệp 2025 - Lê Danh Mạnh
        </Text> <br />
        <Text>
           Version 1.0.0
        </Text>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
