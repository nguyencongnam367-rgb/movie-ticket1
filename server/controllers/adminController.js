const db = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM movies) AS movies,
        (SELECT COUNT(*) FROM rooms) AS rooms,
        (SELECT COUNT(*) FROM bookings WHERE status = 'PAID') AS tickets,
        COALESCE((SELECT SUM(total_price) FROM bookings WHERE status = 'PAID'), 0) AS revenue
    `);
    res.json(stats);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Không thể tải thống kê" });
  }
};

const getCinemas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, COUNT(r.id) AS room_count
      FROM cinemas c LEFT JOIN rooms r ON r.cinema_id = c.id
      GROUP BY c.id ORDER BY c.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Không thể tải danh sách rạp" });
  }
};

const createCinema = async (req, res) => {
  const { name, address, phone } = req.body;
  if (!name) return res.status(400).json({ message: "Tên rạp là bắt buộc" });
  try {
    const [result] = await db.query("INSERT INTO cinemas (name, address, phone) VALUES (?, ?, ?)", [name, address || null, phone || null]);
    res.status(201).json({ id: result.insertId, message: "Thêm rạp thành công" });
  } catch (error) {
    res.status(500).json({ message: "Không thể thêm rạp" });
  }
};

const deleteCinema = async (req, res) => {
  try {
    await db.query("DELETE FROM cinemas WHERE id = ?", [req.params.id]);
    res.json({ message: "Xóa rạp thành công" });
  } catch (error) {
    res.status(409).json({ message: "Không thể xóa rạp đang có phòng" });
  }
};

const getRooms = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT r.id, r.cinema_id, r.name, r.total_seats AS capacity,
              c.name AS cinema_name, COUNT(s.id) AS seat_count
      FROM rooms r JOIN cinemas c ON c.id = r.cinema_id
      LEFT JOIN seats s ON s.room_id = r.id
      GROUP BY r.id ORDER BY r.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Không thể tải danh sách phòng" });
  }
};

const createRoom = async (req, res) => {
  const { cinemaId, name, capacity } = req.body;
  if (!cinemaId || !name || !capacity) return res.status(400).json({ message: "Vui lòng nhập đủ thông tin phòng" });
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [room] = await connection.query("INSERT INTO rooms (cinema_id, name, total_seats) VALUES (?, ?, ?)", [cinemaId, name, capacity]);
    const seatCount = Number(capacity);
    for (let index = 0; index < seatCount; index += 1) {
      const row = String.fromCharCode(65 + Math.floor(index / 10));
      const number = (index % 10) + 1;
      await connection.query("INSERT INTO seats (room_id, seat_code, seat_type) VALUES (?, ?, ?)", [room.insertId, `${row}${String(number).padStart(2, "0")}`, Math.floor(index / 10) >= 4 ? "VIP" : "REGULAR"]);
    }
    await connection.commit();
    res.status(201).json({ id: room.insertId, message: "Thêm phòng và ghế thành công" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Không thể thêm phòng" });
  } finally {
    connection.release();
  }
};

const deleteRoom = async (req, res) => {
  try {
    await db.query("DELETE FROM rooms WHERE id = ?", [req.params.id]);
    res.json({ message: "Xóa phòng thành công" });
  } catch (error) {
    res.status(409).json({ message: "Không thể xóa phòng đang có lịch chiếu" });
  }
};

const getAdminShowtimes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, m.title AS movie_title, r.name AS room_name, c.name AS cinema_name
      FROM showtimes s JOIN movies m ON m.id = s.movie_id
      JOIN rooms r ON r.id = s.room_id JOIN cinemas c ON c.id = r.cinema_id
      ORDER BY s.show_date DESC, s.start_time DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Không thể tải lịch chiếu" });
  }
};

const createShowtime = async (req, res) => {
  const { movieId, roomId, showDate, startTime, endTime, price } = req.body;
  if (!movieId || !roomId || !showDate || !startTime || !endTime || !price) return res.status(400).json({ message: "Vui lòng nhập đủ thông tin suất chiếu" });
  try {
    const [result] = await db.query("INSERT INTO showtimes (movie_id, room_id, show_date, start_time, end_time, price) VALUES (?, ?, ?, ?, ?, ?)", [movieId, roomId, showDate, startTime, endTime, price]);
    res.status(201).json({ id: result.insertId, message: "Thêm suất chiếu thành công" });
  } catch (error) {
    res.status(409).json({ message: "Không thể thêm suất chiếu" });
  }
};

const deleteShowtime = async (req, res) => {
  try {
    await db.query("DELETE FROM showtimes WHERE id = ?", [req.params.id]);
    res.json({ message: "Xóa suất chiếu thành công" });
  } catch (error) {
    res.status(409).json({ message: "Không thể xóa suất chiếu đã có vé" });
  }
};

const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Không thể tải người dùng" });
  }
};

const deleteUser = async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ message: "Tài khoản không hợp lệ" });
  }
  if (userId === Number(req.user.id)) {
    return res.status(400).json({ message: "Bạn không thể xóa tài khoản đang đăng nhập" });
  }

  try {
    const [[user]] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    const [[{ bookingCount }]] = await db.query("SELECT COUNT(*) AS bookingCount FROM bookings WHERE user_id = ?", [userId]);
    if (Number(bookingCount) > 0) {
      return res.status(409).json({ message: "Không thể xóa tài khoản đã có lịch sử đặt vé" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "Xóa tài khoản thành công" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Không thể xóa tài khoản" });
  }
};

const getRevenue = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS tickets, SUM(total_price) AS revenue
      FROM bookings WHERE status = 'PAID'
      GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Không thể tải doanh thu" });
  }
};

module.exports = { getDashboard, getCinemas, createCinema, deleteCinema, getRooms, createRoom, deleteRoom, getAdminShowtimes, createShowtime, deleteShowtime, getUsers, deleteUser, getRevenue };
