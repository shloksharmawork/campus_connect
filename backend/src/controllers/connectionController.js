const Connection = require('../models/Connection');
const User = require('../models/User');

const sendRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    const requesterId = req.user.userId;

    if (requesterId === receiverId) {
       return res.status(400).json({ message: "Cannot send a connection request to yourself."});
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requesterId, receiverId },
        { requesterId: receiverId, receiverId: requesterId },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists or is pending' });
    }

    const connection = await Connection.create({
      requesterId,
      receiverId,
      status: 'pending',
    });

    res.status(201).json(connection);
  } catch (error) {
    next(error);
  }
};

const respondRequest = async (req, res, next) => {
  try {
    const { connectionId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    const userId = req.user.userId;

    const connection = await Connection.findOne({ _id: connectionId, receiverId: userId, status: 'pending' });

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    if (action === 'accept') {
      connection.status = 'accepted';
      await connection.save();
    } else if (action === 'reject') {
      connection.status = 'rejected';
      await connection.save();
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    res.status(200).json(connection);
  } catch (error) {
    next(error);
  }
};

const getMyConnections = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Find all accepted connections where user is either requester or receiver
    const connections = await Connection.find({
      $or: [{ requesterId: userId }, { receiverId: userId }],
      status: 'accepted',
    }).populate('requesterId', 'name profileImage onlineStatus')
      .populate('receiverId', 'name profileImage onlineStatus');

    // Format the response to just return a list of profiles
    const friends = connections.map(conn => {
      if (conn.requesterId._id.toString() === userId) {
        return conn.receiverId;
      }
      return conn.requesterId;
    });

    res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
};

const getPendingRequests = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const requests = await Connection.find({
            receiverId: userId,
            status: 'pending'
        }).populate('requesterId', 'name profileImage');

        res.status(200).json(requests);
    } catch (error) {
        next(error)
    }
}

module.exports = {
  sendRequest,
  respondRequest,
  getMyConnections,
  getPendingRequests
};
