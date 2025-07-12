const fetch = require('node-fetch');

async function testServer() {
  try {
    console.log('Testing backend server...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test debug endpoint
    const debugResponse = await fetch('http://localhost:5000/api/debug');
    const debugData = await debugResponse.json();
    console.log('Debug check:', debugData);
    
    console.log('✅ Backend server is running correctly!');
  } catch (error) {
    console.error('❌ Backend server test failed:', error.message);
  }
}

testServer(); 