import React, { useState } from 'react';
import { apiService } from '../services/api';

const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Testing connection...');
    
    try {
      const result = await apiService.testConnection();
      if (result.success) {
        setStatus('success');
        setMessage(`✅ ${result.message}`);
      } else {
        setStatus('error');
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Backend Connection Test</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            This will test if the backend server is running and accessible.
          </p>
          <p className="text-xs text-gray-500">
            Expected URL: http://localhost:5001/api/health
          </p>
        </div>
        
        <button
          onClick={testConnection}
          disabled={status === 'testing'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>
        
        {message && (
          <div className={`p-3 rounded ${getStatusColor()} bg-gray-50`}>
            <p className="text-sm">{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <h4 className="font-semibold text-red-800 mb-2">Troubleshooting Steps:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Make sure the backend server is running on port 5001</li>
              <li>• Check if you're in the Backend directory</li>
              <li>• Run: <code className="bg-red-100 px-1 rounded">node start-server.js</code></li>
              <li>• Or run: <code className="bg-red-100 px-1 rounded">npm start</code></li>
              <li>• Check if MongoDB is accessible</li>
              <li>• Verify the config.env file exists</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionTest; 