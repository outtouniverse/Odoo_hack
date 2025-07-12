import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  // State variables for the registration form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  // Function to navigate to the login page
  const goToLogin = () => {
    window.location.href = '/login';
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  // Function to handle form submission with API integration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = {
        email,
        password,
        name,
        ...(username && { username }) // Only include username if provided
      };

      console.log('Sending registration data:', userData);

      await register(userData);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('Validation failed') && error.details) {
        const validationErrors = error.details.map(err => err.msg).join(', ');
        setError(`Validation errors: ${validationErrors}`);
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-gray-500">User Registration page</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg relative">
          {/* Button to navigate to the login page */}
          <button
            onClick={goToHome}
            className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Back to Home
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-8 mt-4">
            Create Your Skill Swap Account
          </h1>

          {/* Registration form */}
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Name input field */}
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Username input field (optional as per backend, but included in UI) */}
            <div>
              <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username (Optional)</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Choose a username"
              />
            </div>

            {/* Email input field */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email"
                required // Mark as required as per backend
              />
            </div>

            {/* Password input field */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Create a password"
                required // Mark as required as per backend
              />
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={goToLogin}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
