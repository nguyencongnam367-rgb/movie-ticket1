import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Ticket() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        setTicket(response.data.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Không thể tải thông tin vé");
      }
    };

    loadTicket();
  }, [id]);

  if (error) {
    return (
      <div className="page-container">
        <div className="ticket">
          <h2>{error}</h2>
          <button className="continue-button" onClick={() => navigate("/my-tickets")}>
            Đến vé của tôi
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return <div className="page-container"><div className="ticket"><h2>Đang tải vé...</h2></div></div>;
  }

  return (
    <div className="page-container">
      <div className="ticket">
        {location.state?.bookingSuccess && (
          <div className="booking-success" role="status">
            Đặt vé thành công! Vé của bạn đã được xác nhận.
          </div>
        )}
        <h1>Vé xem phim</h1>
        <div className="ticket-qr">{ticket.bookingCode}</div>
        <div className="ticket-info">
          <p><strong>Mã vé:</strong> {ticket.bookingCode}</p>
          <p><strong>Tên phim:</strong> {ticket.movieTitle}</p>
          <p><strong>Rạp:</strong> {ticket.cinemaName}</p>
          <p><strong>Phòng:</strong> {ticket.roomName}</p>
          <p><strong>Số ghế:</strong> {ticket.seats?.join(", ")}</p>
          <p><strong>Ngày chiếu:</strong> {new Date(ticket.showDate).toLocaleDateString("vi-VN")}</p>
          <p><strong>Thời gian:</strong> {ticket.startTime} - {ticket.endTime}</p>
          <p><strong>Tổng tiền:</strong> {Number(ticket.totalPrice).toLocaleString("vi-VN")}đ</p>
          <p><strong>Thanh toán:</strong> {ticket.paymentMethod === "MOMO" ? "Ví điện tử" : "Chuyển khoản"}</p>
          <p><strong>Trạng thái:</strong> {ticket.status}</p>
        </div>
        <button className="continue-button" onClick={() => navigate("/my-tickets")}>
          Đến vé của tôi
        </button>
      </div>
    </div>
  );
}

export default Ticket;
