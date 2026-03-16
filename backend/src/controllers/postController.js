const Post = require('../models/Post');
const Connection = require('../models/Connection');
const { uploadToS3 } = require('../services/storageService');

const createTextPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content) {
        return res.status(400).json({ message: "Content is required." });
    }

    // Check if user already has a post
    const existingPost = await Post.findOne({ userId });
    if (existingPost) {
      return res.status(400).json({ message: "You can only have one active post. Please delete your current post to create a new one." });
    }

    const post = await Post.create({
      userId,
      type: 'text',
      content,
    });

    await post.populate('userId', 'name profileImage');
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const createVoicePost = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    // Check if user already has a post
    const existingPost = await Post.findOne({ userId });
    if (existingPost) {
      return res.status(400).json({ message: "You can only have one active post. Please delete your current post to create a new one." });
    }

    console.log('🎙️ Attempting voice upload for user:', userId);
    // Upload buffer to S3
    const audioUrl = await uploadToS3(req.file);
    console.log('✅ Voice upload success:', audioUrl);

    const post = await Post.create({
      userId,
      type: 'voice',
      audioUrl,
    });

    await post.populate('userId', 'name profileImage');
    res.status(201).json(post);
  } catch (error) {
    console.error('❌ CreateVoicePost Error:', error.message);
    next(error);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get all accepted connections
    const connections = await Connection.find({
      $or: [{ requesterId: userId }, { receiverId: userId }],
      status: 'accepted',
    });

    // Create a list of user IDs to fetch posts from (friends + self)
    const friendIds = connections.map(conn => 
      conn.requesterId.toString() === userId ? conn.receiverId : conn.requesterId
    );
    friendIds.push(userId);

    const posts = await Post.find({ userId: { $in: friendIds } })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(50); // Optional pagination

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure user owns the post
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTextPost,
  createVoicePost,
  getFeed,
  deletePost,
};
