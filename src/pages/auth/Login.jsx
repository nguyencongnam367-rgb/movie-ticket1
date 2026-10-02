import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/auth.css";
import { login as loginApi } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
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

        if (!form.email || !form.password) {
            setError(
                "Vui lòng nhập email và mật khẩu"
            );
            return;
        }

        try {
            setLoading(true);

            const data = await loginApi(
                form.email,
                form.password
            );

            localStorage.setItem(
                "token",
                data.token
            );

            login(data.user);

            if (data.user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Email hoặc mật khẩu không đúng"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-container">

                <h1>🎬 Đăng nhập</h1>

                <p className="auth-subtitle">
                    Đăng nhập để đặt vé xem phim
                </p>

                {error && (
                    <div className="alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>


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


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Đang đăng nhập..."
                            : "Đăng nhập"}
                    </button>

                </form>

                <div className="auth-footer">

                    <p>
                        Chưa có tài khoản?
                    </p>

                    <Link to="/register">
                        Đăng ký tài khoản
                    </Link>

                </div>

                

            </div>

        </div>
    );
}

export default Login;