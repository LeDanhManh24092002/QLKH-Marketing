import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/campaign/transactions", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setTransactions(res.data);
            } catch (err) {
                setError("Không tải được lịch sử giao dịch");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div className="container my-5">
            <div
                className="position-fixed top-0 end-0 p-3"
                style={{ zIndex: 1050 }}
            >
                {error && (
                    <div
                        className="toast show"
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                    >
                        <div className="toast-header bg-danger text-white">
                            <strong className="me-auto">Lỗi</strong>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setError("")}
                            ></button>
                        </div>
                        <div className="toast-body">{error}</div>
                    </div>
                )}
            </div>

            <h2
                className="mb-4"
                style={{ color: "#006666", fontWeight: "bold" }}
            >
                Lịch sử giao dịch
            </h2>
            {loading ? (
                <div className="text-center">
                    <div
                        className="spinner-border"
                        style={{ color: "#006666" }}
                        role="status"
                    >
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            ) : transactions.length === 0 ? (
                <p className="text-center" style={{ color: "#006666" }}>
                    Bạn chưa có giao dịch nào.
                </p>
            ) : (
                <div className="row">
                    {transactions.map((tx) => (
                        <div key={tx._id} className="col-md-4 mb-4">
                            <div
                                className="card shadow-sm h-100"
                                style={{
                                    border: "1px solid #006666",
                                    backgroundColor:
                                        tx.status.toLowerCase() === "completed"
                                            ? "#28a745"
                                            : "inherit",
                                    color:
                                        tx.status.toLowerCase() === "completed"
                                            ? "#ffffff"
                                            : "inherit",
                                }}
                            >
                                <div
                                    className="card-body d-flex flex-column justify-content-between"
                                    style={{ minHeight: "200px" }}
                                >
                                    <div>
                                        <p className="card-text">
                                            <strong>Số tiền:</strong>{" "}
                                            {tx.amount.toLocaleString()} VND
                                        </p>
                                        <p className="card-text">
                                            <strong>Phương thức:</strong>{" "}
                                            {tx.paymentMethod}
                                        </p>
                                        <p className="card-text">
                                            <strong>Trạng thái:</strong>{" "}
                                            {tx.status}
                                        </p>
                                        <p className="card-text">
                                            <strong>Ngày:</strong>{" "}
                                            {new Date(
                                                tx.createdAt
                                            ).toLocaleDateString()}
                                        </p>
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

export default TransactionHistory;
