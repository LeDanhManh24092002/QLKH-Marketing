import { Statistic, Progress, Divider, Row, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { motion } from 'framer-motion';

export default function CustomerPreviewCard({
  isLoading = false,
  activeCustomer = 0,
  newCustomer = 0,
}) {
  const translate = useLanguage();

  return (
    <Row className="gutter-row">
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{
          height: 460,
          borderRadius: 12,
          background: 'linear-gradient(145deg, #ffffff, #f9fafb)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            padding: 20,
          }}
        >
          <h3
            style={{
              color: '#1a1a1a',
              marginBottom: 30,
              marginTop: 20,
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            {translate('Khách Hàng')}
          </h3>

          {isLoading ? (
            <Spin size="large" />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'space-between',
              }}
            >
              <Progress
                type="dashboard"
                percent={newCustomer}
                size={160}
                strokeColor={{ '0%': '#6366f1', '100%': '#a855f7' }}
                trailColor="#e5e7eb"
                format={(percent) => (
                  <span style={{ color: '#1a1a1a', fontSize: 24, fontWeight: 600 }}>
                    {percent}%
                  </span>
                )}
              />
              <p
                style={{
                  color: '#4b5563',
                  fontSize: 14,
                  marginTop: 12,
                  fontWeight: 400,
                }}
              >
                {translate('Khách Hàng Mới Trong Tháng Này')}
              </p>
              <Divider style={{ margin: '20px 0', borderColor: '#e5e7eb', width: '50%' }} />
              <Statistic
                title={
                  <span style={{ color: '#4b5563', fontSize: 14, fontWeight: 500 }}>
                    {translate('Khách Hàng Hoạt Động')}
                  </span>
                }
                value={activeCustomer}
                precision={2}
                valueStyle={{
                  color: activeCustomer > 0 ? '#22c55e' : activeCustomer < 0 ? '#ef4444' : '#1a1a1a',
                  fontSize: 28,
                  fontWeight: 600,
                }}
                prefix={
                  activeCustomer > 0 ? (
                    <ArrowUpOutlined style={{ color: '#22c55e' }} />
                  ) : activeCustomer < 0 ? (
                    <ArrowDownOutlined style={{ color: '#ef4444' }} />
                  ) : null
                }
                suffix="%"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </Row>
  );
}