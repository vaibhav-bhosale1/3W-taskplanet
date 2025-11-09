// client/src/components/PostCard.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Collapse, // For expanding comments
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Liked
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Not liked
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { formatDistanceToNow } from 'date-fns'; // For "2 hours ago"

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);

  // --- State ---
  // We initialize the state from the post prop
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false); // To toggle comment section
  
  // --- Check if user has already liked the post ---
  // .some() returns true if any element in the array passes the test
  const isLiked = user ? likes.some((like) => like.user === user._id) : false;

  // --- API Request Config ---
  // We need this for all protected requests (like, comment)
  const getAuthConfig = () => {
    if (!user) throw new Error('User not authenticated');
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
  };

  // --- Like/Unlike Handler ---
  const handleLike = async () => {
    if (!user) return; // Or redirect to login

    try {
      const config = getAuthConfig();
      // API returns the new array of likes
      const { data } = await axios.put(
        `http://localhost:5001/api/posts/${post._id}/like`,
        {}, // Empty body
        config
      );
      setLikes(data); // Update the state
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  // --- Comment Handler ---
  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !commentText) return;

    try {
      const config = getAuthConfig();
      // API returns the new array of comments
      const { data } = await axios.post(
        `http://localhost:5001/api/posts/${post._id}/comment`,
        { text: commentText },
        config
      );
      setComments(data); // Update comments state
      setCommentText(''); // Clear input
      setShowComments(true); // Ensure comments are visible
    } catch (err) {
      console.error('Comment failed', err);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      {/* Post Header */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="user">
            {post.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={post.username}
        subheader={
          post.createdAt
            ? `${formatDistanceToNow(new Date(post.createdAt))} ago`
            : 'Just now'
        }
      />

      {/* Post Image (if it exists) */}
      {post.image && (
        <CardMedia
          component="img"
          height="300"
          image={post.image}
          alt="Post image"
          sx={{ objectFit: 'contain' }} // Use contain to see whole image
        />
      )}

      {/* Post Text (if it exists) */}
      {post.text && (
        <CardContent>
          <Typography variant="body1" color="text.primary">
            {post.text}
          </Typography>
        </CardContent>
      )}

      {/* Like/Comment Buttons and Counts */}
      <CardActions disableSpacing sx={{ pt: 0 }}>
        <IconButton aria-label="like post" onClick={handleLike} disabled={!user}>
          {isLiked ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        <Typography variant="body2">{likes.length}</Typography>

        <IconButton
          aria-label="show comments"
          onClick={() => setShowComments(!showComments)}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2">{comments.length}</Typography>
      </CardActions>

      {/* Comment Section (Collapsible) */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent>
          {/* Form to add a new comment */}
          {user && (
            <Box component="form" onSubmit={handleComment} sx={{ mb: 2, display: 'flex' }}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" size="small" sx={{ ml: 1 }}>
                Post
              </Button>
            </Box>
          )}

          {/* List of existing comments */}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Box key={comment._id || comment.date} sx={{ mb: 1.5 }}>
                <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                  {comment.username}
                </Typography>{' '}
                <Typography variant="body2" component="span">
                  {comment.text}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PostCard;