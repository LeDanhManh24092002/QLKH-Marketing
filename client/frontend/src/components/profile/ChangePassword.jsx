import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/campaign/password', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess(res.data.message);
      history.push('/home', { successMessage: 'Đổi mật khẩu thành công' });
    } catch (err) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  return (
    <div className="container mt-5">
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

      <h2>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Mật khẩu cũ</label>
          <input
            type="password"
            className="form-control"
            name="oldPassword"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;