import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToHome = () => {
    window.location.href = '/';
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
            Home
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-8 mt-4">
            Skill Swap Platform
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your email"
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
              />
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Login
            </button>

            <div className="text-center">
              <button className="text-indigo-600 hover:text-indigo-700 text-sm transition-colors">
                Forgot username/password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;