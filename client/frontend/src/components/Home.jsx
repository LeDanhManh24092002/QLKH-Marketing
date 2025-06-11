import React, { useState, useEffect } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const fetchProfile = async (retries = 3) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập lại');
          history.push('/login');
          return;
        }
        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
        setBalance(res.data.balance || 0);
      } catch (err) {
        if (retries > 0 && err.code === 'ERR_NAME_NOT_RESOLVED') {
          setTimeout(() => fetchProfile(retries - 1), 1000);
        } else {
          setError('Không tải được hồ sơ');
        }
      }
    };

    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('/api/campaign/list');
        setCampaigns(res.data);
      } catch (err) {
        setError('Không tải được chiến dịch');
      }
    };

    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);
      fetchProfile();
    } else {
      fetchProfile();
    }

    fetchCampaigns();
  }, [location.state?.successMessage, history]);

  const handleRegisterCampaign = async () => {
    try {
      const res = await axios.post(
        '/api/campaign/register',
        { campaignId: selectedCampaignId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess(res.data.message);
      setShowConfirmModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký chiến dịch thất bại');
      setShowConfirmModal(false);
    }
  };

  const handleOpenConfirmModal = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedCampaignId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'completed':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="container my-5">
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {success && (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Thông báo</strong>
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
            <div className="toast-body">{success}</div>
          </div>
        )}
        {error && (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-danger text-white">
              <strong className="me-auto">Lỗi</strong>
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
            <div className="toast-body">{error}</div>
          </div>
        )}
      </div>

      <button
        className="position-fixed bottom-0 end-0 m-3 p-3"
        style={{
          backgroundColor: '#dc3545',
          border: 'none',
          borderRadius: '50%',
          zIndex: 1050,
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        }}
        onClick={handleLogout}
        title="Đăng xuất"
      >
        <i className="bi bi-box-arrow-right" style={{ fontSize: '1.5rem', color: '#ffffff' }}></i>
      </button>

      <h2 className="text-center mb-5" style={{ color: '#006666', fontWeight: 'bold' }}>
        Xin chào, {name || 'Đang tải...'}!
      </h2>

      <div className="row justify-content-center mb-5">
        <div className="col-md-4 mb-4">
          <Link to="/campaigns/my" className="text-decoration-none">
            <div className="card text-center shadow-sm h-100" style={{ border: '1px solid #006666', transition: 'transform 0.3s' }}>
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <i className="bi bi-collection-fill" style={{ fontSize: '4rem', color: '#006666' }}></i>
                <h5 className="card-title mt-3" style={{ color: '#006666' }}>Chiến dịch của tôi</h5>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/transactions" className="text-decoration-none">
            <div className="card text-center shadow-sm h-100" style={{ border: '1px solid #006666', transition: 'transform 0.3s' }}>
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <i className="bi bi-clock-history" style={{ fontSize: '4rem', color: '#006666' }}></i>
                <h5 className="card-title mt-3" style={{ color: '#006666' }}>Lịch sử giao dịch</h5>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/deposit" className="text-decoration-none">
            <div className="card text-center shadow-sm h-100" style={{ border: '1px solid #006666', transition: 'transform 0.3s' }}>
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <i className="bi bi-wallet2" style={{ fontSize: '4rem', color: '#006666' }}></i>
                <h5 className="card-title mt-3" style={{ color: '#006666' }}>Nạp tiền</h5>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <h3 className="mb-4" style={{ color: '#006666', fontWeight: 'bold' }}>Chiến dịch sẵn có</h3>
      <div className="row">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="col-md-4 mb-4">
            <div className="card shadow-sm h-100" style={{ border: '1px solid #006666' }}>
              <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: '350px' }}>
                <div>
                  <h5 className="card-title" style={{ color: '#006666' }}>{campaign.name}</h5>
                  <p className="card-text">{campaign.description}</p>
                  <p className="card-text"><strong>Bắt đầu:</strong> {new Date(campaign.startDate).toLocaleDateString()}</p>
                  <p className="card-text"><strong>Kết thúc:</strong> {new Date(campaign.endDate).toLocaleDateString()}</p>
                  <p className="card-text"><strong>Ngân sách:</strong> {campaign.budget.toLocaleString()} VND</p>
                </div>
                <div>
                  <div
                    className="status-bar mb-3"
                    style={{
                      height: '8px',
                      backgroundColor: getStatusColor(campaign.status),
                      borderRadius: '4px',
                    }}
                  ></div>
                  <p className="card-text"><strong>Trạng thái:</strong> {campaign.status}</p>
                  <button
                    className="btn w-100 text-white"
                    style={{ backgroundColor: '#006666' }}
                    onClick={() => handleOpenConfirmModal(campaign._id)}
                  >
                    Đăng ký chiến dịch
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showConfirmModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: '#006666' }}>
                  Xác nhận đăng ký chiến dịch
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseConfirmModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn đăng ký chiến dịch này?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseConfirmModal}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  style={{ backgroundColor: '#006666' }}
                  onClick={handleRegisterCampaign}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;