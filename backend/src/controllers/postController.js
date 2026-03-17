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

    const existingPost = await Post.findOne({ userId });
    if (existingPost) {
      return res.status(400).json({ message: "You can only have one active post. Please delete your current post to create a new one." });
    }

    const post = await Post.create({ userId, type: 'text', content });
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

    const existingPost = await Post.findOne({ userId });
    if (existingPost) {
      return res.status(400).json({ message: "You can only have one active post. Please delete your current post to create a new one." });
    }

    console.log('🎙️ Attempting voice upload for user:', userId);
    const audioUrl = await uploadToS3(req.file);
    console.log('✅ Voice upload success:', audioUrl);

    const post = await Post.create({ userId, type: 'voice', audioUrl });
    await post.populate('userId', 'name profileImage');
    res.status(201).json(post);
  } catch (error) {
    console.error('❌ CreateVoicePost Error:', error.message);
    next(error);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(100);

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

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post removed successfully' });
  } catch (error) {
    next(error);
  }
};

// Toggle reaction on a post
const reactToPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;
    const userId = req.user.userId;

    if (!emoji) return res.status(400).json({ message: 'Emoji is required' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const existingReaction = post.reactions.find(
      (r) => r.userId.toString() === userId
    );

    if (existingReaction) {
      if (existingReaction.emoji === emoji) {
        // Same emoji – remove reaction (toggle off)
        post.reactions = post.reactions.filter(
          (r) => r.userId.toString() !== userId
        );
      } else {
        // Different emoji – update reaction
        existingReaction.emoji = emoji;
      }
    } else {
      // New reaction
      post.reactions.push({ userId, emoji });
    }

    await post.save();
    await post.populate('userId', 'name profileImage');
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTextPost,
  createVoicePost,
  getFeed,
  deletePost,
  reactToPost,
};
