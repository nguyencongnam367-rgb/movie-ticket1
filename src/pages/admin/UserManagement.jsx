import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const { user: currentUser } = useAuth();

  const loadUsers = () => api.get("/admin/users").then((response) => setUsers(response.data));
  useEffect(() => { loadUsers().catch(console.error); }, []);

  const remove = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${user.name}?`)) return;
    setError("");
    try {
      await api.delete(`/admin/users/${user.id}`);
      setUsers((currentUsers) => currentUsers.filter((item) => item.id !== user.id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể xóa tài khoản. Vui lòng thử lại.");
    }
  };

  return (
    <div className="page-container admin-management">
      <div className="admin-management-heading">
        <div><span className="admin-eyebrow">QUẢN TRỊ HỆ THỐNG</span><h1>Quản lý người dùng</h1><p>Danh sách tài khoản và quyền truy cập</p></div>
        <span className="admin-count">{users.length} tài khoản</span>
      </div>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <div className="admin-list">
        {users.map((item) => (
          <div className="admin-list-row" key={item.id}>
            <strong>{item.name}</strong>
            <span>{item.email} · {item.role} · {new Date(item.created_at).toLocaleDateString("vi-VN")}</span>
            <button className="admin-delete-button" disabled={Number(item.id) === Number(currentUser?.id)} title={Number(item.id) === Number(currentUser?.id) ? "Không thể xóa tài khoản đang đăng nhập" : "Xóa tài khoản"} onClick={() => remove(item)}>Xóa</button>
          </div>
        ))}
        {users.length === 0 && <p className="admin-empty">Chưa có tài khoản nào.</p>}
      </div>
    </div>
  );
}

export default UserManagement;