import { Link, useNavigate } from "react-router-dom";
import { FiFilm } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          <FiFilm aria-hidden="true" />
          <span>Rạp chiếu phim Bách Khoa</span>
        </Link>

        <nav className="nav-menu">
          <Link to="/">Trang chủ</Link>

          <Link to="/movies">
            Phim
          </Link>

          <Link to="/showtimes">
            Lịch chiếu
          </Link>

          {user?.role === "CUSTOMER" && (
            <Link to="/my-tickets">
              Vé của tôi
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link to="/admin">
              Quản trị
            </Link>
          )}
        </nav>

        <div className="nav-user">

          {!user && (
            <>
              <Link
                to="/login"
                className="btn-login"
              >
                Đăng nhập
              </Link>

              <Link
                to="/register"
                className="btn-register"
              >
                Đăng ký
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="welcome">
                {user.role === "ADMIN" ? "Quản trị viên" : user.name}
              </span>

              <button
                onClick={handleLogout}
                className="btn-logout"
              >
                Đăng xuất
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;