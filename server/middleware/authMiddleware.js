const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Vui lòng đăng nhập bằng tài khoản quản trị" });
  }

  try {
    const token = authorization.slice(7);
    const user = jwt.verify(token, process.env.JWT_SECRET || "movie_ticket_secret_key");
    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = { authenticateAdmin };