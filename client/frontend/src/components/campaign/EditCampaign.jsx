import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const EditCampaign = () => {
  const { id } = useParams();
  const history = useHistory();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/api/campaign/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const { name, description, startDate, endDate, budget } = res.data;
        setFormData({
          name,
          description,
          startDate: startDate ? startDate.slice(0, 10) : '',
          endDate: endDate ? endDate.slice(0, 10) : '',
          budget,
        });
      } catch (err) {
        setError('Không thể tải dữ liệu chiến dịch');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`/api/campaign/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Cập nhật chiến dịch thành công');
      setTimeout(() => history.push('/home'), 2000);
    } catch (err) {
      setError('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Back button handler
  const handleBack = () => {
    history.goBack(); // Go back to the previous page
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="text-center">Cập nhật chiến dịch</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Back Button */}
      <button className="btn btn-secondary mb-4" onClick={handleBack}>
        <i className="bi bi-arrow-left"></i> Quay lại
      </button>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Tên chiến dịch</label>
          <input
            id="name"
            type="text"
            className="form-control rounded-pill"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Mô tả</label>
          <textarea
            id="description"
            className="form-control rounded-pill"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            rows={3}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Ngày bắt đầu</label>
          <input
            id="startDate"
            type="date"
            className="form-control rounded-pill"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">Ngày kết thúc</label>
          <input
            id="endDate"
            type="date"
            className="form-control rounded-pill"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="budget" className="form-label">Ngân sách (VND)</label>
          <input
            id="budget"
            type="number"
            className="form-control rounded-pill"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            min="0"
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-success rounded-pill" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
      </form>
    </div>
  );
};

export default EditCampaign;