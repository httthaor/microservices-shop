const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đủ name, email, password" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không chính xác" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không chính xác" });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/refresh
const refresh = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Thiếu refreshToken" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "RefreshToken không hợp lệ hoặc đã hết hạn" });
    }
    const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.json({ success: true, accessToken });
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy user" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, refresh, getMe };