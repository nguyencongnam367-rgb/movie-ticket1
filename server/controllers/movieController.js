const pool = require("../config/db");

const getMovies = async (req, res) => {
    try {
        const [movies] = await pool.query("SELECT * FROM movies ORDER BY id DESC");
        res.json(movies);
    } catch (error) {
        console.error("Get movies error:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const getShowingMovies = async (req, res) => {
    try {
        const [movies] = await pool.query(`
            SELECT m.*,
                   MIN(CONCAT(s.show_date, ' ', s.start_time)) AS next_showtime,
                   COUNT(s.id) AS showtime_count
            FROM movies m
            JOIN showtimes s ON s.movie_id = m.id
            WHERE m.status = 'SHOWING'
              AND TIMESTAMP(s.show_date, s.start_time) >= NOW()
            GROUP BY m.id
            ORDER BY next_showtime ASC
        `);
        res.json(movies);
    } catch (error) {
        console.error("Get showing movies error:", error);
        res.status(500).json({ message: "Không thể tải phim đang chiếu" });
    }
};

const getMovieById = async (req, res) => {
    try {
        const [movies] = await pool.query("SELECT * FROM movies WHERE id = ?", [req.params.id]);
        if (movies.length === 0) return res.status(404).json({ message: "Không tìm thấy phim" });
        res.json(movies[0]);
    } catch (error) {
        console.error("Get movie error:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const createMovie = async (req, res) => {
    try {
        const { title, description, poster, trailer, genre, duration, director, actors, release_date, status } = req.body;
        if (!title || !duration) return res.status(400).json({ message: "Vui lòng nhập tên phim và thời lượng" });

        const [result] = await pool.query(
            `INSERT INTO movies (title, description, poster, trailer, genre, duration, director, actors, release_date, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description || null, poster || null, trailer || null, genre || null, duration,
                director || null, actors || null, release_date || null, status || "COMING_SOON"]
        );
        res.status(201).json({ message: "Thêm phim thành công", movieId: result.insertId });
    } catch (error) {
        console.error("Create movie error:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const updateMovie = async (req, res) => {
    try {
        const { title, description, poster, trailer, genre, duration, director, actors, release_date, status } = req.body;
        const [result] = await pool.query(
            `UPDATE movies SET title = ?, description = ?, poster = ?, trailer = ?, genre = ?, duration = ?,
             director = ?, actors = ?, release_date = ?, status = ? WHERE id = ?`,
            [title, description || null, poster || null, trailer || null, genre || null, duration,
                director || null, actors || null, release_date || null, status, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy phim" });
        res.json({ message: "Cập nhật phim thành công" });
    } catch (error) {
        console.error("Update movie error:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM movies WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy phim" });
        res.json({ message: "Xóa phim thành công" });
    } catch (error) {
        console.error("Delete movie error:", error);
        res.status(500).json({ message: "Không thể xóa phim" });
    }
};

module.exports = {
    getMovies,
    getShowingMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
};
