import React, { useState, useEffect } from 'react';
import { DatingProfile, Message } from './types';

// Component imports
import { DiscoverCompass } from './components/DiscoverCompass';
import { StoryRoom } from './components/StoryRoom';
import { ConversationCenter } from './components/ConversationCenter';
import { CommunityCafé } from './components/CommunityCafé';
import { LoginScreen } from './components/LoginScreen';

// Icon imports
import {
  Heart,
  Compass,
  MessageSquare,
  Users,
  Settings,
  User,
  ShieldCheck,
  Bookmark,
  Coffee,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  // Credentials login state (locks app until verified)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userGender, setUserGender] = useState<'male' | 'female'>('female');
  const [preferredGender, setPreferredGender] = useState<'male' | 'female' | 'all'>('male');

  // Navigation: 'discover' | 'cafe' | 'messages' | 'profile'
  const [activeTab, setActiveTab] = useState<'discover' | 'cafe' | 'messages' | 'profile'>('discover');
  
  // High-end atmospheric theme state ('earthy' | 'romantic' | 'midnight')
  // We initialize with 'romantic' for immediate jaw-dropping premium visual aesthetics at first glance!
  const [theme, setTheme] = useState<'earthy' | 'romantic' | 'midnight'>('romantic');
  
  // High fidelity chat activation states (redirects from Discover page button triggers)
  const [activeProfileChat, setActiveProfileChat] = useState<DatingProfile | null>(null);
  const [initialIcebreakerText, setInitialIcebreakerText] = useState<string>('');

  // Bookmarking/Favoriting state
  const [savedProfileIds, setSavedProfileIds] = useState<string[]>(['1', '3']);
  
  // Custom user profile summary (refreshed when edited in StoryRoom)
  const [userProfile, setUserProfile] = useState({
    name: 'Mei-Ling Zhou (周美玲)',
    age: 50,
    location: 'Seattle, WA (Taipei-born)',
    occupation: 'Guzheng Instructor & Traditional Tea Host',
    relationshipStatus: 'Divorced',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=400&h=400'
  });

  // Welcome modal state (for teaching user the product values)
  const [showIntroduction, setShowIntroduction] = useState<boolean>(true);

  // Trigger chat activation and switch tabs automatically
  const handleStartChatFromDiscover = (profile: DatingProfile, initialText?: string) => {
    setActiveProfileChat(profile);
    setInitialIcebreakerText(initialText || `Hello ${profile.name}, I loved reading your Next Chapter profile!`);
    setActiveTab('messages');
  };

  const clearChatRequestProps = () => {
    setActiveProfileChat(null);
    setInitialIcebreakerText('');
  };

  const [currentUserUid, setCurrentUserUid] = useState<string>('');
  const [userToken, setUserToken] = useState<string>('');

  useEffect(() => {
    if (isLoggedIn && userToken) {
      fetch('/api/bookmarks', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSavedProfileIds(data.map(String));
        }
      })
      .catch(err => console.error("Error reading database bookmarks:", err));
    }
  }, [isLoggedIn, userToken]);

  // Toggle bookmarking a profile
  const handleToggleSaveProfile = (profileId: string) => {
    const token = userToken || (window as any).firebaseToken;
    if (!token) return;

    fetch('/api/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ savedProfileId: profileId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.saved) {
        setSavedProfileIds(prev => [...prev, String(profileId)]);
      } else {
        setSavedProfileIds(prev => prev.filter(id => id !== String(profileId)));
      }
    })
    .catch(err => console.error("Error toggling database bookmark:", err));
  };

  // Profile update callback
  const handleProfileUpdated = (updatedInfo: any) => {
    setUserProfile({
      name: updatedInfo.name,
      age: updatedInfo.age,
      location: updatedInfo.location,
      occupation: updatedInfo.occupation,
      relationshipStatus: updatedInfo.relationshipStatus,
      avatar: updatedInfo.avatar
    });
  };

  const handleLoginSuccess = (profileInfo: any) => {
    setCurrentUserUid(profileInfo.uid);
    setUserToken(profileInfo.token);
    setUserProfile({
      name: profileInfo.name,
      age: profileInfo.age,
      location: profileInfo.location,
      occupation: profileInfo.occupation,
      relationshipStatus: profileInfo.relationshipStatus,
      avatar: profileInfo.avatar
    });
    setUserGender(profileInfo.gender);
    setPreferredGender(profileInfo.preferredGender);
    setIsLoggedIn(true);
    setShowIntroduction(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div 
      id="next-chapter-app" 
      className={`min-h-screen bg-stone-100/50 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900 transition-all duration-700 theme-${theme}`}
    >
      
      {/* 1. Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand Frame */}
          <div className="flex items-center gap-2">
            <div className="bg-rose-50 border border-rose-200/40 p-2 rounded-2xl text-rose-600 shadow-3xs animate-pulse">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-semibold text-stone-800 tracking-tight flex items-center gap-1.5">
                Next Chapter
                <span className="hidden sm:inline text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200/10">
                  Niche Pro
                </span>
              </h1>
              <p className="text-[10px] text-stone-400 font-medium">Companionship & Slow Dating for Mid-Life Hearts</p>
            </div>
          </div>

          {/* Desktop Web Application Navigation */}
          <nav className="hidden md:flex space-x-1 p-1 bg-stone-100 border border-stone-200/50 rounded-2xl">
            <button
              id="nav-discover-tab"
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'discover'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              Guided Compass
            </button>

            <button
              id="nav-cafe-tab"
              onClick={() => setActiveTab('cafe')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'cafe'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Users className="w-4 h-4" />
              Community Café
            </button>

            <button
              id="nav-messages-tab"
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all relative ${
                activeTab === 'messages'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Convos List
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-600 rounded-full animate-ping" />
            </button>

            <button
              id="nav-profile-tab"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <User className="w-4 h-4" />
              My Story
            </button>
          </nav>

          {/* Romance Theme Selector Capsule (Attracts at first glance!) */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 border border-stone-200/50 rounded-2xl text-[10px] md:text-[11px] scale-95 md:scale-100 shadow-3xs">
            <span className="hidden sm:inline text-[9.5px] uppercase font-bold tracking-wider text-rose-800/80 pl-2 pr-1 font-mono font-bold select-none">Vibe:</span>
            <button
              onClick={() => setTheme('earthy')}
              className={`p-1 px-2.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                theme === 'earthy' ? 'bg-white text-stone-850 shadow-xs border border-stone-200/30 font-bold' : 'text-stone-500 hover:text-stone-850 font-medium'
              }`}
              title="Restful Sage & Tea (🌱)"
            >
              <span>🌱</span>
              <span className="hidden sm:inline">Restful</span>
            </button>
            <button
              onClick={() => setTheme('romantic')}
              className={`p-1 px-2.5 rounded-xl font-bold flex items-center gap-1 transition-all pulse-rose-glow ${
                theme === 'romantic' ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-xs font-bold border border-rose-400/30' : 'text-stone-500 hover:text-rose-600 font-medium'
              }`}
              title="Romantic Peach Blossom (💖)"
            >
              <span>💖</span>
              <span className="hidden sm:inline">Romance</span>
            </button>
            <button
              onClick={() => setTheme('midnight')}
              className={`p-1 px-2.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                theme === 'midnight' ? 'bg-gradient-to-r from-violet-600 to-indigo-700 text-white shadow-xs font-bold border border-violet-500/30' : 'text-stone-500 hover:text-violet-600 font-medium'
              }`}
              title="Midnight Lavender Glow (🌌)"
            >
              <span>🌌</span>
              <span className="hidden sm:inline">Midnight</span>
            </button>
          </div>

          {/* Quick Active Profile Access Block */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 text-left hover:opacity-90 transition-all bg-stone-50/50 p-1.5 pr-3 rounded-2xl border border-stone-200/40"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200 shadow-2xs">
                <img src={userProfile.avatar} alt="You" className="w-full h-full object-cover animate-fade-in" />
              </div>
              <div className="hidden sm:block">
                <span className="block text-xs font-bold text-stone-700 leading-tight truncate w-24">{userProfile.name}</span>
                <span className="block text-[9px] text-stone-400 capitalize font-medium">{userProfile.relationshipStatus} • Seattle</span>
              </div>
            </button>

            <button
              id="header-logout-btn"
              onClick={() => setIsLoggedIn(false)}
              className="text-[10px] uppercase font-bold tracking-wider px-3 py-2 bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-700 border border-stone-200/50 rounded-xl transition-all cursor-pointer"
              title="Logout from Next Chapter"
            >
              Sign Out
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Mobile quick tab list (visible only on smaller mobile widths) */}
        <div className="md:hidden grid grid-cols-4 gap-1 p-1 bg-stone-200/55 rounded-2xl">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${
              activeTab === 'discover' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[9px] mt-1 font-bold">Compass</span>
          </button>
          <button
            onClick={() => setActiveTab('cafe')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${
              activeTab === 'cafe' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[9px] mt-1 font-bold">Café</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all relative ${
              activeTab === 'messages' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] mt-1 font-bold">Convos</span>
            <span className="absolute top-2 right-4 w-2 h-2 bg-rose-600 rounded-full" />
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${
              activeTab === 'profile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[9px] mt-1 font-bold">Story</span>
          </button>
        </div>

        {/* Dynamic active tab render element */}
        <div id="workspace-viewport">
          {activeTab === 'discover' && (
            <DiscoverCompass 
              onStartChat={handleStartChatFromDiscover}
              savedProfileIds={savedProfileIds}
              onToggleSave={handleToggleSaveProfile}
              preferredGender={preferredGender}
              onPreferredGenderChange={setPreferredGender}
            />
          )}

          {activeTab === 'cafe' && (
            <CommunityCafé />
          )}

          {activeTab === 'messages' && (
            <ConversationCenter
              activeProfileChat={activeProfileChat}
              initialIcebreakerText={initialIcebreakerText}
              onClearActiveChatSelection={clearChatRequestProps}
            />
          )}

          {activeTab === 'profile' && (
            <StoryRoom onProfileUpdated={handleProfileUpdated} />
          )}
        </div>

      </main>

      {/* 3. Safe Trust & Niche Verification Footer with strict styling */}
      <footer className="bg-white border-t border-stone-200 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-stone-400 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-stone-600 font-medium font-sans">Next Chapter Safe Space Project</p>
              <p className="text-[10px] text-stone-400">Identity verified via secure mobile device registration profiles.</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-stone-500 text-[11px] font-medium">
            <button onClick={() => setShowIntroduction(true)} className="hover:text-rose-600 flex items-center gap-1 transition-all">
              <Info className="w-3.5 h-3.5" /> Show Welcome Guide
            </button>
            <span>•</span>
            <span className="text-stone-400">Offline-capable demo database</span>
            <span>•</span>
            <span className="text-stone-400">Middle-aged focused algorithms</span>
          </div>
        </div>
      </footer>

      {/* Welcome & Instruction Modal Overlay */}
      {showIntroduction && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-2xl max-w-lg w-full space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-2xl text-rose-600">
                <Heart className="w-6 h-6 fill-rose-600" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-800 leading-tight">Welcome to Next Chapter Dating</h3>
                <p className="text-xs text-stone-400">A compassionate workspace prototype built for your second launch.</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              We understand that dating after middle age (divorced, separated, widowed, or ready to share a restful companion) is entirely different. You aren't looking to match based on shallow look metrics, but on shared trust values, active family statuses, and mutual wisdom.
            </p>

            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Exploring this Prototype:</span>
              
              <div className="grid grid-cols-1 gap-2.5 text-xs text-stone-700">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/40 flex items-start gap-2">
                  <span className="bg-stone-200 text-stone-700 w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <span><strong>The Compass Match:</strong> Browse deep stories highlighting "Previous Chapter Insights". Click "Send Icebreaker" or pick a lazy Sunday prompt to connect.</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/40 flex items-start gap-2">
                  <span className="bg-stone-200 text-stone-700 w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <span><strong>Community Café:</strong> Explore and join interactive social guilds. Upvote entries, see schedules, or reply on topics with minimal pressure.</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/40 flex items-start gap-2">
                  <span className="bg-stone-200 text-stone-700 w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                  <span><strong>My Story:</strong> Swap between editing values and previewing how others will view your emotional readiness milestones.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setShowIntroduction(false)}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-semibold rounded-xl text-xs shadow-xs transition-all"
              >
                Let’s Slow-Match Together
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
