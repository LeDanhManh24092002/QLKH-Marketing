import { UploadOutlined } from '@ant-design/icons';
import { message, Upload, Form, Button } from 'antd';
import useLanguage from '@/locale/useLanguage';

// import photo from '@/style/images/photo.png';

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Hình ảnh phải nhỏ hơn 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
export default function UploadImg() {
  const translate = useLanguage();
  return (
    <Form.Item
      name="file"
      label={translate('Tải lên hình ảnh')}
      valuePropName="fileList"
      getValueFromEvent={(e) => e.fileList}
    >
      <Upload beforeUpload={beforeUpload}>
        <Button icon={<UploadOutlined />}>Nhấn để tải lên</Button>
      </Upload>
    </Form.Item>
  );
}