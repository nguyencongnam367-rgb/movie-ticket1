import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !form.name ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (form.password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/register", {
                name: form.name,
                email: form.email,
                password: form.password,
            });

            setSuccess(response.data.message);

            setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Đăng ký thất bại"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-container">

                <h1>🎬 Đăng ký tài khoản</h1>

                <p className="auth-subtitle">
                    Tạo tài khoản để đặt vé xem phim
                </p>

                {error && (
                    <div className="alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Họ và tên</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Nhập họ và tên"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Nhập email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>

                </form>

                <div className="auth-footer">

                    <p>
                        Đã có tài khoản?
                    </p>

                    <Link to="/login">
                        Đăng nhập
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;