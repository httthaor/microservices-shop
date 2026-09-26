const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "API quản lý đơn hàng - Microservices Lab 2a",
    },
    servers: [
      { url: "http://localhost:3002", description: "Direct Order Service" },
      { url: "http://localhost:3000", description: "Via API Gateway" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        OrderItem: {
          type: "object",
          required: ["productId", "productName", "price", "quantity"],
          properties: {
            productId: { type: "integer", example: 1 },
            productName: { type: "string", example: "iPhone 15 Pro" },
            price: { type: "number", example: 27990000 },
            quantity: { type: "integer", example: 1 },
            subtotal: { type: "number", example: 27990000 }
          }
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1c2d3e4b5a6c7d8e9f012" },
            orderCode: { type: "string", example: "ORD-20260926-0001" },
            customerId: { type: "integer", example: 1 },
            customerName: { type: "string", example: "Nguyen Van A" },
            customerEmail: { type: "string", example: "test@example.com" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" }
            },
            totalAmount: { type: "number", example: 27990000 },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
              example: "pending"
            },
            shippingAddress: {
              type: "object",
              properties: {
                street: { type: "string", example: "123 Nguyen Hue" },
                city: { type: "string", example: "TP.HCM" },
                district: { type: "string", example: "Quan 1" },
                note: { type: "string", example: "Giao gio hanh chinh" }
              }
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsdoc(options);