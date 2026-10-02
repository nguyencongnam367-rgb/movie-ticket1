import { useEffect, useState } from "react";
import api from "../../services/api";

const initialMovie = { title: "", description: "", duration: "", genre: "", poster: "", status: "SHOWING" };

function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState(initialMovie);
  const [showForm, setShowForm] = useState(false);
  const loadMovies = () => api.get("/movies").then((response) => setMovies(response.data));
  useEffect(() => { loadMovies().catch(console.error); }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/movies", { ...movie, duration: Number(movie.duration) });
    setMovie(initialMovie);
    setShowForm(false);
    loadMovies();
  };

  const remove = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phim này?")) {
      await api.delete(`/movies/${id}`);
      loadMovies();
    }
  };

  return (
    <div className="page-container admin-management">
      <h1>Quản lý phim</h1>
      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Thêm phim</button>
      {showForm && <form className="admin-form" onSubmit={submit}>
        <input required placeholder="Tên phim" value={movie.title} onChange={(e) => setMovie({ ...movie, title: e.target.value })} />
        <input required type="number" placeholder="Thời lượng (phút)" value={movie.duration} onChange={(e) => setMovie({ ...movie, duration: e.target.value })} />
        <input placeholder="Thể loại" value={movie.genre} onChange={(e) => setMovie({ ...movie, genre: e.target.value })} />
        <textarea placeholder="Nội dung phim" value={movie.description} onChange={(e) => setMovie({ ...movie, description: e.target.value })} />
        <input placeholder="Poster URL" value={movie.poster} onChange={(e) => setMovie({ ...movie, poster: e.target.value })} />
        <select value={movie.status} onChange={(e) => setMovie({ ...movie, status: e.target.value })}><option value="SHOWING">Đang chiếu</option><option value="COMING_SOON">Sắp chiếu</option><option value="ENDED">Đã kết thúc</option></select>
        <button className="btn-primary" type="submit">Lưu phim</button>
      </form>}
      <div className="admin-list">{movies.map((item) => <div className="admin-list-row" key={item.id}><strong>{item.title}</strong><span>{item.genre || "Chưa có thể loại"} · {item.duration} phút · {item.status}</span><button onClick={() => remove(item.id)}>Xóa</button></div>)}</div>
    </div>
  );
}

export default MovieManagement;