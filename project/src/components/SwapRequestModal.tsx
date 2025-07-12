import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, SwapRequest } from '../types';
import { X, Send, MessageSquare, Star, MapPin } from 'lucide-react';
import { apiService } from '../services/api';

interface SwapRequestModalProps {
  targetUser: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  targetUser,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedRequestedSkill, setSelectedRequestedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [targetUserSkills, setTargetUserSkills] = useState<any[]>([]);

  // Load skills when modal opens
  React.useEffect(() => {
    const loadSkills = async () => {
      if (isOpen && user) {
        try {
          // Load current user's skills
          const mySkills = await apiService.getMySkills();
          setUserSkills(mySkills);
          
          // Load target user's skills
          const targetSkills = await apiService.getUserSkills(targetUser.id);
          setTargetUserSkills(targetSkills);
        } catch (error) {
          console.error('Failed to load skills:', error);
        }
      }
    };
    
    loadSkills();
  }, [isOpen, user, targetUser.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!selectedOfferedSkill || !selectedRequestedSkill) {
      setError('Please select both skills for the swap');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Creating swap request with data:', {
        toUserId: targetUser.id,
        offeredSkillId: selectedOfferedSkill,
        requestedSkillId: selectedRequestedSkill,
        message: message.trim()
      });

      // Create swap request via backend API
      const swapData: any = {
        toUserId: targetUser.id,
        offeredSkillId: selectedOfferedSkill,
        requestedSkillId: selectedRequestedSkill
      };
      
      // Only include message if it's not empty
      if (message.trim()) {
        swapData.message = message.trim();
      }

      const newRequest = await apiService.createSwap(swapData);

      console.log('Swap request created successfully:', newRequest);

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to create swap request:', err);
      setError(err.message || 'Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Request Skill Swap</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Target User Info */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-4">
            {targetUser.profilePhoto ? (
              <img
                src={targetUser.profilePhoto}
                alt={targetUser.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {targetUser.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{targetUser.name}</h3>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">
                  {targetUser.rating.toFixed(1)} ({targetUser.completedSwaps} swaps)
                </span>
              </div>
              {targetUser.location && (
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">{targetUser.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Skill I Can Offer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill I Can Offer
            </label>
            <select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a skill you can teach...</option>
              {userSkills
                .filter((skill: any) => skill.type === 'offered')
                .map((skill: any) => (
                  <option key={skill._id} value={skill._id}>{skill.name}</option>
              ))}
            </select>
            {userSkills.filter((skill: any) => skill.type === 'offered').length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                You need to add skills to your profile first.
              </p>
            )}
          </div>

          {/* Skill I Want to Learn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill I Want to Learn
            </label>
            <select
              value={selectedRequestedSkill}
              onChange={(e) => setSelectedRequestedSkill(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a skill you want to learn...</option>
              {targetUserSkills
                .filter((skill: any) => skill.type === 'offered')
                .map((skill: any) => (
                  <option key={skill._id} value={skill._id}>{skill.name}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Introduce yourself and explain why you'd like to swap skills..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/500 characters</p>
          </div>

          {/* Availability Preview */}
          {user.availability && user.availability.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Your Availability</h4>
              <div className="flex flex-wrap gap-2">
                {user.availability.map((time, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || user.skillsOffered.length === 0}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestModal;