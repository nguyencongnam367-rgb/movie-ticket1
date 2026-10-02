import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Movies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getMovies = async () => {
            try {
                setLoading(true);

                const response = await api.get("/movies");

                setMovies(response.data);
            } catch (err) {
                console.error(err);
                setError("Không thể tải danh sách phim");
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, []);

    if (loading) {
        return (
            <div className="container">
                <h2>Đang tải phim...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Danh sách phim</h1>

            {movies.length === 0 ? (
                <p>Chưa có phim</p>
            ) : (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <div className="movie-card" key={movie.id}>

                            <img
                                src={movie.poster}
                                alt={movie.title}
                            />

                            <div className="movie-info">
                                <h3>{movie.title}</h3>

                                <p>
                                    Thể loại: {movie.genre}
                                </p>

                                <p>
                                    Thời lượng: {movie.duration} phút
                                </p>

                                <Link
                                    to={`/movies/${movie.id}`}
                                    className="movie-button"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Movies;