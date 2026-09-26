const app = require("./app");
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Product Service đang chạy tại port ${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});