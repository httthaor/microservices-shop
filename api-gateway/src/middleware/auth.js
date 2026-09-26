const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Chưa đăng nhập (thiếu Bearer token)" });
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "super_secret_jwt_key_lab2a_2026_at_least_32_characters"
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = authenticate;