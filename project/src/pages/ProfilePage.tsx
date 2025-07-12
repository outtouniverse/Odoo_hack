import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Plus, X, Camera, Globe, Lock, Clock, Save, Upload } from 'lucide-react';
import SkillTag from '../components/SkillTag';
import { apiService } from '../services/api';

const ProfilePage: React.FC = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSetup = searchParams.get('setup') === 'true';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    profilePhoto: user?.profilePhoto || '',
    skillsOffered: [] as any[],
    skillsWanted: [] as any[],
    availability: [] as string[],
    isPublic: user?.isPublic ?? true
  });

  // State for skills from database
  const [skillsOffered, setSkillsOffered] = useState<any[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<any[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [newAvailability, setNewAvailability] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availabilityOptions = [
    'Weekday Mornings (9AM-12PM)',
    'Weekday Afternoons (1PM-5PM)', 
    'Weekday Evenings (6PM-9PM)',
    'Weekend Mornings (9AM-12PM)',
    'Weekend Afternoons (1PM-5PM)',
    'Weekend Evenings (6PM-9PM)',
    'Flexible Schedule',
    'By Appointment Only'
  ];

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoData = e.target?.result as string;
        
        try {
          // Upload photo data to backend
          const response = await apiService.uploadProfilePhoto({ photoData });
          
          // Update form data with the uploaded photo URL
          setFormData(prev => ({
            ...prev,
            profilePhoto: response.photoUrl
          }));
          
          // Clear selected file and preview
          setSelectedFile(null);
          setPreviewUrl('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          alert('Profile photo uploaded successfully!');
        } catch (error: any) {
          console.error('Failed to upload photo:', error);
          alert(`Failed to upload photo: ${error.message}`);
        }
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      console.error('Failed to process photo:', error);
      alert(`Failed to process photo: ${error.message}`);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Prepare the data to save
      const profileData = {
        name: formData.name,
        location: formData.location,
        profilePhoto: formData.profilePhoto,
        availability: formData.availability, // Send as array
        isPublic: formData.isPublic
      };

      console.log('Submitting profile data:', profileData);

      // Update user profile in database
      const updatedUser = await apiService.updateUser(user.id, profileData);
      
      console.log('Profile updated successfully:', updatedUser);
      
      // Update the user context
      updateUser(updatedUser);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      if (isSetup) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addSkillOffered = async () => {
    if (newSkillOffered.trim() && !skillsOffered.some((skill: any) => skill.name === newSkillOffered.trim())) {
      try {
        // Create the skill in database
        const skill = await apiService.createSkill({
          name: newSkillOffered.trim(),
          description: `I can teach ${newSkillOffered.trim()}`,
          type: 'offered'
      });

        // Refresh skills from database
        await fetchUserSkills();
      setNewSkillOffered('');
      } catch (error: any) {
        console.error('Failed to add skill:', error);
        alert(`Failed to add skill: ${error.message}`);
      }
    }
  };

  const addSkillWanted = async () => {
    if (newSkillWanted.trim() && !skillsWanted.some((skill: any) => skill.name === newSkillWanted.trim())) {
      try {
        // Create the skill in database
        const skill = await apiService.createSkill({
          name: newSkillWanted.trim(),
          description: `I want to learn ${newSkillWanted.trim()}`,
          type: 'wanted'
      });

        // Refresh skills from database
        await fetchUserSkills();
      setNewSkillWanted('');
      } catch (error: any) {
        console.error('Failed to add skill:', error);
        alert(`Failed to add skill: ${error.message}`);
      }
    }
  };

  const addAvailability = async () => {
    if (newAvailability && newAvailability.trim() !== '' && !formData.availability.includes(newAvailability)) {
      try {
        const updatedAvailability = [...formData.availability, newAvailability];
        
        console.log('Adding availability:', newAvailability);
        console.log('Updated availability array:', updatedAvailability);
        
        // Update availability in database
        if (user) {
          const availabilityData = {
            availability: updatedAvailability
          };
          console.log('Sending availability data:', availabilityData);
          console.log('Availability array type:', Array.isArray(updatedAvailability));
          console.log('Availability array length:', updatedAvailability.length);
          
          const response = await apiService.updateUser(user.id, availabilityData);
          console.log('Availability update response:', response);
          console.log('Response availability:', response.availability);
          
          // Refresh user data from database to ensure we have the latest
          await refreshUser();
        }
        
      setFormData({
        ...formData,
          availability: updatedAvailability
      });
      setNewAvailability('');
      } catch (error: any) {
        console.error('Failed to add availability:', error);
        alert(`Failed to add availability: ${error.message}`);
      }
    }
  };

  const removeSkillOffered = async (skill: any) => {
    try {
      // Remove from database
      await apiService.deleteSkill(skill._id);
      
      // Refresh skills from database
      await fetchUserSkills();
    } catch (error: any) {
      console.error('Failed to remove skill:', error);
      alert(`Failed to remove skill: ${error.message}`);
    }
  };

  const removeSkillWanted = async (skill: any) => {
    try {
      // Remove from database
      await apiService.deleteSkill(skill._id);
      
      // Refresh skills from database
      await fetchUserSkills();
    } catch (error: any) {
      console.error('Failed to remove skill:', error);
      alert(`Failed to remove skill: ${error.message}`);
    }
  };

  const removeAvailability = async (availability: string) => {
    try {
      const updatedAvailability = formData.availability.filter(a => a !== availability);
      
      console.log('Removing availability:', availability);
      console.log('Updated availability array:', updatedAvailability);
      
      // Update availability in database
      if (user) {
        const availabilityData = {
          availability: updatedAvailability
        };
        console.log('Sending availability data:', availabilityData);
        console.log('Availability array type:', Array.isArray(updatedAvailability));
        console.log('Availability array length:', updatedAvailability.length);
        
        const response = await apiService.updateUser(user.id, availabilityData);
        console.log('Availability update response:', response);
        console.log('Response availability:', response.availability);
        
        // Refresh user data from database to ensure we have the latest
        await refreshUser();
      }
      
    setFormData({
      ...formData,
        availability: updatedAvailability
      });
    } catch (error: any) {
      console.error('Failed to remove availability:', error);
      alert(`Failed to remove availability: ${error.message}`);
    }
  };

  // Fetch skills from database
  const fetchUserSkills = async () => {
    if (!user) return;
    
    setLoadingSkills(true);
    try {
      console.log('Fetching skills for current user');
      // Fetch skills for current authenticated user
      const userSkills = await apiService.getMySkills();
      console.log('Fetched skills:', userSkills);
      
      // Filter skills by type
      const userOfferedSkills = userSkills.filter((skill: any) => skill.type === 'offered');
      const userWantedSkills = userSkills.filter((skill: any) => skill.type === 'wanted');
      
      console.log('Offered skills:', userOfferedSkills);
      console.log('Wanted skills:', userWantedSkills);
      
      setSkillsOffered(userOfferedSkills);
      setSkillsWanted(userWantedSkills);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoadingSkills(false);
    }
  };

  // Load skills and availability when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchUserSkills();
      
      // Load availability from user data
      if (user.availability) {
        if (Array.isArray(user.availability)) {
          setFormData(prev => ({
            ...prev,
            availability: user.availability as unknown as string[]
          }));
        } else if (typeof user.availability === 'string') {
          // Handle legacy string format
          const availabilityArray = user.availability.split(', ').filter((item: string) => item.trim() !== '');
          setFormData(prev => ({
            ...prev,
            availability: availabilityArray
          }));
        }
      }
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              {isSetup ? 'Complete Your Profile' : 'Profile Settings'}
            </h1>
            <p className="mt-2 text-blue-100">
              {isSetup 
                ? 'Add your skills and availability to start connecting with others'
                : 'Manage your skills, availability, and account settings'
              }
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Save className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Profile updated successfully!
                    {isSetup && ' Redirecting to dashboard...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  
                  {/* Current Profile Photo */}
                  {formData.profilePhoto && (
                    <div className="mb-4">
                      <img
                        src={formData.profilePhoto}
                        alt="Current profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                  )}
                  
                  {/* File Upload Interface */}
                  <div className="space-y-3">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {/* Upload button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="text-gray-600">Browse and select photo</span>
                    </button>
                    
                    {/* File preview and upload */}
                    {selectedFile && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={handleFileUpload}
                          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Upload Photo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Visibility */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {formData.isPublic ? (
                    <Globe className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <Lock className="h-5 w-5 text-red-500 mr-3" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-600">
                      {formData.isPublic ? 'Your profile is visible to others' : 'Your profile is private'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Skills Offered */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Skills I Can Teach
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {loadingSkills ? (
                  <div className="text-gray-500">Loading skills...</div>
                ) : skillsOffered.length > 0 ? (
                  skillsOffered.map((skill: any) => (
                  <SkillTag
                      key={skill._id}
                      skill={skill.name}
                    variant="offered"
                    onRemove={() => removeSkillOffered(skill)}
                  />
                  ))
                ) : (
                  <div className="text-gray-500">No skills offered yet</div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillOffered())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill you can teach (e.g., JavaScript, Photography, Cooking)"
                />
                <button
                  type="button"
                  onClick={() => addSkillOffered()}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Skills Wanted */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Skills I Want to Learn
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {loadingSkills ? (
                  <div className="text-gray-500">Loading skills...</div>
                ) : skillsWanted.length > 0 ? (
                  skillsWanted.map((skill: any) => (
                  <SkillTag
                      key={skill._id}
                      skill={skill.name}
                    variant="wanted"
                    onRemove={() => removeSkillWanted(skill)}
                  />
                  ))
                ) : (
                  <div className="text-gray-500">No skills wanted yet</div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillWanted())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill you want to learn (e.g., Python, Guitar, Spanish)"
                />
                <button
                  type="button"
                  onClick={() => addSkillWanted()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Availability
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {formData.availability.map((time, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    {time}
                    <button
                      type="button"
                      onClick={() => removeAvailability(time)}
                      className="ml-2 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <select
                  value={newAvailability}
                  onChange={(e) => setNewAvailability(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select availability...</option>
                  {availabilityOptions
                    .filter(option => !formData.availability.includes(option))
                    .map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() => addAvailability()}
                  disabled={!newAvailability}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    {isSetup ? 'Complete Setup' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
};

export default ProfilePage;