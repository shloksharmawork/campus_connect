const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
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
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV || 'production' }));

// Error middleware
app.use(errorHandler);

module.exports = app;
