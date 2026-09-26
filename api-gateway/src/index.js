const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authenticate = require("./middleware/auth");

const app = express();
app.use(helmet());
app.use(cors({ origin: "*" }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", gateway: true }));

// 1. Proxy Auth Service (Port 3003)
app.use("/api/auth", createProxyMiddleware({
  target: "http://127.0.0.1:3003",
  changeOrigin: true
}));

// 2. Proxy Product Service (Port 3001)
app.use("/api/products", createProxyMiddleware({
  target: "http://127.0.0.1:3001",
  changeOrigin: true
}));

// 3. Proxy Order Service (Port 3002) - Cần xác thực
app.use("/api/orders", authenticate, createProxyMiddleware({
  target: "http://127.0.0.1:3002/api/orders",
  changeOrigin: true,
  ignorePath: false
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway đang chạy trên port ${PORT}`));