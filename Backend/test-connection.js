const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testBackendConnection() {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test debug endpoint
    const debugResponse = await axios.get(`${API_BASE_URL}/debug`);
    console.log('✅ Debug endpoint passed:', debugResponse.data);
    
    console.log('🎉 Backend is running and accessible!');
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testBackendConnection(); 