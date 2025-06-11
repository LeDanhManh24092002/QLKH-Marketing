import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

const Deposit = () => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'vnpay',
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const successMsg = query.get('success');
    const errorMsg = query.get('error');
    if (successMsg) {
      setSuccess(successMsg);
      history.push('/home', { successMessage: successMsg });
    }
    if (errorMsg) setError(errorMsg);
  }, [location, history]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setQrCodeUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (formData.paymentMethod === 'vnpay') {
        const res = await axios.post('/api/campaign/vnpay', { amount: parseInt(formData.amount) }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        window.location.href = res.data.paymentUrl;
      } else if (formData.paymentMethod === 'bank_qr') {
        const res = await axios.post('/api/campaign/bank_qr', { amount: parseInt(formData.amount) }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setQrCodeUrl(res.data.qrCodeUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Nạp tiền thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBankQR = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/campaign/bank_qr_confirm', {
        amount: parseInt(formData.amount),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess(res.data.message);
      history.push('/home', { successMessage: `Nạp ${formData.amount} VND thành công qua QR ngân hàng` });
    } catch (err) {
      setError(err.response?.data?.message || 'Xác nhận nạp tiền thất bại');
    } finally {
      setLoading(false);
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

      <h2 className="mb-4 text-center" style={{ color: '#006666', fontWeight: 'bold' }}>Nạp tiền</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm" style={{ border: '1px solid #006666' }}>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#006666' }}>Số tiền (VND)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#006666' }}>Phương thức thanh toán</label>
                  <select
                    className="form-select"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="bank_qr">QR Ngân hàng</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn w-100 text-white"
                  style={{ backgroundColor: '#006666' }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : formData.paymentMethod === 'vnpay' ? (
                    'Tạo thanh toán VNPay'
                  ) : (
                    'Tạo mã QR Ngân hàng'
                  )}
                </button>
              </form>
              {qrCodeUrl && (
                <div className="mt-4 text-center">
                  <h5 style={{ color: '#006666' }}>Quét mã QR để nạp tiền</h5>
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="img-fluid qr-code"
                    style={{ maxWidth: '200px', border: '1px solid #006666', borderRadius: '4px' }}
                  />
                  <p className="mt-2" style={{ color: '#006666' }}>
                    Sử dụng ứng dụng ngân hàng để quét mã QR và chuyển khoản.
                  </p>
                  <button
                    className="btn w-100 text-white"
                    style={{ backgroundColor: '#006666' }}
                    onClick={handleConfirmBankQR}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      'Xác nhận đã thanh toán'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;