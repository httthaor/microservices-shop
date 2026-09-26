const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product Service API",
      version: "1.0.0",
      description: "API quản lý sản phẩm - Lab 2a"
    },
    servers: [{ url: "http://localhost:3001", description: "Development" }]
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsdoc(options);