import { useEffect, useState } from "react";
import api from "../../services/api";

function CinemaManagement() {
  const [cinemas, setCinemas] = useState([]);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const load = () => api.get("/admin/cinemas").then((response) => setCinemas(response.data));
  useEffect(() => { load().catch(console.error); }, []);
  const submit = async (event) => { event.preventDefault(); await api.post("/admin/cinemas", form); setForm({ name: "", address: "", phone: "" }); load(); };
  const remove = async (id) => { if (window.confirm("Xóa rạp này?")) { await api.delete(`/admin/cinemas/${id}`); load(); } };
  return <div className="page-container admin-management"><h1>Quản lý rạp</h1><form className="admin-form" onSubmit={submit}><input required placeholder="Tên rạp" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /><input placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><button className="btn-primary">Thêm rạp</button></form><div className="admin-list">{cinemas.map((cinema) => <div className="admin-list-row" key={cinema.id}><strong>{cinema.name}</strong><span>{cinema.address} · {cinema.room_count} phòng</span><button onClick={() => remove(cinema.id)}>Xóa</button></div>)}</div></div>;
}

export default CinemaManagement;