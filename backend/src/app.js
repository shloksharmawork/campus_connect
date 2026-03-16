const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Added mongoose import
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Database connection function
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is missing from environment variables!');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    // Don't exit process in production if we want to debug health check
    if (process.env.NODE_ENV !== 'production') {
       process.exit(1);
    }
  }
};

const connectionRoutes = require('./routes/connectionRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV }));

// Error middleware
app.use(errorHandler);

module.exports = app;
