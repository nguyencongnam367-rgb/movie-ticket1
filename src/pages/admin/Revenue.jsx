import { useEffect, useState } from "react";
import api from "../../services/api";

function Revenue() {
  const [rows, setRows] = useState([]);
  useEffect(() => { api.get("/admin/revenue").then((response) => setRows(response.data)).catch(console.error); }, []);
  const total = rows.reduce((sum, row) => sum + Number(row.revenue || 0), 0);
  return <div className="page-container admin-management"><h1>Thống kê doanh thu</h1><div className="admin-revenue-total"><span>Tổng doanh thu</span><h2>{total.toLocaleString("vi-VN")} ₫</h2><p>Từ {rows.length} ngày có giao dịch</p></div><div className="admin-list">{rows.length === 0 && <p className="admin-empty">Chưa có dữ liệu doanh thu.</p>}{rows.map((row) => <div className="admin-list-row" key={String(row.date)}><strong>{new Date(row.date).toLocaleDateString("vi-VN")}</strong><span>{row.tickets} vé · {Number(row.revenue).toLocaleString("vi-VN")} ₫</span></div>)}</div></div>;
}

export default Revenue;