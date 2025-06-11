import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const DeleteCampaign = () => {
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chiến dịch này?')) return;

    setLoading(true);
    setError('');
    try {
      await axios.delete(`/api/campaign/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      history.push('/home');
    } catch (err) {
      setError('Xóa chiến dịch thất bại. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2>Xóa chiến dịch</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <p>Bạn có chắc chắn muốn xóa chiến dịch này không?</p>

      <button
        className="btn btn-danger me-2"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? 'Đang xóa...' : 'Xóa'}
      </button>

      <button className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
        Hủy
      </button>
    </div>
  );
};

export default DeleteCampaign;
