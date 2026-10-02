const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/test-db", async (req, res) => {
    try {
        const [result] = await db.query(
            "SELECT 1 AS test"
        );

        res.json({
            success: true,
            message: "Kết nối MySQL thành công!",
            data: result
        });
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            success: false,
            message: "Không kết nối được MySQL"
        });
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server đang chạy tại http://localhost:${PORT}`
    );
});