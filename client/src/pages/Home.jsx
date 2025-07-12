import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated, logout } = useAuth();

  const goToLogin = () => {
    window.location.href = '/login';
  };

  const goToRegister = () => {
    window.location.href = '/register';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const users = [
    {
      id: 1,
      name: "Marc Demo",
      rating: "3.4/5",
      skillsOffered: ["React", "Node.js"],
      skillsWanted: ["Python", "Data Analysis"]
    },
    {
      id: 2,
      name: "Mitchell",
      rating: "2.5/5",
      skillsOffered: ["Photoshop", "UI Design"],
      skillsWanted: ["React", "Frontend Dev"]
    },
    {
      id: 3,
      name: "Joe Mills",
      rating: "4.0/5",
      skillsOffered: ["Python", "ML"],
      skillsWanted: ["React Native", "Mobile Dev"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Skill Swap Platform</h1>
            
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 font-medium">
                    Welcome, {user?.name || user?.email}!
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={goToLogin}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={goToRegister}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex gap-4">
            <select className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Availability ▼</option>
              <option>Weekdays</option>
              <option>Weekends</option>
              <option>Evenings</option>
            </select>
            
            <div className="flex-1 flex">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-l-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search skills..."
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-r-lg transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* User Cards */}
        <div className="space-y-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{user.name}</h3>
                    
                    <div className="mb-3">
                      <span className="text-green-600 text-sm font-semibold">Skills offered: </span>
                      <div className="inline-flex flex-wrap gap-2 mt-1">
                        {user.skillsOffered.map((skill, index) => (
                          <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-blue-600 text-sm font-semibold">Skills wanted: </span>
                      <div className="inline-flex flex-wrap gap-2 mt-1">
                        {user.skillsWanted.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <button 
                    onClick={goToLogin}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium mb-3 transition-colors"
                  >
                    Request
                  </button>
                  <div className="text-sm text-gray-500">
                    rating: {user.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
