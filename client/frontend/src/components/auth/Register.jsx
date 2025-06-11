import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import Branding from '../common/Branding.jsx';

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
    address: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post('/api/auth/register', formData);
      setIsAuthenticated(false);
      history.push('/login', { successMessage: 'Đăng ký thành công! Vui lòng đăng nhập.' });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center">
      <div className="row w-100">
        <Branding />

        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-75">
            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
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

            <h2 className="mb-4">Đăng ký</h2>
            <div className="mb-3">
              <label className="form-label">Họ và tên <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Quốc gia <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Nhập quốc gia"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Địa chỉ <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email <span className="text-danger">*</span></label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu <span className="text-danger">*</span></label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <button
              className="btn w-100 text-white"
              style={{ backgroundColor: '#006666' }}
              onClick={handleRegister}
            >
              Đăng ký
            </button>
            <p className="mt-3 text-center">
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;