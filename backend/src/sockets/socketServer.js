const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;
// Map to keep track of connected users: { userId: socketId }
const connectedUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);
    connectedUsers.set(socket.userId, socket.id);

    // Update user status
    try {
      await User.findByIdAndUpdate(socket.userId, { onlineStatus: true });
      // Broadcast to everyone that this user is online
      io.emit('userOnline', socket.userId);
    } catch (err) {
      console.error(err);
    }

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      connectedUsers.delete(socket.userId);

      try {
        await User.findByIdAndUpdate(socket.userId, { onlineStatus: false });
        io.emit('userOffline', socket.userId);
      } catch (err) {
        console.error(err);
      }
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

const getConnectedUsers = () => connectedUsers;

module.exports = { initSocket, getIo, getConnectedUsers };
