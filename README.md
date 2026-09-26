# Microservices Shop API - Lab 2a

## Cấu trúc hệ thống
- **API Gateway**: Port 3000 (Express, Proxy, Rate-limit, Helmet)
- **Product Service**: Port 3001 (Node.js, Express, PostgreSQL/Supabase, Prisma ORM, Swagger)
- **Order Service**: Port 5000 / 3002 (Node.js, Express, MongoDB)

## Hướng dẫn chạy hệ thống

### Cách 1: Chạy trực tiếp qua Node.js (3 Terminal)
1. Chạy Product Service:
   cd product-service
   npm install
   npx prisma migrate dev
   npm run dev

2. Chạy Order Service:
   cd order-service
   npm install
   node server.js

3. Chạy API Gateway:
   cd api-gateway
   npm install
   node src/index.js

### Cách 2: Chạy qua Docker Compose
docker compose up -d --build

## Tài liệu API
- Swagger UI: http://localhost:3001/api-docs
- API Gateway Endpoint: http://localhost:3000