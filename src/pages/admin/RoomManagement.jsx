import { useEffect, useState } from "react";
import api from "../../services/api";

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [form, setForm] = useState({ cinemaId: "", name: "", capacity: 40 });
  const load = () => api.get("/admin/rooms").then((response) => setRooms(response.data));
  useEffect(() => { Promise.all([load(), api.get("/admin/cinemas").then((response) => setCinemas(response.data))]).catch(console.error); }, []);
  const submit = async (event) => { event.preventDefault(); await api.post("/admin/rooms", { ...form, capacity: Number(form.capacity) }); setForm({ cinemaId: "", name: "", capacity: 40 }); load(); };
  const remove = async (id) => { if (window.confirm("Xóa phòng này?")) { await api.delete(`/admin/rooms/${id}`); load(); } };
  return <div className="page-container admin-management"><h1>Quản lý phòng chiếu</h1><form className="admin-form" onSubmit={submit}><select required value={form.cinemaId} onChange={(e) => setForm({ ...form, cinemaId: e.target.value })}><option value="">Chọn rạp</option>{cinemas.map((cinema) => <option key={cinema.id} value={cinema.id}>{cinema.name}</option>)}</select><input required placeholder="Tên phòng" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input required type="number" min="1" max="100" placeholder="Số ghế" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /><button className="btn-primary">Thêm phòng và ghế</button></form><div className="admin-list">{rooms.map((room) => <div className="admin-list-row" key={room.id}><strong>{room.name}</strong><span>{room.cinema_name} · {room.seat_count}/{room.capacity} ghế</span><button onClick={() => remove(room.id)}>Xóa</button></div>)}</div></div>;
}

export default RoomManagement;