// backend/models/postModel.js
const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This links the post to the User model
    },
    username: {
      type: String, // Storing username directly for easier display [cite: 19]
      required: true,
    },
    text: {
      type: String,
      required: function() { return !this.image } // Required if no image [cite: 17]
    },
    image: {
      type: String, // We will store the URL of the uploaded image
      required: function() { return !this.text } // Required if no text [cite: 17]
    },
    likes: [
      {
        user: { // Storing the user ID [cite: 23]
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    comments: [
      {
        user: { // Storing the user ID [cite: 23]
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        username: { // Storing username for easy display
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: [true, 'Please add comment text'],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);