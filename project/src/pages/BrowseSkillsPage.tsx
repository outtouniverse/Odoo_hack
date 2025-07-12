import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { Search, Filter, MapPin, Star, MessageSquare, User as UserIcon, ChevronDown } from 'lucide-react';
import SkillTag from '../components/SkillTag';
import SwapRequestModal from '../components/SwapRequestModal';

const BrowseSkillsPage: React.FC = () => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const publicUsers = users.filter((u: User) => 
      u.id !== user?.id && u.isPublic && !u.isBanned
    );
    
    // Normalize availability format - convert string to array if needed
    const normalizedUsers = publicUsers.map((u: any) => ({
      ...u,
      availability: Array.isArray(u.availability) 
        ? u.availability 
        : typeof u.availability === 'string'
          ? u.availability.split(', ').filter((item: string) => item.trim() !== '')
          : []
    })) as User[];
    
    setAllUsers(normalizedUsers);
    setFilteredUsers(normalizedUsers);
  }, [user]);

  useEffect(() => {
    let filtered = allUsers;

    // Search by name or skills
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by specific skill
    if (selectedSkill) {
      filtered = filtered.filter(u => 
        u.skillsOffered.some(skill => skill.toLowerCase().includes(selectedSkill.toLowerCase()))
      );
    }

    // Filter by location
    if (locationFilter) {
      filtered = filtered.filter(u => 
        u.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by rating
    if (ratingFilter) {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(u => u.rating >= minRating);
    }

    setFilteredUsers(filtered);
  }, [allUsers, searchTerm, selectedSkill, locationFilter, ratingFilter]);

  const handleContactUser = (targetUser: User) => {
    setSelectedUser(targetUser);
    setShowRequestModal(true);
  };

  const handleRequestSuccess = () => {
    // Could show a success message or refresh data
    console.log('Request sent successfully');
  };

  // Get all unique skills for filter dropdown
  const allSkills = Array.from(new Set(
    allUsers.flatMap(u => u.skillsOffered)
  )).sort();

  // Get all unique locations
  const allLocations = Array.from(new Set(
    allUsers.map(u => u.location).filter(Boolean)
  )).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Skills</h1>
          <p className="mt-2 text-gray-600">
            Discover amazing skills from our community of {allUsers.length} teachers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by name or skill (e.g., 'JavaScript', 'Photography', 'John')"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
              <ChevronDown className={`h-4 w-4 ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Category
                  </label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Skills</option>
                    {allSkills.map((skill, index) => (
                      <option key={index} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Location</option>
                    {allLocations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {(searchTerm || selectedSkill || locationFilter || ratingFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkill('');
                  setLocationFilter('');
                  setRatingFilter('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredUsers.length} of {allUsers.length} teachers
          </p>
        </div>

        {/* User Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((targetUser) => (
              <div key={targetUser.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Profile Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center mb-4">
                    {targetUser.profilePhoto ? (
                      <img
                        src={targetUser.profilePhoto}
                        alt={targetUser.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="ml-4 flex-1">
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

                  {/* Skills Offered */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Can Teach:</h4>
                    <div className="flex flex-wrap gap-1">
                      {targetUser.skillsOffered.slice(0, 3).map((skill, index) => (
                        <SkillTag key={index} skill={skill} variant="offered" size="sm" />
                      ))}
                      {targetUser.skillsOffered.length > 3 && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          +{targetUser.skillsOffered.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Skills Wanted */}
                  {targetUser.skillsWanted.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Wants to Learn:</h4>
                      <div className="flex flex-wrap gap-1">
                        {targetUser.skillsWanted.slice(0, 3).map((skill, index) => (
                          <SkillTag key={index} skill={skill} variant="wanted" size="sm" />
                        ))}
                        {targetUser.skillsWanted.length > 3 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            +{targetUser.skillsWanted.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  {targetUser.availability && targetUser.availability.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Availability:</h4>
                      <p className="text-sm text-gray-600">
                        {targetUser.availability[0]}
                        {targetUser.availability.length > 1 && ` +${targetUser.availability.length - 1} more`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleContactUser(targetUser)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center group-hover:shadow-lg transform group-hover:-translate-y-0.5"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Request Skill Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or browse all available skills.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkill('');
                  setLocationFilter('');
                  setRatingFilter('');
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swap Request Modal */}
      {selectedUser && (
        <SwapRequestModal
          targetUser={selectedUser}
          isOpen={showRequestModal}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedUser(null);
          }}
          onSuccess={handleRequestSuccess}
        />
      )}
    </div>
  );
};

export default BrowseSkillsPage;