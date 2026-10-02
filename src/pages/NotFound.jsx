import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found">

      <div className="not-found-number">
        404
      </div>

      <h1>
        Không tìm thấy trang
      </h1>

      <p>
        Trang bạn đang tìm kiếm không tồn tại.
      </p>

      <Link
        to="/"
        className="btn-primary"
      >
        Về trang chủ
      </Link>

    </div>
  );
}

export default NotFound;