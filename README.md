# Skill Swap Platform

A full-stack application for skill swapping between users, built with React frontend and Node.js backend.

TEAM MEMBER DETAILS:
TULIP JANI -- tkjani20@gmail.com
JINAL RATHVA -- jilu.jr11@gmail.com
AAKANKSHA BOSMIYA -- aakub1096@gmail.com




## Project Structure

```
Odoo_hack/
├── Backend/          # Node.js/Express backend
├── client/           # React frontend
└── README.md
```

## Features

- User authentication (login/register)
- User profile management
- Skill swapping functionality
- Real-time communication
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Odoo_hack/Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - The `config.env` file is already configured with MongoDB connection
   - JWT_SECRET is set for authentication
   - PORT is set to 5001

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5001`

### 2. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd Odoo_hack/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill

### Swaps
- `GET /api/swaps` - Get all swaps
- `POST /api/swaps` - Create new swap

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Register a new account or login with existing credentials
3. Browse available skills and users
4. Request skill swaps with other users

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

### Frontend
- React
- React Router for navigation
- Tailwind CSS for styling
- Context API for state management
- Fetch API for HTTP requests

## Development

- Backend runs on port 5001
- Frontend runs on port 3000
- CORS is configured to allow frontend-backend communication
- JWT tokens are stored in localStorage for authentication

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- Rate limiting
- CORS protection
- Helmet for security headers 