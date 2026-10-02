import { Link } from "react-router-dom";
import { FiFilm } from "react-icons/fi";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Link to="/" className="footer-brand"><FiFilm aria-hidden="true" /><span>Rạp chiếu phim Bách Khoa</span></Link>
        <nav className="footer-links" aria-label="Liên kết cuối trang">
          <Link to="/">Trang chủ</Link>
          <Link to="/movies">Phim</Link>
          <Link to="/showtimes">Lịch chiếu</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Rạp chiếu phim Bách Khoa
      </div>
    </footer>
  );
}

export default Footer;