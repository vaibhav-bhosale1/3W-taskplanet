// backend/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// --- Public Routes ---
// Get all posts
router.get('/', getAllPosts);

// --- Private Routes (require token) ---
// Create a new post
router.post('/', protect, createPost);

// Like/Unlike a post
router.put('/:id/like', protect, likePost);

// Comment on a post
router.post('/:id/comment', protect, commentOnPost);

module.exports = router;