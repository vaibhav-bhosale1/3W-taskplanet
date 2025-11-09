// client/src/pages/HomePage.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CreatePost from '../components/CreatePost'; // Import CreatePost

const HomePage = () => {
  const { user } = useContext(AuthContext);

  const handleNewPost = (post) => {
    // This function will add the new post to our feed's state
    // We will implement this fully in the next step.
    console.log('New post created:', post);
  };

  if (!user) {
    // If user is not logged in, show welcome/login message
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

  // If user is logged in, show the CreatePost component
  // and (soon) the post feed.
  return (
    <Box>
      <CreatePost onNewPost={handleNewPost} />
      
      {/* We will add the PostFeed component here in the next step */}
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Your post feed will appear here.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;