import React, { useState } from 'react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const goToLogin = () => {
    window.location.href = '/login';
  };

  const goToRegister = () => {
    window.location.href = '/register';
  };

  const users = [
    {
      id: 1,
      name: "Marc Demo",
      rating: "3.4/5",
      skillsOffered: ["React", "Node.js"],
      skillsWanted: ["Python", "Data Analysis"],
      experience: "5+ years",
      location: "San Francisco"
    },
    {
      id: 2,
      name: "Mitchell",
      rating: "2.5/5",
      skillsOffered: ["Photoshop", "UI Design"],
      skillsWanted: ["React", "Frontend Dev"],
      experience: "3+ years",
      location: "New York"
    },
    {
      id: 3,
      name: "Joe Mills",
      rating: "4.0/5",
      skillsOffered: ["Python", "ML"],
      skillsWanted: ["React Native", "Mobile Dev"],
      experience: "7+ years",
      location: "Austin"
    },
    {
      id: 4,
      name: "Sarah Chen",
      rating: "4.8/5",
      skillsOffered: ["Vue.js", "TypeScript"],
      skillsWanted: ["AWS", "DevOps"],
      experience: "4+ years",
      location: "Seattle"
    },
    {
      id: 5,
      name: "Alex Rivera",
      rating: "4.2/5",
      skillsOffered: ["Figma", "Sketch"],
      skillsWanted: ["Animation", "Motion Design"],
      experience: "6+ years",
      location: "Los Angeles"
    },
    {
      id: 6,
      name: "David Kim",
      rating: "3.9/5",
      skillsOffered: ["Java", "Spring"],
      skillsWanted: ["Microservices", "Docker"],
      experience: "8+ years",
      location: "Chicago"
    }
  ];

  return (
    <div className="min-h-screen font-sans" style={{ 
      backgroundColor: '#E8DCC6',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Compact Header */}
      <header className="bg-white border-b-3" style={{ 
        borderColor: '#B8A082',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
      }}>
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border-2" style={{ 
                backgroundColor: '#8B7765',
                borderColor: '#5D4E42'
              }}>
                <span className="text-white font-black text-lg">S</span>
              </div>
              <h1 className="text-2xl font-black text-black tracking-tight">Skill Swap Platform</h1>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={goToLogin}
                className="text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 border-2"
                style={{ 
                  backgroundColor: '#8B7765',
                  borderColor: '#5D4E42',
                  boxShadow: '0 4px 12px rgba(139, 119, 101, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#5D4E42';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#8B7765';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Login
              </button>
              <button 
                onClick={goToRegister}
                className="px-6 py-2.5 rounded-xl font-bold transition-all duration-300 border-2"
                style={{ 
                  backgroundColor: '#F5F1E8', 
                  color: '#1A1A1A',
                  borderColor: '#B8A082',
                  boxShadow: '0 4px 12px rgba(184, 160, 130, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#EAE5D8';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#F5F1E8';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Floating Search Bar */}
        <div className="relative mb-8">
          <div className="bg-white rounded-2xl p-6 border-3 max-w-4xl mx-auto" style={{ 
            borderColor: '#B8A082',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="flex gap-4">
              <select 
                className="border-2 rounded-xl px-6 py-3 font-semibold focus:outline-none transition-all duration-300"
                style={{ 
                  backgroundColor: '#F5F1E8',
                  borderColor: '#B8A082',
                  color: '#1A1A1A',
                  minWidth: '180px'
                }}
              >
                <option>Availability ▼</option>
                <option>Weekdays</option>
                <option>Weekends</option>
                <option>Evenings</option>
              </select>
              
              <div className="flex-1 flex">
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-2 rounded-l-xl px-6 py-3 focus:outline-none transition-all duration-300 font-medium"
                  style={{ 
                    backgroundColor: '#F5F1E8',
                    borderColor: '#B8A082',
                    color: '#1A1A1A'
                  }}
                  placeholder="Search skills like React, Python, Design..."
                />
                <button 
                  className="text-white px-8 py-3 rounded-r-xl font-bold transition-all duration-300 border-2 border-l-0"
                  style={{ 
                    backgroundColor: '#8B7765',
                    borderColor: '#5D4E42',
                    boxShadow: '0 4px 12px rgba(139, 119, 101, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#5D4E42';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#8B7765';
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-12 gap-6 auto-rows-max">
          {/* Large featured card - spans 8 columns */}
          <div 
            className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-8 border-3 transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              borderColor: '#B8A082',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex gap-6 mb-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl border-3"
                style={{ 
                  backgroundColor: '#8B7765',
                  borderColor: '#5D4E42'
                }}
              >
                {users[0].name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1">
                <h3 className="text-3xl font-black text-black mb-2">{users[0].name}</h3>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xl">⭐ {users[0].rating}</span>
                  <span className="text-gray-600 font-semibold">{users[0].location}</span>
                </div>
                <div className="text-gray-700 font-bold">{users[0].experience} experience</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <span className="text-black font-black text-sm uppercase tracking-wider mb-3 block">Skills Offered</span>
                <div className="flex flex-wrap gap-2">
                  {users[0].skillsOffered.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex} 
                      className="px-4 py-2 rounded-xl text-sm font-bold border-2"
                      style={{ 
                        backgroundColor: '#E8F4E8',
                        color: '#1B5E20',
                        borderColor: '#66BB6A'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-black font-black text-sm uppercase tracking-wider mb-3 block">Skills Wanted</span>
                <div className="flex flex-wrap gap-2">
                  {users[0].skillsWanted.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex} 
                      className="px-4 py-2 rounded-xl text-sm font-bold border-2"
                      style={{ 
                        backgroundColor: '#E3F2FD',
                        color: '#0D47A1',
                        borderColor: '#42A5F5'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={goToLogin}
              className="w-full text-white py-4 rounded-xl font-black transition-all duration-300 border-2 text-lg"
              style={{ 
                backgroundColor: '#8B7765',
                borderColor: '#5D4E42',
                boxShadow: '0 6px 20px rgba(139, 119, 101, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#5D4E42';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#8B7765';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Connect & Swap Skills
            </button>
          </div>

          {/* Medium card - spans 4 columns */}
          <div 
            className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border-3 transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              borderColor: '#B8A082',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex gap-4 mb-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-lg border-2"
                style={{ 
                  backgroundColor: '#8B7765',
                  borderColor: '#5D4E42'
                }}
              >
                {users[1].name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-black text-black mb-1">{users[1].name}</h3>
                <div className="text-sm">⭐ {users[1].rating} • {users[1].location}</div>
                <div className="text-xs text-gray-600 font-semibold">{users[1].experience}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-black font-bold text-xs uppercase tracking-wide mb-2 block">Offers</span>
              <div className="flex flex-wrap gap-1">
                {users[1].skillsOffered.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex} 
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{ 
                      backgroundColor: '#E8F4E8',
                      color: '#1B5E20'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <span className="text-black font-bold text-xs uppercase tracking-wide mb-2 block">Wants</span>
              <div className="flex flex-wrap gap-1">
                {users[1].skillsWanted.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex} 
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{ 
                      backgroundColor: '#E3F2FD',
                      color: '#0D47A1'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={goToLogin}
              className="w-full text-white py-3 rounded-xl font-bold transition-all duration-300 border-2"
              style={{ 
                backgroundColor: '#8B7765',
                borderColor: '#5D4E42'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#5D4E42';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#8B7765';
              }}
            >
              Connect & Swap Skills
            </button>
          </div>

          {/* Regular cards - varying sizes */}
          {users.slice(2).map((user, index) => (
            <div 
              key={user.id} 
              className={`bg-white rounded-2xl p-6 border-3 transition-all duration-300 hover:scale-[1.02] ${
                index === 1 ? 'col-span-12 md:col-span-6 lg:col-span-5' : 
                index === 2 ? 'col-span-12 md:col-span-6 lg:col-span-7' :
                'col-span-12 md:col-span-6 lg:col-span-4'
              }`}
              style={{ 
                borderColor: '#B8A082',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-lg border-2"
                  style={{ 
                    backgroundColor: '#8B7765',
                    borderColor: '#5D4E42'
                  }}
                >
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-black text-black mb-1">{user.name}</h3>
                  <div className="text-sm">⭐ {user.rating} • {user.location}</div>
                  <div className="text-xs text-gray-600 font-semibold">{user.experience}</div>
                </div>
              </div>
              
              <div className="mb-3">
                <span className="text-black font-bold text-xs uppercase tracking-wide mb-1 block">Offers</span>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex} 
                      className="px-2 py-1 rounded-lg text-xs font-semibold"
                      style={{ 
                        backgroundColor: '#E8F4E8',
                        color: '#1B5E20'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-black font-bold text-xs uppercase tracking-wide mb-1 block">Wants</span>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex} 
                      className="px-2 py-1 rounded-lg text-xs font-semibold"
                      style={{ 
                        backgroundColor: '#E3F2FD',
                        color: '#0D47A1'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={goToLogin}
                className="w-full text-white py-3 rounded-xl font-bold transition-all duration-300 border-2"
                style={{ 
                  backgroundColor: '#8B7765',
                  borderColor: '#5D4E42'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#5D4E42';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#8B7765';
                }}
              >
                Connect & Swap Skills
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;