// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Body Parser Middleware
app.use(express.json()); // To accept JSON data in the body
app.use(express.urlencoded({ extended: false })); // To accept form data

// Simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/users', require('./routes/userRoutes'));
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));