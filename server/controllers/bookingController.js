const db = require("../config/db");

const createBooking = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { userId, showtimeId, seatIds, totalPrice, paymentMethod } = req.body;

    if (!userId || !showtimeId) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin người dùng hoặc suất chiếu" });
    }
    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, message: "Chưa chọn ghế" });
    }
    if (!totalPrice || Number(totalPrice) <= 0) {
      return res.status(400).json({ success: false, message: "Tổng tiền không hợp lệ" });
    }

    await connection.beginTransaction();

    const [showtimes] = await connection.query(
      "SELECT id, room_id, price FROM showtimes WHERE id = ?",
      [showtimeId]
    );
    if (showtimes.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Không tìm thấy suất chiếu" });
    }
    const showtime = showtimes[0];

    const [seats] = await connection.query(
      "SELECT id, room_id FROM seats WHERE id IN (?)",
      [seatIds]
    );
    if (seats.length !== seatIds.length || seats.some((seat) => Number(seat.room_id) !== Number(showtime.room_id))) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Ghế không hợp lệ với phòng chiếu" });
    }

    const [usedSeats] = await connection.query(
      `SELECT bs.seat_id FROM booking_seats bs
       INNER JOIN bookings b ON b.id = bs.booking_id
       WHERE b.showtime_id = ? AND b.status IN ('PENDING', 'PAID') AND bs.seat_id IN (?)
       FOR UPDATE`,
      [showtimeId, seatIds]
    );
    if (usedSeats.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: "Có ghế đã được đặt. Vui lòng chọn ghế khác.",
        seatIds: usedSeats.map((seat) => seat.seat_id),
      });
    }

    const bookingCode = `MT${Date.now().toString().slice(-8)}`;
    const [bookingResult] = await connection.query(
      `INSERT INTO bookings (user_id, showtime_id, total_price, status, booking_code)
       VALUES (?, ?, ?, 'PAID', ?)`,
      [userId, showtimeId, totalPrice, bookingCode]
    );

    for (const seatId of seatIds) {
      await connection.query(
        "INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)",
        [bookingResult.insertId, seatId]
      );
    }

    const validMethods = ["BANKING", "MOMO"];
    if (!validMethods.includes(paymentMethod)) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn chuyển khoản hoặc ví điện tử",
      });
    }
    const method = paymentMethod;
    await connection.query(
      `INSERT INTO payments (booking_id, amount, payment_method, payment_status, paid_at)
       VALUES (?, ?, ?, 'SUCCESS', NOW())`,
      [bookingResult.insertId, totalPrice, method]
    );

    await connection.commit();
    return res.status(201).json({
      success: true,
      message: "Đặt vé thành công",
      data: { bookingId: bookingResult.insertId, bookingCode, showtimeId, seatIds, totalPrice, paymentMethod: method },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create booking error:", error);
    return res.status(500).json({ success: false, message: "Không thể đặt vé" });
  } finally {
    connection.release();
  }
};

const getMyBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT b.id AS booking_id, b.booking_code, b.total_price AS total_amount, b.status, b.created_at,
              s.show_date, s.start_time, s.end_time, m.id AS movie_id, m.title AS movie_title,
              m.poster, c.name AS cinema_name, r.name AS room_name,
              GROUP_CONCAT(se.seat_code ORDER BY se.seat_code SEPARATOR ', ') AS seats
       FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       JOIN movies m ON s.movie_id = m.id
       JOIN rooms r ON s.room_id = r.id
       JOIN cinemas c ON r.cinema_id = c.id
       JOIN booking_seats bs ON b.id = bs.booking_id
       JOIN seats se ON bs.seat_id = se.id
       WHERE b.user_id = ?
      GROUP BY b.id, b.booking_code, b.total_price, b.status, b.created_at,
          s.show_date, s.start_time, s.end_time, m.id, m.title, m.poster,
          c.name, r.name
      ORDER BY b.created_at DESC`,
      [req.params.userId]
    );
    return res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Get my bookings error:", error);
    return res.status(500).json({ success: false, message: "Không thể lấy danh sách vé" });
  }
};

const getBookingById = async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT b.id, b.booking_code, b.total_price AS total_amount, b.status, st.show_date, st.start_time, st.end_time,
              m.id AS movie_id, m.title AS movie_title, m.poster, r.id AS room_id, r.name AS room_name,
              c.id AS cinema_id, c.name AS cinema_name, p.payment_method,
              p.payment_status, p.paid_at
       FROM bookings b JOIN showtimes st ON b.showtime_id = st.id JOIN movies m ON st.movie_id = m.id
       JOIN rooms r ON st.room_id = r.id JOIN cinemas c ON r.cinema_id = c.id
       LEFT JOIN payments p ON b.id = p.booking_id WHERE b.id = ?`,
      [req.params.id]
    );
    if (bookings.length === 0) return res.status(404).json({ success: false, message: "Không tìm thấy vé" });

    const booking = bookings[0];
    const [seats] = await db.query(
      "SELECT s.seat_code FROM booking_seats bs JOIN seats s ON bs.seat_id = s.id WHERE bs.booking_id = ? ORDER BY s.id",
      [req.params.id]
    );
    return res.json({
      success: true,
      data: {
        bookingId: booking.id, bookingCode: booking.booking_code, movieId: booking.movie_id,
        movieTitle: booking.movie_title, poster: booking.poster, cinemaId: booking.cinema_id,
        cinemaName: booking.cinema_name, roomId: booking.room_id, roomName: booking.room_name,
        showDate: booking.show_date, startTime: booking.start_time, endTime: booking.end_time,
        seats: seats.map((seat) => seat.seat_code), totalPrice: booking.total_amount,
        paymentMethod: booking.payment_method, paymentStatus: booking.payment_status,
        paidAt: booking.paid_at, status: booking.status,
      },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return res.status(500).json({ success: false, message: "Không thể lấy thông tin vé" });
  }
};

module.exports = { createBooking, getMyBookings, getBookingById };
