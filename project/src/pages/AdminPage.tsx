import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, SwapRequest, AdminReport, Feedback } from '../types';
import { 
  Users, 
  Shield, 
  BarChart3, 
  MessageSquare, 
  Download,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Star,
  Trash2,
  Eye,
  Flag
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'swaps' | 'reports'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [report, setReport] = useState<AdminReport | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [showSwapDetails, setShowSwapDetails] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allSwaps = JSON.parse(localStorage.getItem('swapRequests') || '[]');
    const allFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    
    setUsers(allUsers);
    setSwapRequests(allSwaps);
    setFeedback(allFeedback);

    // Generate report
    const report: AdminReport = {
      totalUsers: allUsers.length,
      totalSwaps: allSwaps.length,
      pendingSwaps: allSwaps.filter((s: SwapRequest) => s.status === 'pending').length,
      completedSwaps: allSwaps.filter((s: SwapRequest) => s.status === 'completed').length,
      averageRating: allUsers.reduce((acc: number, u: User) => acc + u.rating, 0) / allUsers.length || 0,
      recentActivity: allSwaps.slice(-10).reverse()
    };
    
    setReport(report);
  };

  const banUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isBanned: true } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const unbanUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isBanned: false } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const deleteSwapRequest = (swapId: string) => {
    const updatedSwaps = swapRequests.filter(s => s.id !== swapId);
    setSwapRequests(updatedSwaps);
    localStorage.setItem('swapRequests', JSON.stringify(updatedSwaps));
  };

  const viewSwapDetails = (swap: SwapRequest) => {
    setSelectedSwap(swap);
    setShowSwapDetails(true);
  };

  const downloadReport = () => {
    const data = {
      users: users.length,
      swaps: swapRequests.length,
      feedback: feedback.length,
      report,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillswap-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'swaps', label: 'Swaps', icon: MessageSquare },
    { key: 'reports', label: 'Reports', icon: Download },
    { key: 'feedback', label: 'Feedback', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 text-purple-600 mr-3" />
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Manage users, monitor activity, and generate reports</p>
        </div>

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
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && report && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Users</p>
                        <p className="text-3xl font-bold">{report.totalUsers}</p>
                      </div>
                      <Users className="h-12 w-12 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Total Swaps</p>
                        <p className="text-3xl font-bold">{report.totalSwaps}</p>
                      </div>
                      <MessageSquare className="h-12 w-12 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100">Pending Swaps</p>
                        <p className="text-3xl font-bold">{report.pendingSwaps}</p>
                      </div>
                      <Clock className="h-12 w-12 text-yellow-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Avg Rating</p>
                        <p className="text-3xl font-bold">{report.averageRating.toFixed(1)}</p>
                      </div>
                      <Star className="h-12 w-12 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {report.recentActivity.slice(0, 5).map((activity: SwapRequest) => (
                      <div key={activity.id} className="flex items-center justify-between bg-white p-4 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Swap Request: {activity.skillOffered} ↔ {activity.skillRequested}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          activity.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          activity.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <div className="text-sm text-gray-600">
                    Total: {users.length} users
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Skills
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((targetUser) => (
                        <tr key={targetUser.id} className={targetUser.isBanned ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {targetUser.profilePhoto ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={targetUser.profilePhoto}
                                    alt={targetUser.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                      {targetUser.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {targetUser.name}
                                  {targetUser.isAdmin && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">{targetUser.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {targetUser.skillsOffered.length} offered
                            </div>
                            <div className="text-sm text-gray-500">
                              {targetUser.skillsWanted.length} wanted
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm text-gray-900">{targetUser.rating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              targetUser.isBanned 
                                ? 'bg-red-100 text-red-800' 
                                : targetUser.isPublic 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {targetUser.isBanned ? 'Banned' : targetUser.isPublic ? 'Active' : 'Private'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {!targetUser.isAdmin && (
                              <div className="flex space-x-2">
                                {targetUser.isBanned ? (
                                  <button
                                    onClick={() => unbanUser(targetUser.id)}
                                    className="text-green-600 hover:text-green-900 flex items-center"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Unban
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => banUser(targetUser.id)}
                                    className="text-red-600 hover:text-red-900 flex items-center"
                                  >
                                    <Ban className="h-4 w-4 mr-1" />
                                    Ban
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Swaps Tab */}
            {activeTab === 'swaps' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Swap Management</h3>
                  <div className="text-sm text-gray-600">
                    Total: {swapRequests.length} swaps
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-800">
                      {swapRequests.filter(s => s.status === 'pending').length}
                    </div>
                    <div className="text-sm text-yellow-600">Pending</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-800">
                      {swapRequests.filter(s => s.status === 'accepted').length}
                    </div>
                    <div className="text-sm text-green-600">Accepted</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-800">
                      {swapRequests.filter(s => s.status === 'completed').length}
                    </div>
                    <div className="text-sm text-blue-600">Completed</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-800">
                      {swapRequests.filter(s => s.status === 'rejected').length}
                    </div>
                    <div className="text-sm text-red-600">Rejected</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {swapRequests.slice(0, 10).map((swap) => {
                    const fromUser = users.find(u => u.id === swap.fromUserId);
                    const toUser = users.find(u => u.id === swap.toUserId);

                    return (
                      <div key={swap.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              <span className="font-medium">{fromUser?.name}</span>
                              <span className="text-gray-500"> → </span>
                              <span className="font-medium">{toUser?.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {swap.status}
                            </span>
                            <button
                              onClick={() => viewSwapDetails(swap)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteSwapRequest(swap.id)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete Request"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Offered Skill</p>
                            <p className="text-sm text-gray-900">{swap.skillOffered}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Requested Skill</p>
                            <p className="text-sm text-gray-900">{swap.skillRequested}</p>
                          </div>
                        </div>
                        {swap.message && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{swap.message}</p>
                          </div>
                        )}
                        <div className="mt-4 text-xs text-gray-500">
                          Created: {new Date(swap.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Feedback Management</h3>
                  <div className="text-sm text-gray-600">
                    Total: {feedback.length} reviews
                  </div>
                </div>

                <div className="space-y-4">
                  {feedback.length > 0 ? (
                    feedback.slice(0, 20).map((review) => {
                      const fromUser = users.find(u => u.id === review.fromUserId);
                      const toUser = users.find(u => u.id === review.toUserId);
                      const relatedSwap = swapRequests.find(s => s.id === review.swapId);

                      return (
                        <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {fromUser?.name} → {toUser?.name}
                                </p>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">
                                    {review.rating}/5
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                title="Flag as inappropriate"
                              >
                                <Flag className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                title="Delete feedback"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {review.comment && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{review.comment}</p>
                            </div>
                          )}
                          
                          {relatedSwap && (
                            <div className="text-xs text-gray-500">
                              Swap: {relatedSwap.skillOffered} ↔ {relatedSwap.skillRequested}
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500 mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p>No feedback submitted yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Platform Reports</h3>
                  <button
                    onClick={downloadReport}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Platform Statistics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Users</span>
                        <span className="font-medium">{report?.totalUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Users</span>
                        <span className="font-medium">{users.filter(u => !u.isBanned).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Banned Users</span>
                        <span className="font-medium text-red-600">{users.filter(u => u.isBanned).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Swaps</span>
                        <span className="font-medium">{report?.totalSwaps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed Swaps</span>
                        <span className="font-medium text-green-600">{report?.completedSwaps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Rating</span>
                        <span className="font-medium">{report?.averageRating.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Feedback</span>
                        <span className="font-medium">{feedback.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                          <div>
                            <div className="font-medium">Send Platform Message</div>
                            <div className="text-sm text-gray-500">Notify all users</div>
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 text-blue-500 mr-3" />
                          <div>
                            <div className="font-medium">View Analytics</div>
                            <div className="text-sm text-gray-500">Detailed platform metrics</div>
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <Download className="h-5 w-5 text-green-500 mr-3" />
                          <div>
                            <div className="font-medium">Export Data</div>
                            <div className="text-sm text-gray-500">Download user activity logs</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swap Details Modal */}
      {selectedSwap && showSwapDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Swap Request Details</h2>
              <button
                onClick={() => setShowSwapDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">From User</h3>
                  <p className="text-gray-700">{users.find(u => u.id === selectedSwap.fromUserId)?.name}</p>
                  <p className="text-sm text-gray-500">{users.find(u => u.id === selectedSwap.fromUserId)?.email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">To User</h3>
                  <p className="text-gray-700">{users.find(u => u.id === selectedSwap.toUserId)?.name}</p>
                  <p className="text-sm text-gray-500">{users.find(u => u.id === selectedSwap.toUserId)?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Skill Offered</h3>
                  <p className="text-green-700">{selectedSwap.skillOffered}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Skill Requested</h3>
                  <p className="text-blue-700">{selectedSwap.skillRequested}</p>
                </div>
              </div>
              
              {selectedSwap.message && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Message</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedSwap.message}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedSwap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedSwap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    selectedSwap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedSwap.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <p className="text-gray-600">{new Date(selectedSwap.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Updated:</span>
                  <p className="text-gray-600">{new Date(selectedSwap.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => deleteSwapRequest(selectedSwap.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Request
                </button>
                <button
                  onClick={() => setShowSwapDetails(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;