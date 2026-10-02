import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiArrowUpRight, FiBarChart2, FiClock, FiCreditCard, FiFilm, FiMapPin, FiMonitor, FiUsers } from "react-icons/fi";

function Dashboard() {
  const [stats, setStats] = useState({ movies: 0, rooms: 0, tickets: 0, revenue: 0 });

  useEffect(() => {
    api.get("/admin/dashboard").then((response) => setStats(response.data)).catch(console.error);
  }, []);

  return (
      <div className="admin-page">
      <div className="admin-header">
        <div>
            <span>QUẢN TRỊ</span>
            <h1>Xin chào, Quản trị viên</h1>
        </div>
      </div>

      <div className="dashboard-stats">
          <div className="stat-card"><FiFilm aria-hidden="true" /><div><p>Phim</p><h2>{stats.movies}</h2></div></div>
          <div className="stat-card"><FiMonitor aria-hidden="true" /><div><p>Phòng chiếu</p><h2>{stats.rooms}</h2></div></div>
          <div className="stat-card"><FiCreditCard aria-hidden="true" /><div><p>Vé đã bán</p><h2>{stats.tickets}</h2></div></div>
          <div className="stat-card"><FiBarChart2 aria-hidden="true" /><div><p>Doanh thu</p><h2>{Number(stats.revenue).toLocaleString("vi-VN")} ₫</h2></div></div>
      </div>

      <div className="admin-menu">
          <h2>Truy cập nhanh</h2>
          <div className="admin-menu-grid">
            <Link to="/admin/movies" className="admin-menu-card"><FiFilm aria-hidden="true" /><span>Phim</span><FiArrowUpRight aria-hidden="true" /></Link>
            <Link to="/admin/cinemas" className="admin-menu-card"><FiMapPin aria-hidden="true" /><span>Rạp chiếu</span><FiArrowUpRight aria-hidden="true" /></Link>
            <Link to="/admin/rooms" className="admin-menu-card"><FiMonitor aria-hidden="true" /><span>Phòng chiếu</span><FiArrowUpRight aria-hidden="true" /></Link>
            <Link to="/admin/showtimes" className="admin-menu-card"><FiClock aria-hidden="true" /><span>Lịch chiếu</span><FiArrowUpRight aria-hidden="true" /></Link>
            <Link to="/admin/users" className="admin-menu-card"><FiUsers aria-hidden="true" /><span>Người dùng</span><FiArrowUpRight aria-hidden="true" /></Link>
            <Link to="/admin/revenue" className="admin-menu-card"><FiBarChart2 aria-hidden="true" /><span>Doanh thu</span><FiArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>

    </div>
  );
}

export default Dashboard;