const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Tích hợp Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: { persistAuthorization: true },
  customSiteTitle: "Order Service API Docs"
}));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ Connection error:', err));

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('API Quan ly Don hang dang hoat dong...');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});