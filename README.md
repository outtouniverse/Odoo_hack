# Skill Swap Platform - Full Stack Application

A modern skill exchange platform built with React TypeScript frontend and Node.js Express backend with MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `config.env` and update with your MongoDB URI
   - Update JWT_SECRET for production

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables (`Backend/config.env`)
```
PORT=5001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
MONGO_URI=your-mongodb-connection-string
```

### Frontend Configuration
The frontend is configured to connect to `http://localhost:5001/api` by default.

## 🏗️ Architecture

### Backend Structure
```
Backend/
├── config/
│   ├── db.js          # Database connection
│   └── config.env     # Environment variables
├── middleware/
│   ├── auth.js        # JWT authentication
│   └── validation.js  # Request validation
├── models/
│   ├── User.js        # User model
│   ├── Skill.js       # Skill model
│   └── Swap.js        # Swap model
├── routes/
│   ├── auth.js        # Authentication routes
│   ├── users.js       # User management
│   ├── skills.js      # Skill management
│   └── swaps.js       # Swap management
└── server.js          # Main server file
```

### Frontend Structure
```
project/
├── src/
│   ├── components/    # Reusable components
│   ├── contexts/      # React contexts
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── types/         # TypeScript types
└── package.json
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **Registration**: Creates new user account
- **Login**: Authenticates user and returns JWT token
- **Token Storage**: JWT stored in localStorage
- **Auto-refresh**: Token automatically included in API requests
- **Logout**: Clears token from localStorage

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Swaps
- `GET /api/swaps` - Get all swaps
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id` - Update swap
- `DELETE /api/swaps/:id` - Delete swap

## 🛡️ Security Features

- **CORS**: Configured for development and production
- **Rate Limiting**: Prevents abuse
- **Input Validation**: All inputs validated
- **Password Hashing**: bcrypt for password security
- **JWT Authentication**: Secure token-based auth
- **Helmet**: Security headers
- **MongoDB**: NoSQL database with validation

## 🧪 Testing

### Backend Testing
```bash
cd Backend
node test-connection.js
```

### Frontend Testing
The frontend includes comprehensive error handling and loading states.

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Update CORS origins
3. Use environment variables for secrets
4. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on port 5001
   - Check CORS configuration in `server.js`

2. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token expiration

3. **Database Connection**
   - Verify MongoDB URI is correct
   - Check network connectivity

4. **Port Conflicts**
   - Backend: 5001
   - Frontend: 5173
   - Ensure ports are available

### Debug Mode
- Backend includes debug endpoint: `GET /api/debug`
- Frontend includes comprehensive error logging

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check console logs for errors
4. Verify environment configuration 