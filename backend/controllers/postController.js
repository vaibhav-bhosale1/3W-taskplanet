// backend/controllers/postController.js
const Post = require('../models/postModel');
const User = require('../models/userModel');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Protected)
const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ message: 'Please add text or an image' });
    }

    // req.user is available because of our 'protect' middleware
    const newPost = await Post.create({
      text,
      image, // In a real app, you'd upload this and store a URL
      user: req.user.id,
      username: req.user.username,
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res) => {
  try {
    // Find all posts and sort by newest first
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private (Protected)
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    // We filter the likes array to see if req.user.id is already in it
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      // --- UNLIKE ---
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );
    } else {
      // --- LIKE ---
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();
    res.status(200).json(post.likes); // Send back just the updated likes array
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private (Protected)
const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const newComment = {
      user: req.user.id,
      username: req.user.username,
      text: text,
    };

    post.comments.unshift(newComment); // Add to the beginning of the array

    await post.save();
    res.status(201).json(post.comments); // Send back just the updated comments array
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  likePost,
commentOnPost,
};