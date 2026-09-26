const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (err) => console.error("❌ Lỗi Redis:", err.message));
redisClient.on("connect", () => console.log("✅ Kết nối Redis thành công!"));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("❌ Không thể kết nối Redis:", err.message);
  }
})();

module.exports = redisClient;