import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const loadTickets = async () => {
      if (!user?.id) {
        setError("Vui lòng đăng nhập để xem vé.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/bookings/user/${user.id}`);
        setTickets(response.data.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Không thể tải danh sách vé");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [user?.id]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Vé của tôi</h1>
        <p>Tất cả vé bạn đã đặt</p>
      </div>

      {loading && <div className="empty-state"><h2>Đang tải vé...</h2></div>}
      {!loading && error && <div className="empty-state"><h2>{error}</h2></div>}
      {!loading && !error && tickets.length === 0 && (
        <div className="empty-state">
          <h2>Bạn chưa có vé nào</h2>
          <button className="continue-button" onClick={() => navigate("/showtimes")}>
            Xem lịch chiếu
          </button>
        </div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <article className="ticket-card" key={ticket.booking_id}>
              <div>
                <h2>{ticket.movie_title}</h2>
                <p><strong>Mã vé:</strong> {ticket.booking_code}</p>
                <p><strong>Ghế:</strong> {ticket.seats}</p>
                <p><strong>Ngày:</strong> {new Date(ticket.show_date).toLocaleDateString("vi-VN")}</p>
                <p><strong>Thời gian:</strong> {ticket.start_time} - {ticket.end_time}</p>
                <p><strong>Rạp:</strong> {ticket.cinema_name}, {ticket.room_name}</p>
                <p><strong>Tổng tiền:</strong> {Number(ticket.total_amount).toLocaleString("vi-VN")}đ</p>
              </div>
              <button className="continue-button" onClick={() => navigate(`/ticket/${ticket.booking_id}`)}>
                Xem vé
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTickets;
