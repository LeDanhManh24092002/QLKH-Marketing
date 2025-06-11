import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
    const [name, setName] = useState("");
    const [balance, setBalance] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [error, setError] = useState("");
    const history = useHistory();
    const menuRef = useRef();

    useEffect(() => {
        if (isAuthenticated) {
            const fetchProfile = async () => {
                try {
                    const res = await axios.get("/api/auth/profile", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    });
                    setName(res.data.name);
                    setBalance(res.data.balance || 0);
                } catch (err) {
                    setError("Không tải được thông tin");
                }
            };
            fetchProfile();
        }
    }, [isAuthenticated]);

    // Tự đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setShowMenu(false);
        history.push("/login");
    };

    useEffect(async () => {
        const res = await axios.get("/api/campaign/transactions", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const curency = res.data.reduce((acc, item) => acc + item.amount, 0);

        setBalance(curency);
    }, []);

    const toggleMenu = () => setShowMenu(!showMenu);

    return (
        <header className="p-3 shadow bg-white">
            <div className="container d-flex justify-content-between align-items-center">
                {/* Logo + Tên trang */}
                <div className="d-flex align-items-center">
                    <img
                        src="/assets/images/logo-icon.png"
                        alt="Logo"
                        className="me-2"
                        style={{ height: "40px" }}
                    />
                    <Link
                        to={isAuthenticated ? "/home" : "/login"}
                        className="text-dark fw-bold fs-5 text-decoration-none"
                    >
                        NEXLIFY
                    </Link>
                </div>

                {/* Nếu đã đăng nhập */}
                {isAuthenticated && (
                    <div
                        className="d-flex align-items-center position-relative"
                        ref={menuRef}
                    >
                        {/* Số dư */}
                        <span className="me-3 text-dark d-none d-md-inline">
                            Số dư: {balance} VND{" "}
                        </span>

                        {/* Avatar */}
                        <img
                            src="https://media.istockphoto.com/id/1337144146/vi/vec-to/vector-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-h%E1%BB%93-s%C6%A1-h%C3%ACnh-%C4%91%E1%BA%A1i-di%E1%BB%87n-m%E1%BA%B7c-%C4%91%E1%BB%8Bnh.jpg?s=612x612&w=0&k=20&c=u24Lv6ta-n_-pQwnru8iwCaFysSloBwVs-LhtqxCSCw="
                            alt="Avatar"
                            className="rounded-circle"
                            style={{
                                cursor: "pointer",
                                width: "40px",
                                height: "40px",
                            }}
                            onClick={toggleMenu}
                        />

                        {/* Dropdown menu */}
                        {showMenu && (
                            <div className="position-absolute top-100 end-0 mt-2 bg-light border rounded shadow z-3">
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <Link
                                            to="/profile/edit"
                                            className="text-decoration-none text-dark"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            Chỉnh sửa thông tin cá nhân
                                        </Link>
                                    </li>
                                    <li className="list-group-item">
                                        <Link
                                            to="/profile/password"
                                            className="text-decoration-none text-dark"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            Đổi mật khẩu
                                        </Link>
                                    </li>
                                    <li
                                        className="list-group-item text-danger"
                                        style={{ cursor: "pointer" }}
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && (
                <div
                    className="position-fixed top-0 end-0 p-3"
                    style={{ zIndex: 1050 }}
                >
                    <div className="toast show" role="alert">
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
                </div>
            )}
        </header>
    );
};

export default Header;
