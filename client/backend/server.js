const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Kết nối MongoDB
connectDB();

// Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:5173', // Cổng Vite (React)
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Test API
app.get('/test', (req, res) => {
  console.log('Received GET /test');
  res.json({ message: 'Server is running' });
});

// Route chính
app.use('/api/auth', authRoutes);       // Đăng nhập / đăng ký
app.use('/api/campaign', campaignRoutes); // CRUD chiến dịch

// Khởi chạy server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
