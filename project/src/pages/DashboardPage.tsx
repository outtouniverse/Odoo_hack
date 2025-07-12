import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { SwapRequest, User } from '../types';
import { 
  Users, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  BookOpen, 
  Calendar,
  ArrowRight,
  User as UserIcon,
  Award,
  Loader2
} from 'lucide-react';
import SkillTag from '../components/SkillTag';
import { apiService } from '../services/api';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch swap requests from API
      const requests = await apiService.getSwaps();
      
      // Process swap requests to match expected format
      const processedRequests = requests.map((req: any) => ({
        ...req,
        id: req._id || req.id,
        fromUserId: req.fromUserId || req.fromUser?._id?.toString() || req.fromUser?.toString() || req.fromUser || 'Unknown',
        toUserId: req.toUserId || req.toUser?._id?.toString() || req.toUser?.toString() || req.toUser || 'Unknown',
        skillOffered: req.skillOffered || req.offeredSkill?.name || req.offeredSkill || 'Unknown Skill',
        skillRequested: req.skillRequested || req.requestedSkill?.name || req.requestedSkill || 'Unknown Skill',
        status: req.status || 'pending',
        message: req.message || '',
        createdAt: req.createdAt || new Date(),
        updatedAt: req.updatedAt || new Date()
      }));
      
      // Filter requests for current user
      const userRequests = processedRequests.filter((req: SwapRequest) => 
        req.fromUserId === user.id || req.toUserId === user.id
      );
      
      setSwapRequests(userRequests);

      // Fetch users for recommendations
      const users = await apiService.getUsers();
      
      // Process users to normalize data format
      const processedUsers = users.map((u: any) => ({
        ...u,
        id: u._id || u.id,
        name: u.name || 'Unknown User',
        email: u.email || 'No email',
        rating: u.rating || 5.0,
        isBanned: u.isBanned || false,
        isAdmin: u.isAdmin || false,
        isPublic: u.isPublic !== false,
        skillsOffered: Array.isArray(u.skillsOffered) 
          ? u.skillsOffered.map((skill: any) => typeof skill === 'string' ? skill : skill.name || 'Unknown Skill')
          : [],
        skillsWanted: Array.isArray(u.skillsWanted) 
          ? u.skillsWanted.map((skill: any) => typeof skill === 'string' ? skill : skill.name || 'Unknown Skill')
          : [],
        availability: Array.isArray(u.availability) 
          ? u.availability 
          : typeof u.availability === 'string'
            ? u.availability.split(', ').filter((item: string) => item.trim() !== '')
            : [],
        profilePhoto: u.profilePhoto || '',
        completedSwaps: u.completedSwaps || 0
      })) as User[];
      
      setAllUsers(processedUsers.filter((u: User) => u.id !== user.id && u.isPublic && !u.isBanned));
    } catch (error: any) {
      setError(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (!user) return null;

  const pendingRequests = swapRequests.filter(req => req.status === 'pending');
  const recentActivity = swapRequests.slice(0, 5);

  // Find skill recommendations
  const skillRecommendations = allUsers.filter(otherUser => 
    user.skillsWanted.some(wantedSkill => 
      otherUser.skillsOffered.some(offeredSkill => 
        offeredSkill.toLowerCase().includes(wantedSkill.toLowerCase())
      )
    )
  ).slice(0, 3);

  const statsCards = [
    {
      title: 'Skills Offered',
      value: user.skillsOffered.length,
      icon: BookOpen,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Skills Wanted',
      value: user.skillsWanted.length,
      icon: TrendingUp,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Requests',
      value: loading ? '...' : pendingRequests.length,
      icon: MessageSquare,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Rating',
      value: `${user.rating.toFixed(1)}★`,
      icon: Star,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your skill swaps today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/browse"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <Users className="h-8 w-8 text-blue-500 group-hover:text-blue-600" />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Browse Skills</p>
                    <p className="text-sm text-gray-500">Find new learning opportunities</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
                >
                  <UserIcon className="h-8 w-8 text-green-500 group-hover:text-green-600" />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Update Profile</p>
                    <p className="text-sm text-gray-500">Add skills and availability</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={fetchData}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Refresh'
                    )}
                  </button>
                  <Link to="/requests" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-3" />
                  <p className="text-gray-600">Loading recent activity...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">
                  <p>{error}</p>
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((request) => {
                    const isReceived = request.toUserId === user.id;
                    const otherUser = allUsers.find(u => 
                      isReceived ? u.id === request.fromUserId : u.id === request.toUserId
                    );
                    
                    return (
                      <div key={request.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            {otherUser?.profilePhoto ? (
                              <img
                                src={otherUser.profilePhoto}
                                alt={otherUser.name}
                                className="h-6 w-6 rounded-full object-cover mr-2"
                              />
                            ) : (
                              <div className="h-6 w-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-2">
                                <UserIcon className="h-3 w-3 text-white" />
                              </div>
                            )}
                            <p className="text-sm font-medium text-gray-900">
                              {isReceived ? 'You received a request' : 'You sent a request'} from{' '}
                              <span className="text-blue-600">{otherUser?.name || 'Unknown User'}</span>
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="text-green-600">{request.skillOffered}</span> for{' '}
                            <span className="text-blue-600">{request.skillRequested}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start browsing skills to get connected!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Completion */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills Offered</span>
                  <span className={`text-sm font-medium ${user.skillsOffered.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {user.skillsOffered.length > 0 ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills Wanted</span>
                  <span className={`text-sm font-medium ${user.skillsWanted.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {user.skillsWanted.length > 0 ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Availability</span>
                  <span className={`text-sm font-medium ${user.availability && user.availability.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {user.availability && user.availability.length > 0 ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>

              {(user.skillsOffered.length === 0 || user.skillsWanted.length === 0 || !user.availability || user.availability.length === 0) && (
                <Link
                  to="/profile"
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors text-center block"
                >
                  Complete Profile
                </Link>
              )}
            </div>

            {/* Skill Recommendations */}
            {skillRecommendations.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
                
                <div className="space-y-4">
                  {skillRecommendations.map((recommendedUser) => (
                    <div key={recommendedUser.id} className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                      <div className="flex items-center mb-2">
                        {recommendedUser.profilePhoto ? (
                          <img
                            src={recommendedUser.profilePhoto}
                            alt={recommendedUser.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">{recommendedUser.name}</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 mr-1" />
                            <span className="text-xs text-gray-500">{recommendedUser.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Offers:</p>
                          <div className="flex flex-wrap gap-1">
                            {recommendedUser.skillsOffered.slice(0, 2).map((skill, index) => (
                              <SkillTag key={index} skill={skill} variant="offered" size="sm" />
                            ))}
                            {recommendedUser.skillsOffered.length > 2 && (
                              <span className="text-xs text-gray-500">+{recommendedUser.skillsOffered.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/browse?user=${recommendedUser.id}`}
                        className="mt-3 w-full bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors text-center block"
                      >
                        View Profile
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Recommendations Message */}
            {!loading && allUsers.length > 0 && skillRecommendations.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Recommendations</h3>
                <div className="text-center py-4 text-gray-500">
                  <Users className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm">No specific recommendations yet</p>
                  <p className="text-xs">Try browsing skills to find matches!</p>
                </div>
              </div>
            )}

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <Award className="h-8 w-8 text-yellow-300" />
                <div className="ml-3">
                  <h3 className="font-semibold">Skill Explorer</h3>
                  <p className="text-sm text-purple-100">Keep growing your network!</p>
                </div>
              </div>
              <p className="text-sm text-purple-100">
                You've completed {user.completedSwaps} skill swaps. 
                {user.completedSwaps < 5 && ` ${5 - user.completedSwaps} more to unlock the next badge!`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;