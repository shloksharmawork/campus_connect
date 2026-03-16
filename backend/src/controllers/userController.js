const User = require('../models/User');

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getOnlineUsers = async (req, res, next) => {
  try {
    // Return everyone else who is online, excluding the current user
    const users = await User.find({ onlineStatus: true, _id: { $ne: req.user.userId } })
      .select('_id name profileImage');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.userId } }).select('_id name profileImage onlineStatus');
        res.json(users);
    } catch (error) {
        next(error)
    }
}

module.exports = {
  getMyProfile,
  getOnlineUsers,
  getAllUsers
};
