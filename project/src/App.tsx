import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import BrowseSkillsPage from './pages/BrowseSkillsPage';
import SwapRequestsPage from './pages/SwapRequestsPage';
import AdminPage from './pages/AdminPage';

// Demo data initialization
const initializeDemoData = () => {
  const users = localStorage.getItem('users');
  if (!users) {
    const demoUsers = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@skillswap.com',
        password: 'password',
        location: 'San Francisco, CA',
        profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        skillsOffered: ['JavaScript', 'React', 'Node.js', 'Python'],
        skillsWanted: ['Machine Learning', 'UI/UX Design'],
        availability: ['Weekday Evenings (6PM-9PM)', 'Weekend Afternoons (1PM-5PM)'],
        isPublic: true,
        rating: 4.9,
        completedSwaps: 25,
        joinedDate: '2024-01-15T00:00:00.000Z',
        isAdmin: true,
        isBanned: false
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'user@skillswap.com',
        password: 'password',
        location: 'New York, NY',
        profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        skillsOffered: ['Photography', 'Photoshop', 'Video Editing'],
        skillsWanted: ['Web Development', 'Spanish'],
        availability: ['Weekends', 'Flexible Schedule'],
        isPublic: true,
        rating: 4.7,
        completedSwaps: 12,
        joinedDate: '2024-02-01T00:00:00.000Z',
        isAdmin: false,
        isBanned: false
      },
      {
        id: '3',
        name: 'Michael Chen',
        email: 'michael@skillswap.com',
        password: 'password',
        location: 'Los Angeles, CA',
        profilePhoto: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        skillsOffered: ['Guitar', 'Music Theory', 'Audio Production'],
        skillsWanted: ['Photography', 'Digital Marketing'],
        availability: ['Weekend Evenings (6PM-9PM)', 'By Appointment Only'],
        isPublic: true,
        rating: 4.8,
        completedSwaps: 8,
        joinedDate: '2024-02-15T00:00:00.000Z',
        isAdmin: false,
        isBanned: false
      }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));
  }

  const swapRequests = localStorage.getItem('swapRequests');
  if (!swapRequests) {
    const demoRequests = [
      {
        id: '1',
        fromUserId: '2',
        toUserId: '1',
        skillOffered: 'Photography',
        skillRequested: 'React',
        message: 'Hi! I\'d love to learn React from you. I can teach you photography basics in return.',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        fromUserId: '3',
        toUserId: '2',
        skillOffered: 'Guitar',
        skillRequested: 'Photoshop',
        message: 'Would you be interested in trading guitar lessons for Photoshop tutorials?',
        status: 'accepted',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('swapRequests', JSON.stringify(demoRequests));
  }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/browse" element={<ProtectedRoute><BrowseSkillsPage /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><SwapRequestsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;