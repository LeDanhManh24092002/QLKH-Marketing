import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentItem } from '@/redux/erp/selectors';
import { message } from 'antd';
import emailjs from '@emailjs/browser';
import { useMoney } from '@/settings';

export default function useMail({ entity }) {
  const [isLoading, setIsLoading] = useState(false);
  const { result: currentErp } = useSelector(selectCurrentItem);
  const { moneyFormatter } = useMoney();

  const send = async (id) => {
    setIsLoading(true);
    try {
      console.log('Dữ liệu ERP:', currentErp);
      console.log('Email khách hàng:', currentErp?.client?.email);
      console.log('ID hóa đơn:', id);

      if (!currentErp || currentErp._id !== id || !currentErp.client?.email) {
        throw new Error('Email khách hàng không hợp lệ hoặc dữ liệu không đầy đủ');
      }

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      console.log('EmailJS Config:', { serviceId, templateId, publicKey });

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Cấu hình EmailJS không đầy đủ trong .env');
      }

      const itemsHtml = currentErp.items
        ?.map(
          (item) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">
                <strong>${item.itemName}</strong><br>${item.description || ''}
              </td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">
                ${moneyFormatter({ amount: item.price, currency_code: currentErp.currency })}
              </td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">
                ${item.quantity}
              </td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">
                ${moneyFormatter({ amount: item.total, currency_code: currentErp.currency })}
              </td>
            </tr>
          `
        )
        .join('');

      const templateParams = {
        client_name: currentErp.client.name || 'Khách hàng',
        invoice_number: currentErp.number,
        invoice_year: currentErp.year,
        to_email: currentErp.client.email,
        client_email: currentErp.client.email,
        client_address: currentErp.client.address || '',
        client_phone: currentErp.client.phone || '',
        items_html: itemsHtml || '<tr><td colspan="4">Không có sản phẩm</td></tr>',
        sub_total: moneyFormatter({ amount: currentErp.subTotal, currency_code: currentErp.currency }),
        tax_rate: currentErp.taxRate || 0,
        tax_total: moneyFormatter({ amount: currentErp.taxTotal, currency_code: currentErp.currency }),
        total: moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency }),
        credit: moneyFormatter({ amount: currentErp.credit, currency_code: currentErp.currency }),
        invoice_url: `${import.meta.env.VITE_DOWNLOAD_BASE_URL}${entity}-${id}.pdf`,
      };

      console.log('Template params:', templateParams);

      const response = await emailjs.send(serviceId, templateId, templateParams, {
        publicKey: publicKey,
      });

      console.log('Kết quả từ EmailJS:', response);
      message.success('Gửi email thành công!');
    } catch (error) {
      console.error('Lỗi gửi email:', error, error.text, error.response);
      message.error('Lỗi gửi email: ' + (error.text || error.message || 'Không xác định'));
    } finally {
      setIsLoading(false);
    }
  };

  return { send, isLoading };
}