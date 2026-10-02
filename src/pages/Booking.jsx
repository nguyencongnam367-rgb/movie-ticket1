import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import api from "../services/api";

function Booking() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatPrice = 90000;

  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeats = async () => {
      try {
        const response = await api.get(`/showtimes/${showtimeId}/seats`);
        setSeats(response.data);
      } catch (error) {
        alert("Không thể tải sơ đồ ghế.");
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [showtimeId]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((currentSeats) => {
      if (currentSeats.includes(seatId)) {
        return currentSeats.filter(
          (seat) => seat !== seatId
        );
      }

      return [...currentSeats, seatId];
    });
  };

  const totalPrice =
    selectedSeats.length * seatPrice;

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế.");
      return;
    }

    navigate(`/checkout/${showtimeId}`, {
      state: {
        seatIds: selectedSeats,
        totalPrice: totalPrice,
      },
    });
  };

  return (
    <div className="page-container">

      <div className="page-header">

        <h1>Chọn ghế</h1>

        <p>
          Suất chiếu #{showtimeId}
        </p>

      </div>

      <div className="seat-placeholder">

        <div className="screen">
          MÀN HÌNH
        </div>

        <p className="screen-label">
          Màn hình
        </p>

        {loading ? <p>Đang tải sơ đồ ghế...</p> : <div className="seat-demo">

          {seats.map((seat) => {

            const isSelected = selectedSeats.includes(seat.id);

            return (
              <button
                key={seat.id}
                type="button"
                className={`seat ${isSelected ? "selected" : ""} ${seat.is_booked ? "sold" : ""}`}
                onClick={() =>
                  toggleSeat(seat.id)
                }
                disabled={seat.is_booked}
              >
                {seat.seat_code}
              </button>
            );
          })}

        </div>}

        <div className="seat-legend">

          <div className="legend-item">
            <span className="legend-box empty"></span>
            Ghế trống
          </div>

          <div className="legend-item">
            <span className="legend-box selected"></span>
            Ghế đang chọn
          </div>

          <div className="legend-item">
            <span className="legend-box sold"></span>
            Ghế đã bán
          </div>

        </div>

        <div className="booking-summary">

          <h3>
            Thông tin đặt vé
          </h3>

          <p>
            Ghế đã chọn:{" "}

            {selectedSeats.length > 0
              ? seats.filter((seat) => selectedSeats.includes(seat.id)).map((seat) => seat.seat_code).join(", ")
              : "Chưa chọn ghế"}
          </p>

          <p>
            Số lượng:{" "}
            <strong>
              {selectedSeats.length}
            </strong>
          </p>

          <p>
            Tổng tiền:{" "}
            <strong>
              {totalPrice.toLocaleString("vi-VN")}đ
            </strong>
          </p>

          <button
            className="continue-button"
            onClick={handleContinue}
          >
            Tiếp tục
          </button>

        </div>

      </div>

    </div>
  );
}

export default Booking;