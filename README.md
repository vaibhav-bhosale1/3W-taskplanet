# Social App

This project is a full-stack MERN (MongoDB, Express, React, Node.js) social media application. It provides a platform for users to register, log in, create posts with text and images, and interact with other users' posts by liking and commenting.

## Features

  * **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens) and password hashing with `bcryptjs`.
  * **Create Posts:** Authenticated users can create new posts containing text, an image URL, or both.
  * **View Feed:** A central homepage feed that displays all posts from all users, sorted by the newest first.
  * **Like/Unlike Posts:** Authenticated users can like a post. Clicking the like button again will unlike it.
  * **Comment on Posts:** Authenticated users can add comments to any post.
  * **Client-Side Routing:** Uses `react-router-dom` for seamless navigation between the Home, Login, and Signup pages.
  * **Global Auth State:** Manages user authentication state globally using React Context.

## Tech Stack

### Backend

  * **Node.js**
  * **Express**: Web framework for building the REST API.
  * **MongoDB (Mongoose)**: NoSQL database for storing user and post data.
  * **jsonwebtoken**: For creating and verifying user authentication tokens.
  * **bcryptjs**: For hashing user passwords before saving to the database.
  * **CORS**: For enabling cross-origin requests from the frontend.
  * **dotenv**: For managing environment variables.

### Frontend

  * **React**
  * **React Router**: For client-side routing.
  * **React Context**: For global state management (specifically for authentication).
  * **Material-UI (MUI)**: For UI components and styling.
  * **Axios**: For making HTTP requests to the backend API.
  * **date-fns**: For formatting post creation timestamps (e.g., "2 hours ago").

-----

## Getting Started

### Prerequisites

  * **Node.js** (v14 or later)
  * **MongoDB**: A running instance of MongoDB (either local or a cloud-based service like MongoDB Atlas).

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone [your-repository-url]
    cd 3W-taskplanet-9b083cc808bdc999baea3446f3313d5231329a99
    ```

2.  **Set up the Backend:**

      * Navigate to the backend directory:
        ```sh
        cd backend
        ```
      * Install backend dependencies:
        ```sh
        npm install
        ```
      * Create a `.env` file in the `backend` directory and add the following variables:
        ```env
        # Your MongoDB connection string
        MONGO_URI=mongodb+srv://...

        # A strong secret for signing JWTs
        JWT_SECRET=mysecret

        # The port the backend server will run on
        PORT=5001
        ```
      * Run the backend server. The `package.json` includes `nodemon` as a dependency, so you can run:
        ```sh
        nodemon server.js
        ```
      * *Alternatively*, you can just use node:
        ```sh
        node server.js
        ```
      * The server should now be running on `http://localhost:5001`.

3.  **Set up the Frontend:**

      * Open a new terminal and navigate to the client directory:
        ```sh
        cd client
        ```
      * Install frontend dependencies:
        ```sh
        npm install
        ```
      * **Important:** The client is currently configured to make API requests to a deployed backend (`https://threew-taskplanet.onrender.com`). For local development, you must update these API URLs in the following files to point to your local backend server (`http://localhost:5001`):
          * `client/src/context/AuthContext.js` (for login/register)
          * `client/src/pages/HomePages.js` (for fetching posts)
          * `client/src/components/CreatePost.js` (for creating posts)
          * `client/src/components/PostCard.js` (for liking/commenting)
      * Start the React development server:
        ```sh
        npm start
        ```
      * The application should now be open and running in your browser at `http://localhost:3000`.

-----

## Available Scripts (Client)

In the `client` directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view it.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

-----

## API Endpoints

All API routes are prefixed with `/api`.

### User Routes (`/api/users`)

  * `POST /register`: Register a new user.
      * **Body:** `{ "username", "email", "password" }`
  * `POST /login`: Authenticate a user and get a token.
      * **Body:** `{ "email", "password" }`

### Post Routes (`/api/posts`)

  * `GET /`: Get all posts, sorted by newest. (Public)
  * `POST /`: Create a new post. (Protected)
      * **Headers:** `Authorization: Bearer <token>`
      * **Body:** `{ "text", "image" }`
  * `PUT /:id/like`: Like or unlike a post. (Protected)
      * **Headers:** `Authorization: Bearer <token>`
  * `POST /:id/comment`: Comment on a post. (Protected)
      * **Headers:** `Authorization: Bearer <token>`
      * **Body:** `{ "text" }`

-----

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection logic
│   ├── controllers/
│   │   ├── postController.js   # Logic for post operations
│   │   └── userController.js   # Logic for user registration/login
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT token validation middleware
│   ├── models/
│   │   ├── postModel.js        # Mongoose schema for Posts
│   │   └── userModel.js        # Mongoose schema for Users
│   ├── routes/
│   │   ├── postRoutes.js       # API routes for posts
│   │   └── userRoutes.js       # API routes for users
│   ├── .env                    # Environment variables (local)
│   ├── .gitignore              # Backend gitignore
│   ├── package.json            # Backend dependencies
│   └── server.js               # Express server entry point
│
└── client/
    ├── public/
    │   ├── index.html          # Main HTML template
    │   ├── favicon.ico         # App icon
    │   └── ...
    ├── src/
    │   ├── components/
    │   │   ├── CreatePost.js   # Component for new post form
    │   │   ├── Header.js       # Navigation bar component
    │   │   └── PostCard.js     # Component for displaying a single post
    │   ├── context/
    │   │   └── AuthContext.js  # React Context for auth state
    │   ├── pages/
    │   │   ├── HomePages.js    # Main feed page
    │   │   ├── LoginPage.js    # User login page
    │   │   └── SignupPage.js   # User registration page
    │   ├── App.js              # Main app component with routing
    │   ├── index.js            # React entry point
    │   └── ...
    ├── .gitignore              # Frontend gitignore
    ├── package.json            # Frontend dependencies
    └── README.md               # Original Create React App README
```
