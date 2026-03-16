const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://campus-connect-tawny-alpha.vercel.app',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/posts', postRoutes);

// Error middleware
app.use(errorHandler);

module.exports = app;
