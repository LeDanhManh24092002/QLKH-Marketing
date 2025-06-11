import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const MyCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const fetchMyCampaigns = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axios.get("/api/campaign/list", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setCampaigns(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Không thể tải danh sách chiến dịch");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyCampaigns();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.post(
                "/api/campaign/cancel-campaign",
                { campaignId: id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setSuccess("Hủy chiến dịch thành công");
            fetchMyCampaigns();
        } catch (err) {
            setError(err.response?.data?.message || "Hủy chiến dịch thất bại");
        }
    };

    const handlePay = async (id) => {
        try {
            await axios.post(
                "/api/campaign/pay-campaign",
                { campaignId: id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setSuccess("Thanh toán thành công");
            fetchMyCampaigns();
        } catch (err) {
            setError(err.response?.data?.message || "Thanh toán thất bại");
        }
    };

    const handleBack = () => history.push("/");

    const getStatusColor = (status) => {
        switch ((status || "").toLowerCase()) {
            case "active":
                return "#28a745";
            case "pending":
                return "#ffc107";
            case "completed":
                return "#dc3545";
            default:
                return "#6c757d";
        }
    };

    return (
        <div className="container my-5">
            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                {error && (
                    <div className="toast show bg-danger text-white" role="alert">
                        <div className="toast-header">
                            <strong className="me-auto">Lỗi</strong>
                            <button className="btn-close" onClick={() => setError("")}></button>
                        </div>
                        <div className="toast-body">{error}</div>
                    </div>
                )}
                {success && (
                    <div className="toast show bg-success text-white" role="alert">
                        <div className="toast-header">
                            <strong className="me-auto">Thành công</strong>
                            <button className="btn-close" onClick={() => setSuccess("")}></button>
                        </div>
                        <div className="toast-body">{success}</div>
                    </div>
                )}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: "#006666", fontWeight: "bold" }}>Chiến dịch của tôi</h2>
                <button className="btn btn-secondary btn-sm" onClick={handleBack}>
                    <i className="bi bi-arrow-left"></i> Quay lại
                </button>
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status" style={{ color: "#006666" }}>
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            ) : campaigns.length === 0 ? (
                <p className="text-center" style={{ color: "#006666" }}>
                    Bạn chưa đăng ký chiến dịch nào.
                </p>
            ) : (
                <div className="row">
                    {campaigns.map((uc) => (
                        <div key={uc._id} className="col-md-4 mb-4">
                            <div className="card shadow-sm h-100 border-1" style={{ borderColor: "#006666" }}>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h5 className="card-title" style={{ color: "#006666" }}>
                                            {uc.name || "Chưa có tên"}
                                        </h5>
                                        <p className="card-text">
                                            <strong>Ngân sách:</strong> {uc.budget}
                                        </p>
                                        <p className="card-text">
                                            <strong>Ngày đăng ký:</strong>{" "}
                                            {new Date(uc.created).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                    <div
                                        className="status-bar mb-3"
                                        style={{
                                            height: "8px",
                                            backgroundColor: getStatusColor(uc.status),
                                            borderRadius: "4px",
                                        }}
                                        title={`Trạng thái: ${uc.status}`}
                                    ></div>

                                    <div className="d-flex justify-content-end gap-2 flex-wrap">
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handlePay(uc._id)}
                                        >
                                            <i className="bi bi-wallet2"></i> Thanh toán
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(uc._id)}
                                        >
                                            <i className="bi bi-trash"></i> Hủy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCampaigns;
