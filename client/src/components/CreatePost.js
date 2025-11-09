// client/src/components/CreatePost.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; // Icon

const CreatePost = ({ onNewPost }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(''); // We'll just use a text field for image URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !image) {
      setError('Please add text or an image URL.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Get the token from our user object
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const newPost = {
        text,
        image,
      };

      // Send the post to the backend
      const { data } = await axios.post(
        'http://localhost:5001/api/posts',
        newPost,
        config
      );

      // Call the function passed from HomePage to add this post to the feed
      onNewPost(data); 
      
      // Reset form
      setText('');
      setImage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 1.5, bgcolor: 'primary.main' }}>
            {user.username?.charAt(0).toUpperCase()}
          </Avatar>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={`What's on your mind, ${user.username}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            rows={2}
          />
        </Box>
        
        {/* This is a simple text field for image URL */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Got an image? Paste the URL here."
          value={image}
          onChange={(e) => setImage(e.target.value)}
          size="small"
          sx={{ mb: 1.5 }}
          InputProps={{
            startAdornment: <PhotoCameraIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || (!text && !image)}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePost;