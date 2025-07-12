import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const DebugPage: React.FC = () => {
  const { user } = useAuth();
  const [swapRequests, setSwapRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Current user:', user);
      
      // Fetch swap requests
      const requests = await apiService.getSwaps();
      console.log('Raw swap requests from API:', requests);
      setSwapRequests(requests);
      
      // Fetch users
      const allUsers = await apiService.getUsers();
      console.log('Raw users from API:', allUsers);
      setUsers(allUsers);
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

  const createTestSwap = async () => {
    if (!user || users.length === 0) return;
    
    try {
      // Get first other user
      const otherUser = users.find(u => u._id !== user.id);
      if (!otherUser) {
        alert('No other users found');
        return;
      }

      // Get user's skills
      const mySkills = await apiService.getMySkills();
      const otherUserSkills = await apiService.getUserSkills(otherUser._id);
      
      console.log('My skills:', mySkills);
      console.log('Other user skills:', otherUserSkills);
      
      if (mySkills.length === 0 || otherUserSkills.length === 0) {
        alert('No skills available for swap');
        return;
      }

      const myOfferedSkill = mySkills.find((s: any) => s.type === 'offered');
      const theirOfferedSkill = otherUserSkills.find((s: any) => s.type === 'offered');
      
      if (!myOfferedSkill || !theirOfferedSkill) {
        alert('No offered skills found');
        return;
      }

      console.log('Creating test swap with:', {
        toUserId: otherUser._id,
        offeredSkillId: myOfferedSkill._id,
        requestedSkillId: theirOfferedSkill._id,
        message: 'Test swap request'
      });

      const newSwap = await apiService.createSwap({
        toUserId: otherUser._id,
        offeredSkillId: myOfferedSkill._id,
        requestedSkillId: theirOfferedSkill._id,
        message: 'Test swap request'
      });

      console.log('Created swap:', newSwap);
      alert('Test swap created successfully!');
      
      // Refresh data
      await fetchData();
    } catch (error: any) {
      console.error('Failed to create test swap:', error);
      alert(`Failed to create test swap: ${error.message}`);
    }
  };

  if (!user) return <div>Please log in</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          >
            Refresh Data
          </button>
          <button
            onClick={createTestSwap}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Test Swap
          </button>
        </div>

        {loading && <div className="text-center py-4">Loading...</div>}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Swap Requests ({swapRequests.length})</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(swapRequests, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(users, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DebugPage; 