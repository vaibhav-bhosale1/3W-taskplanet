// client/src/pages/HomePage.js
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard'; // Import PostCard

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Fetch All Posts ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // This is a public route, no token needed
        const { data } = await axios.get('http://localhost:5001/api/posts');
        setPosts(data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this runs once on load

  // --- Handler for new post creation ---
  const handleNewPost = (newPost) => {
    // Add the new post to the top of the feed
    setPosts([newPost, ...posts]);
  };

  // --- Render Function ---
  const renderFeed = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography color="error" align="center" sx={{ mt: 5 }}>
          {error}
        </Typography>
      );
    }

    if (posts.length === 0) {
      return (
        <Typography color="text.secondary" align="center" sx={{ mt: 5 }}>
          No posts yet. Be the first!
        </Typography>
      );
    }

    return posts.map((post) => (
      <PostCard key={post._id} post={post} />
    ));
  };

  // --- Main Component Return ---
  if (!user) {
    // If user is not logged in
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h4">Welcome to the Social App</Typography>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{ mr: 2, mt: 2 }}
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/signup"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </Box>
    );
  }

  // If user is logged in
  return (
    <Box>
      {/* 1. Create Post Form */}
      <CreatePost onNewPost={handleNewPost} />
      
      {/* 2. Post Feed */}
      {renderFeed()}
    </Box>
  );
};

export default HomePage;