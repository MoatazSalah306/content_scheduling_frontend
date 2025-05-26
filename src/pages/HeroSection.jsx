import React, { useState, useEffect } from 'react';
import { Calendar, Users, BarChart3, ArrowRight, Play, CheckCircle, Zap } from 'lucide-react';
import { getPlatforms } from '../services/platformService';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [currentPlatform, setCurrentPlatform] = useState(0);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const result = await getPlatforms();
        if (result.success) {
          setPlatforms(result.platforms.map(p => p.name)); // Assuming platforms have a 'name' property
        } else {
          console.error("Failed to load platforms:", result.error);
          setPlatforms(['Twitter', 'Instagram', 'LinkedIn', 'Facebook', 'TikTok']); // Fallback
        }
      } catch (error) {
        console.error("Error fetching platforms:", error);
        setPlatforms(['Twitter', 'Instagram', 'LinkedIn', 'Facebook', 'TikTok']); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  useEffect(() => {
    if (platforms.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentPlatform((prev) => (prev + 1) % platforms.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [platforms]);

  if (loading) {
    return <div className="text-center py-20">Loading platforms...</div>;
  }

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
       <nav className="relative z-20 bg-white">
        <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#238DFF' }}>
              CS
            </div>
            <span className="text-xl font-bold">
              <span style={{ color: '#238DFF' }}>C</span>
              <span className="text-gray-600">scheduler</span>
            </span>
          </div>
        </div>
      </nav>
   
      
      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#238DFF" strokeWidth="1"/>
              <circle cx="30" cy="30" r="2" fill="#238DFF"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-12">
          
          {/* Header */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: '#238DFF' }} />
              <span className="text-sm text-gray-600 font-medium">Trusted by 50,000+ creators</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Schedule Smarter
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #238DFF, #60a5fa)' }}>
                Content
              </span>{' '}
              for{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #238DFF, #60a5fa)' }}>
                {platforms[currentPlatform]}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your content strategy with PayIn's powerful scheduling platform. 
              Create, schedule, and analyze your social media presence across multiple platforms.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={"/login"}
              className="inline-flex items-center justify-center px-4 py-3 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#238DFF' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1e7ae6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#238DFF'}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all">
              <span className="flex items-center justify-center">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
            {[
              { label: 'Active Users', value: '50K+', icon: Users },
              { label: 'Posts Scheduled', value: '2M+', icon: Calendar },
              { label: 'Success Rate', value: '99.9%', icon: CheckCircle },
              { label: 'Platforms', value: `${platforms.length}+`, icon: Zap }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="w-8 h-8" style={{ color: '#238DFF' }} />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8">
              
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#238DFF' }}>
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900">Content Dashboard</h3>
                    <p className="text-gray-500">Manage your scheduled posts</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">23</div>
                  <div className="text-sm text-gray-500">Scheduled</div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-gray-500 text-sm font-medium py-2">
                      {day}
                    </div>
                  ))}
                  {[...Array(35)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-sm text-gray-600 relative hover:bg-gray-100 transition-colors">
                      {i > 6 && i < 32 ? i - 6 : ''}
                      {(i === 15 || i === 22 || i === 28) && (
                        <div className="absolute inset-0 rounded-lg flex items-center justify-center text-white font-medium" style={{ backgroundColor: '#238DFF' }}>
                          {i === 15 ? '9' : i === 22 ? '16' : '22'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Status */}
              <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
                {platforms.slice(0, 3).map((platform, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: 
                          platform.includes('Twitter') ? '#1DA1F2' : 
                          platform.includes('Instagram') ? '#E4405F' : '#238DFF' 
                      }}
                    ></div>
                    <span className="text-sm text-gray-600 font-medium">{platform}</span>
                    <span className="text-xs text-gray-400">Connected</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;