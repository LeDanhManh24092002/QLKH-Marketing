import { useEffect, useState } from 'react';
import { Tag, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import useLanguage from '@/locale/useLanguage';
import { useMoney } from '@/settings';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useOnFetch from '@/hooks/useOnFetch';
import RecentTable from './components/RecentTable';
import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

const CampaignPreviewCard = ({ isLoading, profit, loss, total, translate }) => {
  const whiteBoxStyle = {
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #f0f2f5, #e6e8eb)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: 'none',
  };

  const getProgressCircle = (percentage, color) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    return (
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#e8ecef"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset="0"
          transform="rotate(-90 60 60)"
        />
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          style={{ fontSize: '24px', fontWeight: 700, fill: color }}
        >
          {percentage.toFixed(1)}%
        </text>
      </svg>
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="whiteBox shadow pad20"
      style={{ ...whiteBoxStyle }}
    >
      <h3 style={{ color: '#1a1a1a', marginBottom: 5, padding: '0 20px 20px', fontWeight: 600, letterSpacing: '0.5px' }}>
        {translate('Tổng Quan Chiến Dịch')}
      </h3>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: 0, color: '#13c2c2' }}>{translate('Lời')}</h4>
              <div style={{ margin: '12px 0' }}>
                {getProgressCircle((profit / total) * 100, '#13c2c2')}
              </div>
              <p style={{ fontSize: '16px', color: '#888', margin: '4px 0' }}>
                {profit}/{total}
              </p>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: 0, color: '#eb2f96' }}>{translate('Lỗ')}</h4>
              <div style={{ margin: '12px 0' }}>
                {getProgressCircle((loss / total) * 100, '#eb2f96')}
              </div>
              <p style={{ fontSize: '16px', color: '#888', margin: '4px 0' }}>
                {loss}/{total}
              </p>
            </div>
          </Col>
        </Row>
      )}
    </motion.div>
  );
};

export default function DashboardModule() {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);

  const [campaignProfit, setCampaignProfit] = useState(0);
  const [campaignLoss, setCampaignLoss] = useState(0);
  const [campaignTotal, setCampaignTotal] = useState(0);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [campaignError, setCampaignError] = useState(null);

  useEffect(() => {
    async function fetchCampaignSummary() {
      try {
        setCampaignLoading(true);
        const response = await request.summary({ entity: 'campaign' });
        console.log('Direct campaign summary fetch:', response);
        setCampaignProfit(response.profit ?? 0);
        setCampaignLoss(response.loss ?? 0);
        setCampaignTotal(response.total ?? 1);
      } catch (error) {
        setCampaignError(error);
        console.error('Failed to fetch campaign summary directly:', error);
      } finally {
        setCampaignLoading(false);
      }
    }

    fetchCampaignSummary();
  }, []);

  const colorMap = {
    invoice: {
      draft: '#91caff',
      pending: '#40a9ff',
      sent: '#69b1ff',
      accepted: '#95de64',
      declined: '#ff7875',
      expired: '#d3adf7',
    },
    quote: {
      draft: '#ffe58f',
      pending: '#faad14',
      sent: '#ffc107',
      accepted: '#ffbb96',
      declined: '#ff4d4f',
      expired: '#ffd8bf',
    },
  };

  const whiteBoxStyle = {
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #ffffff, #f9fafb)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: 'none',
  };

  const tagStyle = {
    borderRadius: '8px',
    padding: '4px 12px',
    fontWeight: 500,
    border: 'none',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    background: '#f5f5f5 !important',
    margin: '4px',
  };

  const summaryCardStyles = {
    invoice: {
      background: '#e6f7ff',
      borderRadius: '12px',
      tagColor: '#1890ff',
    },
    quote: {
      background: '#fff7e6',
      borderRadius: '12px',
      tagColor: '#fa8c16',
    },
    paid: {
      background: '#f0f9eb',
      borderRadius: '12px',
      tagColor: '#52c41a',
    },
    unpaid: {
      background: '#fef0f0',
      borderRadius: '12px',
      tagColor: '#ff4d4f',
    },
    profit: {
      background: '#e6fffb',
      borderRadius: '12px',
      tagColor: '#13c2c2',
    },
    loss: {
      background: '#fff0f6',
      borderRadius: '12px',
      tagColor: '#eb2f96',
    },
  };

  const getStatsData = async ({ entity, currency }) => {
    return await request.summary({
      entity,
      options: { currency },
    });
  };

  const {
    result: invoiceResult,
    isLoading: invoiceLoading,
    onFetch: fetchInvoicesStats,
  } = useOnFetch();

  const { result: quoteResult, isLoading: quoteLoading, onFetch: fetchQuotesStats } = useOnFetch();

  const {
    result: paymentResult,
    isLoading: paymentLoading,
    onFetch: fetchPaymentsStats,
  } = useOnFetch();

  const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
    request.summary({ entity: 'client' })
  );

  const { result: campaignSummaryResult, isLoading: campaignSummaryLoading, error: campaignSummaryError } = useFetch(() => {
    console.log('Fetching campaign summary from /api/campaign/summary');
    return request.summary({ entity: 'campaign' });
  });

  useEffect(() => {
    const currency = money_format_settings.default_currency_code || null;

    if (currency) {
      fetchInvoicesStats(getStatsData({ entity: 'invoice', currency }));
      fetchQuotesStats(getStatsData({ entity: 'quote', currency }));
      fetchPaymentsStats(getStatsData({ entity: 'payment', currency }));
    }
  }, [money_format_settings.default_currency_code]);

  useEffect(() => {
    console.log('Campaign summary result:', campaignSummaryResult);
    console.log('Campaign summary loading:', campaignSummaryLoading);
    console.log('Campaign summary error:', campaignSummaryError);
    if (campaignSummaryError) {
      console.error('Failed to fetch campaign summary:', campaignSummaryError);
    }
  }, [campaignSummaryResult, campaignSummaryLoading, campaignSummaryError]);

  const dataTableColumns = [
    {
      title: translate('Số'),
      dataIndex: 'number',
    },
    {
      title: translate('Khách Hàng'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('Tổng Cộng'),
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Trạng Thái'),
      dataIndex: 'status',
    },
  ];

  const entityData = [
    {
      result: invoiceResult,
      isLoading: invoiceLoading,
      entity: 'invoice',
      title: translate('Hóa Đơn'),
    },
    {
      result: quoteResult,
      isLoading: quoteLoading,
      entity: 'quote',
      title: translate('Báo Giá'),
    },
  ];

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading, title } = data;
    return (
      <PreviewCard
        key={index}
        title={title}
        isLoading={isLoading}
        entity={entity}
        statistics={
          !isLoading &&
          result?.performance?.map((item) => {
            const status = item?.status?.toLowerCase();
            return {
              tag: item?.status,
              color: '#ffffff',
              background: colorMap[entity][status] || '#1890ff',
              value: item?.percentage,
            };
          })
        }
        tagStyle={tagStyle}
      />
    );
  });

  if (money_format_settings) {
    return (
      <>
        <Row gutter={[16, 16]} wrap={false}>
          <Col style={{ width: '23.92%', ...summaryCardStyles.invoice, marginRight: '16px' }}>
            <SummaryCard
              title={translate('Hóa Đơn')}
              prefix={translate('Tháng Này')}
              isLoading={invoiceLoading}
              data={invoiceResult?.total ?? 0}
              style={summaryCardStyles.invoice}
              tagColor={summaryCardStyles.invoice.tagColor}
            />
          </Col>
          <Col style={{ width: '23.92%', ...summaryCardStyles.quote, marginRight: '16px' }}>
            <SummaryCard
              title={translate('Báo Giá')}
              prefix={translate('Tháng Này')}
              isLoading={quoteLoading}
              data={quoteResult?.total ?? 0}
              style={summaryCardStyles.quote}
              tagColor={summaryCardStyles.quote.tagColor}
            />
          </Col>
          <Col style={{ width: '23.92%', ...summaryCardStyles.paid, marginRight: '16px' }}>
            <SummaryCard
              title={translate('Đã Thanh Toán')}
              prefix={translate('Tháng Này')}
              isLoading={paymentLoading}
              data={paymentResult?.total ?? 0}
              style={summaryCardStyles.paid}
              tagColor={summaryCardStyles.paid.tagColor}
            />
          </Col>
          <Col style={{ width: '23.92%', ...summaryCardStyles.unpaid }}>
            <SummaryCard
              title={translate('Chưa Thanh Toán')}
              prefix={translate('Không Thanh Toán')}
              isLoading={invoiceLoading}
              data={invoiceResult?.total_undue ?? 0}
              style={summaryCardStyles.unpaid}
              tagColor={summaryCardStyles.unpaid.tagColor}
            />
          </Col>
        </Row>
        <div className="space30"></div>
        <Row gutter={[32, 32]}>
          <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="whiteBox shadow"
              style={{ ...whiteBoxStyle, height: 458 }}
            >
              <Row className="pad20" gutter={[0, 0]}>
                {statisticCards}
              </Row>
            </motion.div>
          </Col>
          <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
            <CustomerPreviewCard
              isLoading={clientLoading}
              activeCustomer={clientResult?.active ?? 0}
              newCustomer={clientResult?.new ?? 0}
            />
          </Col>
        </Row>
        <div className="space30"></div>
        <Row gutter={[16, 16]}>
          <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
            <CampaignPreviewCard
              isLoading={campaignLoading}
              profit={campaignProfit}
              loss={campaignLoss}
              total={campaignTotal}
              translate={translate}
            />
          </Col>
        </Row>
        <div className="space30"></div>
        <Row gutter={[32, 32]}>
          <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="whiteBox shadow pad20"
              style={whiteBoxStyle}
            >
              <h3 style={{ color: '#1a1a1a', marginBottom: 5, padding: '0 20px 20px', fontWeight: 600, letterSpacing: '0.5px' }}>
                {translate('Hóa Đơn Gần Đây')}
              </h3>
              <RecentTable
                entity={'invoice'}
                dataTableColumns={dataTableColumns}
                colorMap={colorMap}
                tagStyle={tagStyle}
              />
            </motion.div>
          </Col>
          <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="whiteBox shadow pad20"
              style={whiteBoxStyle}
            >
              <h3 style={{ color: '#1a1a1a', marginBottom: 5, padding: '0 20px 20px', fontWeight: 600, letterSpacing: '0.5px' }}>
                {translate('Báo Giá Gần Đây')}
              </h3>
              <RecentTable
                entity={'quote'}
                dataTableColumns={dataTableColumns}
                colorMap={colorMap}
                tagStyle={tagStyle}
              />
            </motion.div>
          </Col>
        </Row>
      </>
    );
  } else {
    return <></>;
  }
}