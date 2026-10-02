import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useState } from "react";
import api from "../services/api";

function Checkout() {
  const { showtimeId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
    useState("BANKING");

  const [loading, setLoading] =
    useState(false);


  const seatIds =
    location.state?.seatIds || [];

  const totalPrice =
    location.state?.totalPrice || 0;


  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const userId = user?.id;


  if (seatIds.length === 0) {
    return (
      <div className="page-container">

        <div className="page-header">

          <h1>
            Thanh toán
          </h1>

          <p>
            Không tìm thấy thông tin đặt vé
          </p>

        </div>

        <div className="empty-state">

          <div>
            🎟️
          </div>

          <h2>
            Bạn chưa chọn ghế
          </h2>

          <p>
            Vui lòng quay lại và chọn ghế
            trước khi thanh toán.
          </p>

          <button
            className="continue-button"
            onClick={() =>
              navigate(
                `/booking/${showtimeId}`
              )
            }
          >
            Quay lại chọn ghế
          </button>

        </div>

      </div>
    );
  }


  const handlePayment = async () => {

    if (!userId) {
      alert(
        "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
      );

      navigate("/login");

      return;
    }

    if (seatIds.length === 0) {
      alert("Vui lòng chọn ghế.");

      return;
    }

    try {

      setLoading(true);

      const response = await api.post("/bookings", {
        userId,
        showtimeId: Number(showtimeId),
        seatIds,
        totalPrice,
        paymentMethod,
      });
      const result = response.data;


      if (!result.success) {
        if (result.seatIds?.length > 0) {
          alert(
            `Ghế ${result.seatIds.join(
              ", "
            )} đã được đặt. Vui lòng chọn ghế khác.`
          );
        } else {
          alert(
            result.message ||
            "Đặt vé thất bại."
          );
        }

        return;
      }


      navigate(
        `/ticket/${result.data.bookingId}`,
        {
          state: {
            booking: result.data,
            bookingSuccess: true,
          },
        }
      );

    } catch (error) {

      console.error(
        "Payment error:",
        error
      );

      alert(error.response?.data?.message || "Không thể kết nối đến server.");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="page-container">


      <div className="page-header">

        <h1>
          Thanh toán
        </h1>

        <p>
          Kiểm tra thông tin trước khi
          đặt vé
        </p>

      </div>


      <div className="checkout-container">


        <div className="checkout-card">

          <h2>
            🎬 Thông tin vé
          </h2>

          <div className="checkout-info">

            <div>

              <span>
                Suất chiếu
              </span>

              <strong>
                #{showtimeId}
              </strong>

            </div>

            <div>

              <span>
                Ghế
              </span>

              <strong>
                {seatIds.join(", ")}
              </strong>

            </div>

            <div>

              <span>
                Số lượng ghế
              </span>

              <strong>
                {seatIds.length}
              </strong>

            </div>

          </div>

        </div>



        <div className="checkout-card">

          <h2>
            💳 Phương thức thanh toán
          </h2>

          <div className="payment-methods">


            <label
              className={`payment-option ${
                paymentMethod === "BANKING"
                  ? "active"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="payment"
                value="BANKING"
                checked={
                  paymentMethod === "BANKING"
                }
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value
                  )
                }
              />

              <div>

                <strong>
                  🏦 Chuyển khoản ngân hàng
                </strong>

                <p>
                  Thanh toán qua ngân hàng
                </p>

              </div>

            </label>



            <label
              className={`payment-option ${
                paymentMethod === "MOMO"
                  ? "active"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="payment"
                value="MOMO"
                checked={
                  paymentMethod === "MOMO"
                }
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value
                  )
                }
              />

              <div>

                <strong>
                  🟣 Ví điện tử
                </strong>

                <p>
                  Thanh toán bằng ví điện tử
                </p>

              </div>

            </label>

          </div>

        </div>



        <div className="checkout-card checkout-total">

          <div className="total-row">

            <span>
              Ghế đã chọn
            </span>

            <strong>
              {seatIds.length} ghế
            </strong>

          </div>


          <div className="total-row">

            <span>
              Giá vé
            </span>

            <strong>
              {totalPrice.toLocaleString(
                "vi-VN"
              )}đ
            </strong>

          </div>


          <div className="total-line"></div>


          <div className="total-row final-total">

            <span>
              Tổng thanh toán
            </span>

            <strong>
              {totalPrice.toLocaleString(
                "vi-VN"
              )}đ
            </strong>

          </div>



          <button
            className="payment-button"
            onClick={handlePayment}
            disabled={loading}
          >

            {loading
              ? "Đang xử lý..."
              : "Xác nhận đặt vé"}

          </button>


          <button
            className="back-button"
            disabled={loading}
            onClick={() =>
              navigate(
                `/booking/${showtimeId}`
              )
            }
          >
            ← Quay lại chọn ghế
          </button>

        </div>

      </div>

    </div>
  );
}

export default Checkout;