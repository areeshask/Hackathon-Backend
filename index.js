require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// CORS - allow your frontend origin
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Error handler
app.use(errorHandler);

// Start server & connect DB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
