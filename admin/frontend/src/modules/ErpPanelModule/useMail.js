import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentItem } from '@/redux/erp/selectors';
import { message } from 'antd';
import Brevo from '@getbrevo/brevo';

export default function useMail({ entity }) {
  const [isLoading, setIsLoading] = useState(false);
  const { result: currentErp } = useSelector(selectCurrentItem);

  // Cấu hình Brevo
  const client = new Brevo.ApiClient();
  const apiKey = process.env.REACT_APP_BREVO_API_KEY;
  if (!apiKey) {
    console.error('Lỗi: REACT_APP_BREVO_API_KEY không được cấu hình trong .env');
  }
  client.authentications['api-key'].apiKey = apiKey;

  // Gửi email cho 1 khách hàng
  const send = async (id) => {
    setIsLoading(true);
    try {
      console.log('Dữ liệu ERP:', currentErp);
      console.log('Email khách hàng:', currentErp?.client?.email);
      console.log('URL PDF:', `${process.env.REACT_APP_DOWNLOAD_BASE_URL}/${entity}/${entity}-${id}.pdf`);

      if (!currentErp || currentErp._id !== id || !currentErp.client?.email) {
        throw new Error('Email khách hàng không hợp lệ hoặc dữ liệu ERP thiếu');
      }

      const email = new Brevo.SendSmtpEmail();
      email.sender = { name: 'Công ty của bạn', email: 'yourname@gmail.com' }; // Thay bằng email của bạn
      email.to = [{ email: currentErp.client.email, name: currentErp.client.name || 'Khách hàng' }];
      email.subject = `Hóa đơn #${currentErp.number}/${currentErp.year}`;
      email.htmlContent = `
        <h1>Xin chào ${currentErp.client.name},</h1>
        <p>Hóa đơn #${currentErp.number}/${currentErp.year} đính kèm.</p>
        <p>Cảm ơn bạn!</p>
      `;
      email.attachment = [
        {
          url: `${process.env.REACT_APP_DOWNLOAD_BASE_URL}/${entity}/${entity}-${id}.pdf`,
          name: `Hóa đơn-${id}.pdf`,
        },
      ];

      console.log('Gửi email với dữ liệu:', email);

      const api = new Brevo.TransactionalEmailsApi();
      const response = await api.sendTransacEmail(email);
      console.log('Kết quả gửi email:', response);
      message.success('Gửi email thành công!');
    } catch (error) {
      console.error('Lỗi gửi email:', error.message, error.response);
      message.error('Lỗi gửi email: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { send, isLoading };
}