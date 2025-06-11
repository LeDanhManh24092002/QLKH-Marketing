import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Branding from '../common/Branding.jsx';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);
      history.replace({ ...location, state: {} });
    }
  }, [location, history]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      history.push('/home', { successMessage: 'Đăng nhập thành công!' });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="container-fluid d-flex align-items-start pt-5">
      <div className="row w-100">
        <Branding />

        {/* Login Form Section */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-75">
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

            <h2 className="mb-4">Đăng Nhập</h2>
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
              <label className="form-label">Mật Khẩu <span className="text-danger">*</span></label>
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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Nhớ Mật Khẩu
                </label>
              </div>
              {/* <Link to="/forgot-password" className="text-primary">
                Quên Mật Khẩu
              </Link> */}
            </div>
            <button
              className="btn w-100 text-white"
              style={{ backgroundColor: '#006666' }}
              onClick={handleLogin}
            >
              Đăng Nhập
            </button>
            <p className="mt-3 text-center">
              Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;