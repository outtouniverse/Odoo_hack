import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface Skill {
  _id: string;
  name: string;
  description: string;
  type: 'offered' | 'wanted';
}

const SkillManager: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    type: 'offered' as 'offered' | 'wanted'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // First create the skill
      const skill = await apiService.createSkill({
        name: newSkill.name,
        description: newSkill.description,
        type: newSkill.type
      });

      // Then update user's skills
      const updatedUser = await apiService.updateUserSkills({
        [newSkill.type === 'offered' ? 'skillsOffered' : 'skillsWanted']: [
          ...(user?.[newSkill.type === 'offered' ? 'skillsOffered' : 'skillsWanted'] || []),
          skill._id
        ]
      });

      // Update the user context
      updateUser(updatedUser);
      
      setMessage('Skill added successfully!');
      setNewSkill({ name: '', description: '', type: 'offered' });
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Skill</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleAddSkill} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill Name
          </label>
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={2}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={newSkill.description}
            onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={10}
            maxLength={500}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={newSkill.type}
            onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value as 'offered' | 'wanted' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="offered">Offered</option>
            <option value="wanted">Wanted</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Skill'}
        </button>
      </form>

      {user && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Your Skills</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-green-600">Skills Offered:</h4>
              <div className="mt-1 space-y-1">
                {user.skillsOffered?.length > 0 ? (
                  user.skillsOffered.map((skill: any) => (
                    <div key={skill._id} className="text-sm bg-green-50 p-2 rounded">
                      {skill.name} - {skill.description}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No skills offered yet</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-blue-600">Skills Wanted:</h4>
              <div className="mt-1 space-y-1">
                {user.skillsWanted?.length > 0 ? (
                  user.skillsWanted.map((skill: any) => (
                    <div key={skill._id} className="text-sm bg-blue-50 p-2 rounded">
                      {skill.name} - {skill.description}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No skills wanted yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillManager; 