const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", service: "auth-service" }));
app.use("/", authRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`🚀 Auth Service đang chạy trên port ${PORT}`));