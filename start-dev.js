const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Skill Swap Platform Development Environment...\n');

// Start backend
console.log('📦 Starting Backend Server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'Backend'),
  stdio: 'inherit',
  shell: true
});

// Wait a moment for backend to start
setTimeout(() => {
  console.log('\n🌐 Starting Frontend Development Server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'project'),
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development servers...');
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
    process.exit(0);
  });

  frontend.on('close', (code) => {
    console.log(`\n❌ Frontend process exited with code ${code}`);
    backend.kill('SIGINT');
    process.exit(code);
  });
}, 3000);

backend.on('close', (code) => {
  console.log(`\n❌ Backend process exited with code ${code}`);
  process.exit(code);
});

console.log('✅ Development environment starting...');
console.log('📱 Backend will be available at: http://localhost:5001');
console.log('🌐 Frontend will be available at: http://localhost:5173');
console.log('🔧 Press Ctrl+C to stop all servers\n'); 