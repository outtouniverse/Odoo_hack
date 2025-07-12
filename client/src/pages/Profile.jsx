import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    location: '',
    availability: '',
    isPublic: true
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user && user._id) {
        try {
          setLoading(true);
          setError('');
          const response = await apiService.getUserProfile(user._id);
          setProfileData(response);
          setFormData({
            name: response.name || '',
            email: response.email || '',
            username: response.username || '',
            location: response.location || '',
            availability: response.availability || '',
            isPublic: response.isPublic !== undefined ? response.isPublic : true
          });
        } catch (err) {
          console.error('Failed to fetch profile data:', err);
          setError(err.message || 'Failed to load profile data. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfileData();
    }
  }, [user, authLoading]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Only send updatable fields to the backend (matching your API)
      const updateData = {
        name: formData.name,
        location: formData.location,
        availability: formData.availability,
        isPublic: formData.isPublic
      };

      // Use your existing updateProfile method
      const response = await apiService.updateProfile(updateData);
      
      // Update local state with the response
      setProfileData(response);
      setFormData({
        name: response.name || '',
        email: response.email || '',
        username: response.username || '',
        location: response.location || '',
        availability: response.availability || '',
        isPublic: response.isPublic !== undefined ? response.isPublic : true
      });
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original profile data
    setFormData({
      name: profileData.name || '',
      email: profileData.email || '',
      username: profileData.username || '',
      location: profileData.location || '',
      availability: profileData.availability || '',
      isPublic: profileData.isPublic !== undefined ? profileData.isPublic : true
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const navigateToHome = () => {
    window.location.href = '/';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="animate-pulse absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 mx-auto"></div>
          </div>
          <p className="text-slate-700 text-lg font-medium mt-6">Loading your profile...</p>
          <p className="text-slate-500 text-sm mt-2">This won't take long</p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome!</h3>
          <p className="text-gray-600 mb-6">Please log in to view and manage your profile.</p>
          <button
            onClick={navigateToHome}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="mb-8">
          <button
            onClick={navigateToHome}
            className="group flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            <svg className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </button>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-10 transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-10 transform -translate-x-24 translate-y-24"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{profileData.name || 'User Profile'}</h1>
                    <p className="text-indigo-100 text-lg">
                      {profileData.isPublic ? 'Public Profile' : 'Private Profile'}
                    </p>
                  </div>
                </div>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 border border-white border-opacity-30"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Profile</span>
                  </div>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <div className="flex items-center space-x-2">
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </div>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 border border-white border-opacity-30"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          <div className="px-8 pt-6">
            {success && (
              <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl flex items-center shadow-sm">
                <div className="bg-green-500 rounded-full p-1 mr-3">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">{success}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl flex items-center shadow-sm">
                <div className="bg-red-500 rounded-full p-1 mr-3">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="bg-indigo-100 rounded-xl p-2 mr-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Personal Information
                </h2>

                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                      <p className="text-gray-900 font-medium">{profileData.name || 'Not provided'}</p>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <p className="text-gray-900 font-medium">{profileData.email || 'Not provided'}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Username</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <p className="text-gray-900 font-medium">{profileData.username || 'Not set'}</p>
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your location"
                    />
                  ) : (
                    <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                      <p className="text-gray-900 font-medium">{profileData.location || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings & Preferences */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="bg-purple-100 rounded-xl p-2 mr-3">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Settings & Preferences
                </h2>

                {/* Availability */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Availability</label>
                  {isEditing ? (
                    <textarea
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                      placeholder="Describe your availability (e.g., Weekends, evenings, flexible schedule...)"
                    />
                  ) : (
                    <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 min-h-[100px]">
                      <p className="text-gray-900 font-medium">{profileData.availability || 'Not provided'}</p>
                    </div>
                  )}
                </div>

                {/* Profile Privacy */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Profile Visibility</label>
                  {isEditing ? (
                    <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPublic"
                          checked={formData.isPublic}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                        />
                        <div>
                          <span className="text-gray-900 font-medium">Make my profile public</span>
                          <p className="text-xs text-gray-500">Allow other users to find and view your profile</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${profileData.isPublic ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-gray-900 font-medium">
                          {profileData.isPublic ? 'Public Profile' : 'Private Profile'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Info */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Role</span>
                      <span className="text-sm font-medium text-gray-900 bg-white px-3 py-1 rounded-lg capitalize">
                        {profileData.role || 'user'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${profileData.banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {profileData.banned ? 'Banned' : 'Active'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Member Since</span>
                      <span className="text-sm text-gray-900">
                        {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Not available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Skills Offered */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <div className="bg-white bg-opacity-20 rounded-xl p-2 mr-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Skills I Offer
              </h2>
              <p className="text-emerald-100 mt-2">Services and expertise you provide</p>
            </div>
            
            <div className="p-8">
              {profileData.skillsOffered && profileData.skillsOffered.length > 0 ? (
                <div className="space-y-4">
                  {profileData.skillsOffered.map((skill) => (
                    <div key={skill._id} className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-emerald-800 text-lg">{skill.name}</h3>
                        <span className="text-xs bg-emerald-200 text-emerald-700 px-3 py-1 rounded-full font-medium">
                          {skill.type}
                        </span>
                      </div>
                      <p className="text-emerald-700">{skill.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No skills offered yet</p>
                  <p className="text-gray-400 text-sm mt-1">Add skills to showcase your expertise</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <div className="bg-white bg-opacity-20 rounded-xl p-2 mr-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Skills I Want to Learn
              </h2>
              <p className="text-blue-100 mt-2">Skills and knowledge you're seeking</p>
            </div>
            
            <div className="p-8">
              {profileData.skillsWanted && profileData.skillsWanted.length > 0 ? (
                <div className="space-y-4">
                  {profileData.skillsWanted.map((skill) => (
                    <div key={skill._id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-blue-800 text-lg">{skill.name}</h3>
                        <span className="text-xs bg-blue-200 text-blue-700 px-3 py-1 rounded-full font-medium">
                          {skill.type}
                        </span>
                      </div>
                      <p className="text-blue-700">{skill.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No skills wanted yet</p>
                  <p className="text-gray-400 text-sm mt-1">Add skills you'd like to learn</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-500 text-sm">
              Last updated: {profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Not available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;