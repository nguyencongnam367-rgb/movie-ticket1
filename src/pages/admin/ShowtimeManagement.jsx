import { useEffect, useState } from "react";
import api from "../../services/api";

function ShowtimeManagement() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ movieId: "", roomId: "", showDate: "", startTime: "", endTime: "", price: 90000 });
  const load = () => api.get("/admin/showtimes").then((response) => setShowtimes(response.data));
  useEffect(() => { Promise.all([load(), api.get("/movies").then((response) => setMovies(response.data)), api.get("/admin/rooms").then((response) => setRooms(response.data))]).catch(console.error); }, []);
  const submit = async (event) => { event.preventDefault(); await api.post("/admin/showtimes", { ...form, price: Number(form.price) }); setForm({ movieId: "", roomId: "", showDate: "", startTime: "", endTime: "", price: 90000 }); load(); };
  const remove = async (id) => { if (window.confirm("Xóa suất chiếu này?")) { await api.delete(`/admin/showtimes/${id}`); load(); } };
  return <div className="page-container admin-management"><h1>Quản lý lịch chiếu</h1><form className="admin-form" onSubmit={submit}><select required value={form.movieId} onChange={(e) => setForm({ ...form, movieId: e.target.value })}><option value="">Chọn phim</option>{movies.map((movie) => <option key={movie.id} value={movie.id}>{movie.title}</option>)}</select><select required value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}><option value="">Chọn phòng</option>{rooms.map((room) => <option key={room.id} value={room.id}>{room.cinema_name} - {room.name}</option>)}</select><input required type="date" value={form.showDate} onChange={(e) => setForm({ ...form, showDate: e.target.value })} /><input required type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /><input required type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /><input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /><button className="btn-primary">Thêm suất chiếu</button></form><div className="admin-list">{showtimes.map((item) => <div className="admin-list-row" key={item.id}><strong>{item.movie_title}</strong><span>{item.show_date} · {item.start_time} - {item.end_time} · {item.cinema_name} / {item.room_name}</span><button onClick={() => remove(item.id)}>Xóa</button></div>)}</div></div>;
}

export default ShowtimeManagement;