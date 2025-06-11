import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const CreateCampaign = () => {
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await axios.post(
                "http://localhost:8888/api/campaign/create",
                { name, budget: Number(budget) }, // ép kiểu số cho budget
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            history.push("/home");
        } catch (err) {
            setError("Không thể tạo chiến dịch. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5" style={{ maxWidth: "600px" }}>
            <h2>Thêm Chiến Dịch</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="campaignName" className="form-label">
                        Tên chiến dịch
                    </label>
                    <input
                        id="campaignName"
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="campaignBudget" className="form-label">
                        Ngân sách (VND)
                    </label>
                    <input
                        id="campaignBudget"
                        type="number"
                        className="form-control"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        required
                        min="0"
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                >
                    {loading ? "Đang tạo..." : "Tạo"}
                </button>
            </form>
        </div>
    );
};

export default CreateCampaign;
