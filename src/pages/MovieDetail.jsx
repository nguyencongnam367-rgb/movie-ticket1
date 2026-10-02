import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function MovieDetail() {
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/movies/${id}`);

                setMovie(response.data);
            } catch (err) {
                console.error("Get movie error:", err);

                setError("Không thể tải thông tin phim");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) {
        return (
            <div className="movie-detail-page">
                <div className="movie-detail-container">
                    <div className="loading-box">
                        Đang tải thông tin phim...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="movie-detail-page">
                <div className="movie-detail-container">
                    <div className="error-box">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="movie-detail-page">
                <div className="movie-detail-container">
                    <div className="error-box">
                        Không tìm thấy phim
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="movie-detail-page">

            <div className="movie-detail-container">

                <section className="movie-detail-main">

                    <div className="movie-detail-poster">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                        />
                    </div>

                    <div className="movie-detail-info">

                        <span className="movie-status">
                            {movie.status}
                        </span>

                        <h1>{movie.title}</h1>

                        <div className="movie-meta">

                            <p>
                                <strong>Thể loại:</strong>{" "}
                                {movie.genre || "Đang cập nhật"}
                            </p>

                            <p>
                                <strong>Thời lượng:</strong>{" "}
                                {movie.duration} phút
                            </p>

                            <p>
                                <strong>Đạo diễn:</strong>{" "}
                                {movie.director || "Đang cập nhật"}
                            </p>

                            <p>
                                <strong>Diễn viên:</strong>{" "}
                                {movie.actors || "Đang cập nhật"}
                            </p>

                            <p>
                                <strong>Ngày khởi chiếu:</strong>{" "}
                                {movie.release_date
                                    ? new Date(
                                          movie.release_date
                                      ).toLocaleDateString("vi-VN")
                                    : "Đang cập nhật"}
                            </p>

                        </div>

                        <Link
                            to="/showtimes"
                            className="movie-book-button"
                        >
                            🎟 Xem lịch chiếu
                        </Link>

                    </div>

                </section>

                <section className="movie-description">

                    <h2>Nội dung phim</h2>

                    <p>
                        {movie.description ||
                            "Chưa có thông tin mô tả cho bộ phim này."}
                    </p>

                </section>

                {movie.trailer && (
                    <section className="movie-trailer">

                        <h2>Trailer</h2>

                        <div className="trailer-wrapper">
                            <iframe
                                src={movie.trailer}
                                title={`Trailer ${movie.title}`}
                                allowFullScreen
                            />
                        </div>

                    </section>
                )}

                <div className="movie-back">
                    <Link to="/movies">
                        ← Quay lại danh sách phim
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default MovieDetail;