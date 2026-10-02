import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../services/api";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    const loadShowingMovies = async () => {
      try {
        const response = await api.get("/movies/showing");
        setMovies(response.data);
      } catch (error) {
        console.error("Showing movies error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadShowingMovies();
  }, []);

  const formatShowtime = (value) => new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const featuredMovie = movies.length ? movies[featuredIndex % movies.length] : null;

  const changeFeaturedMovie = (direction) => {
    setFeaturedIndex((currentIndex) => (currentIndex + direction + movies.length) % movies.length);
  };

  return (
    <div>
      <section className="home-hero" aria-labelledby="home-hero-title">
        {featuredMovie?.poster && <img className="home-hero-image" src={featuredMovie.poster} alt="" />}
        <div className="home-hero-content">
          <span className="home-hero-kicker">ĐANG CHIẾU</span>
          <h1 id="home-hero-title">{featuredMovie?.title || "Đặt vé xem phim"}</h1>
          <p>
            {featuredMovie
              ? `${featuredMovie.genre || "Phim đang chiếu"} · ${featuredMovie.duration} phút${featuredMovie.next_showtime ? ` · Suất gần nhất ${formatShowtime(featuredMovie.next_showtime)}` : ""}`
              : "Chọn phim và xem các suất chiếu tại rạp gần bạn."}
          </p>
          <div className="hero-buttons">
            <Link to={featuredMovie ? `/movies/${featuredMovie.id}` : "/movies"} className="btn-primary">Chi tiết phim</Link>
            <Link to="/showtimes" className="btn-secondary">Lịch chiếu</Link>
          </div>
        </div>
        {movies.length > 1 && (
          <div className="home-hero-controls" aria-label="Chuyển phim đang chiếu">
            <button type="button" aria-label="Phim trước" onClick={() => changeFeaturedMovie(-1)}>
              <FiChevronLeft aria-hidden="true" />
            </button>
            <span aria-live="polite">{String(featuredIndex + 1).padStart(2, "0")} / {String(movies.length).padStart(2, "0")}</span>
            <button type="button" aria-label="Phim tiếp theo" onClick={() => changeFeaturedMovie(1)}>
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="section-title">
          <div>
            <span className="section-kicker">ĐANG CÓ TẠI RẠP</span>
            <h2>Phim đang chiếu</h2>
          </div>
          <Link to="/movies">Tất cả phim <span aria-hidden="true">→</span></Link>
        </div>

        {loading && <div className="movie-placeholder"><p>Đang tải phim...</p></div>}

        {!loading && movies.length === 0 && (
          <div className="movie-placeholder">
            <h3>Chưa có suất chiếu sắp tới</h3>
            <p>Vui lòng quay lại sau để xem lịch phim mới.</p>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="movie-grid">
            {movies.map((movie) => (
              <article className="movie-card" key={movie.id}>
                <Link to={`/movies/${movie.id}`} className="movie-poster-link" aria-label={`Xem ${movie.title}`}>
                  <img src={movie.poster} alt={movie.title} loading="lazy" />
                </Link>
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p className="movie-meta-line">{movie.genre || "Đang cập nhật"} <span>·</span> {movie.duration} phút</p>
                  {movie.next_showtime && <p className="home-next-showtime">Suất gần nhất: {formatShowtime(movie.next_showtime)}</p>}
                  <Link to={`/movies/${movie.id}`} className="movie-button">
                    Chi tiết phim <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>

    </div>
  );
}

export default Home;