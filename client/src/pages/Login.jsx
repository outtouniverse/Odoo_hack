import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const goToHome = () => {
    window.location.href = '/';
  };

  const goToRegister = () => {
    window.location.href = '/register';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-xl text-gray-600 mb-2">Screen 2</h2>
          <p className="text-gray-500">User Login page</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg relative">
          <button 
            onClick={goToHome}
            className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm transition-colors"
          >
            Back to Home
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-8 mt-4">
            Skill Swap Platform
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center mt-4">
              <button className="text-indigo-600 hover:text-indigo-700 text-sm transition-colors">
                Forgot username/password
              </button>
              <p className="text-gray-600 text-sm mt-2">
                Don't have an account?{' '}
                <button
                  onClick={goToRegister}
                  className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
