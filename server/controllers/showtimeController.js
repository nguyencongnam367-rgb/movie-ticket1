const db = require("../config/db");

const getShowtimes = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                s.id,
                s.movie_id,
                m.title,
                s.room_id,
                s.show_date,
                s.start_time,
                s.end_time,
                s.price
            FROM showtimes s
            JOIN movies m ON s.movie_id = m.id
            ORDER BY s.show_date, s.start_time
        `);

        res.json(rows);

    } catch (error) {
        console.error("Showtimes error:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy lịch chiếu"
        });
    }
};

const getSeatsByShowtime = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                se.id,
                se.seat_code,
                se.seat_type,
                CASE WHEN b.id IS NULL THEN 0 ELSE 1 END AS is_booked
            FROM showtimes s
            JOIN seats se ON se.room_id = s.room_id
            LEFT JOIN booking_seats bs ON bs.seat_id = se.id
            LEFT JOIN bookings b ON b.id = bs.booking_id
                AND b.showtime_id = s.id
                AND b.status IN ('PENDING', 'PAID')
            WHERE s.id = ?
            GROUP BY se.id, se.seat_code, se.seat_type, b.id
            ORDER BY se.id
        `, [req.params.id]);

        res.json(rows.map((seat) => ({
            ...seat,
            is_booked: Boolean(seat.is_booked),
        })));
    } catch (error) {
        console.error("Seats error:", error);
        res.status(500).json({ message: "Không thể lấy sơ đồ ghế" });
    }
};

module.exports = {
    getShowtimes,
    getSeatsByShowtime
};