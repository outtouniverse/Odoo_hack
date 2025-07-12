import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SwapRequest, User } from '../types';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star, 
  MessageSquare, 
  User as UserIcon,
  Filter,
  Calendar,
  Trash2,
  Award,
  Loader2
} from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';
import { apiService } from '../services/api';

const SwapRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'completed'>('all');
  const [selectedSwapForFeedback, setSelectedSwapForFeedback] = useState<SwapRequest | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch swap requests and users from backend
  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching swap requests and users...');
      
      // Fetch swap requests
      const requests = await apiService.getSwaps();
      console.log('Fetched swap requests:', requests);
      
      // Fetch users
      const allUsers = await apiService.getUsers();
      console.log('Fetched users:', allUsers);
      
      // Process users to normalize data format
      const processedUsers = allUsers.map((u: any) => ({
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
      
      // Process swap requests to match expected format (similar to admin page)
      const processedRequests = requests.map((req: any) => {
        console.log('Processing swap request:', req);
        return {
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
        };
      });
      
      console.log('Processed requests:', processedRequests);
      console.log('Current user ID:', user?.id);
      console.log('Sample processed request:', processedRequests[0]);
      console.log('Sample processed user:', processedUsers[0]);
      
      // Debug: Check if any requests match the current user
      const matchingRequests = processedRequests.filter(req => 
        req.fromUserId === user?.id || req.toUserId === user?.id
      );
      console.log('Matching requests for current user:', matchingRequests);
      
      setSwapRequests(processedRequests);
      setUsers(processedUsers);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      setError(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const getFilteredRequests = () => {
    console.log('Filtering requests for user:', user?.id);
    console.log('All swap requests:', swapRequests);
    console.log('User object:', user);
    
    const userRequests = swapRequests.filter(req => {
        const reqUserId = req.toUserId;
        const fromUserId = req.fromUserId;
        
        console.log('Checking request:', {
          reqUserId,
          fromUserId,
          userId: user?.id,
          reqUserIdType: typeof reqUserId,
          fromUserIdType: typeof fromUserId,
          userIdType: typeof user?.id,
          activeTab,
          isReceived: reqUserId === user?.id,
          isSent: fromUserId === user?.id,
          reqUserIdStrict: reqUserId === user?.id,
          fromUserIdStrict: fromUserId === user?.id
        });
        
      if (activeTab === 'received') {
          return reqUserId === user?.id;
      } else {
          return fromUserId === user?.id;
      }
    });
    
    console.log('Filtered user requests:', userRequests);

    if (filterStatus === 'all') {
      return userRequests;
    }

    return userRequests.filter(req => req.status === filterStatus);
  };

  const updateRequestStatus = async (requestId: string, status: SwapRequest['status']) => {
    try {
      await apiService.updateSwap(requestId, { status });
      // Refresh data after update
      await fetchData();
    } catch (error: any) {
      console.error('Failed to update request status:', error);
      alert(`Failed to update request: ${error.message}`);
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      await apiService.deleteSwap(requestId);
      // Refresh data after deletion
      await fetchData();
    } catch (error: any) {
      console.error('Failed to delete request:', error);
      alert(`Failed to delete request: ${error.message}`);
    }
  };

  const markAsCompleted = async (requestId: string) => {
    await updateRequestStatus(requestId, 'completed');
  };

  const openFeedbackModal = (request: SwapRequest) => {
    setSelectedSwapForFeedback(request);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSuccess = async () => {
    // Refresh data after feedback
    await fetchData();
  };

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const filteredRequests = getFilteredRequests();

  const tabs = [
    { key: 'received', label: 'Received', count: swapRequests.filter(req => req.toUserId === user?.id).length },
    { key: 'sent', label: 'Sent', count: swapRequests.filter(req => req.fromUserId === user?.id).length }
  ];

  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'completed', label: 'Completed' }
  ];

  const getStatusColor = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'completed': return <Star className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Swap Requests</h1>
          <p className="mt-2 text-gray-600">Manage your skill exchange requests</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading swap requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterStatus(filter.key as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterStatus === filter.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Request List */}
          <div className="divide-y divide-gray-200">
            {!loading && !error && filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                const otherUser = getUserById(
                  activeTab === 'received' ? request.fromUserId : request.toUserId
                );

                if (!otherUser) return null;

                return (
                  <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          {otherUser.profilePhoto ? (
                            <img
                              src={otherUser.profilePhoto}
                              alt={otherUser.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{otherUser.name}</h3>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm text-gray-600">{otherUser.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 mb-1">
                              {activeTab === 'received' ? 'They Offer' : 'You Offer'}
                            </h4>
                            <p className="text-green-700">{request.skillOffered}</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-medium text-blue-800 mb-1">
                              {activeTab === 'received' ? 'They Want' : 'You Want'}
                            </h4>
                            <p className="text-blue-700">{request.skillRequested}</p>
                          </div>
                        </div>

                        {request.message && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-gray-800 mb-1">Message</h4>
                            <p className="text-gray-700">{request.message}</p>
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                          <div className={`flex items-center px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="ml-6 flex flex-col space-y-2">
                        {activeTab === 'received' && request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'accepted')}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center text-sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </button>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'rejected')}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center text-sm"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}

                        {activeTab === 'sent' && (request.status === 'pending' || request.status === 'rejected') && (
                          <button
                            onClick={() => deleteRequest(request.id)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center text-sm"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        )}

                        {request.status === 'accepted' && (
                          <button
                            onClick={() => markAsCompleted(request.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center text-sm"
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Mark Complete
                          </button>
                        )}

                        {request.status === 'completed' && (
                          <button
                            onClick={() => openFeedbackModal(request)}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center text-sm"
                          >
                            <Award className="h-4 w-4 mr-1" />
                            Leave Feedback
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : !loading && !error ? (
              <div className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} requests
                  {filterStatus !== 'all' && ` with status "${filterStatus}"`}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'received' 
                    ? "You haven't received any skill swap requests yet."
                    : "You haven't sent any skill swap requests yet."
                  }
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {selectedSwapForFeedback && (
        <FeedbackModal
          swapRequest={selectedSwapForFeedback}
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedSwapForFeedback(null);
          }}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  );
};

export default SwapRequestsPage;