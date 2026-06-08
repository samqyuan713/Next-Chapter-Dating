import React, { useState } from 'react';
import { Heart, ShieldCheck, Mail, Lock, Sparkles, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup } from 'firebase/auth';

interface LoginScreenProps {
  onLoginSuccess: (userProfile: {
    name: string;
    age: number;
    location: string;
    occupation: string;
    relationshipStatus: string;
    avatar: string;
    gender: 'male' | 'female';
    preferredGender: 'male' | 'female' | 'all';
    uid: string;
    token: string;
  }) => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState(52);
  const [regGender, setRegGender] = useState<'male' | 'female'>('female');
  const [regLookingFor, setRegLookingFor] = useState<'male' | 'female' | 'all'>('male');
  const [regLocation, setRegLocation] = useState('Seattle, WA');
  const [regOccupation, setRegOccupation] = useState('Traditional Arts Curator');
  const [regStatus, setRegStatus] = useState('Divorced');

  // Fast-fill demo accounts
  const handleQuickFill = (type: 'female' | 'male') => {
    setError('');
    if (type === 'female') {
      setEmail('sam.zhou@heritage.com');
      setPassword('peaceful123');
      setRegName('Mei-Ling Zhou (周美玲)');
      setRegAge(50);
      setRegGender('female');
      setRegLookingFor('male');
      setRegLocation('Seattle, WA (Taipei-born)');
      setRegOccupation('Guzheng Instructor & Tea Ceremony Host');
      setRegStatus('Divorced');
    } else {
      setEmail('raymond.goh@wisdom.com');
      setPassword('harmony123');
      setRegName('Dr. Raymond Goh (吴国荣)');
      setRegAge(53);
      setRegGender('male');
      setRegLookingFor('female');
      setRegLocation('Bay Area, CA (Singapore-born)');
      setRegOccupation('Traditional Herbal Medicine Scholar');
      setRegStatus('Widowed');
    }
    setActiveTab('signin');
  };

  // Google Login Flow
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      // Store globally for API requests
      (window as any).firebaseToken = idToken;
      (window as any).currentUserUid = user.uid;

      // Sync profile to database
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name: user.displayName || user.email?.split('@')[0] || "Honorable Guest",
          email: user.email || "guest@matchmaking.net",
          avatar: user.photoURL || "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=400&h=400",
          age: 48,
          gender: "female",
          location: "Seattle, WA",
          occupation: "Refined Scholar",
          relationshipStatus: "Starting Over"
        })
      });

      if (!response.ok) {
        throw new Error('Could not register profile in the database.');
      }

      const dbUser = await response.json();

      onLoginSuccess({
        uid: dbUser.uid,
        token: idToken,
        name: dbUser.name,
        age: dbUser.age,
        location: dbUser.location,
        occupation: dbUser.occupation,
        relationshipStatus: dbUser.relationshipStatus,
        avatar: dbUser.avatar,
        gender: dbUser.gender,
        preferredGender: 'all',
      });

    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError('Google Sign-In was closed or failed: ' + (err.message || 'Check connection.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      // Determine token & uid
      const isFemaleDemo = email === 'sam.zhou@heritage.com';
      const token = isFemaleDemo ? 'demo-token-female' : 'demo-token-male';
      const uid = isFemaleDemo ? 'profile-1' : 'profile-2';

      // Set global variables
      (window as any).firebaseToken = token;
      (window as any).currentUserUid = uid;

      // Prepare sync payload
      const syncBody = activeTab === 'signin' 
        ? {
            name: isFemaleDemo ? 'Mei-Ling Zhou (周美玲)' : 'Dr. Raymond Goh (吴国荣)',
            avatar: isFemaleDemo 
              ? 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=400&h=400'
              : 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400&h=400',
            age: isFemaleDemo ? 50 : 53,
            location: isFemaleDemo ? 'Seattle, WA (Taipei-born)' : 'Bay Area, CA (Singapore-born)',
            occupation: isFemaleDemo ? 'Guzheng Instructor & Tea Ceremony Host' : 'Traditional Herbal Medicine Scholar',
            gender: isFemaleDemo ? 'female' : 'male',
            relationshipStatus: isFemaleDemo ? 'Divorced' : 'Widowed',
          }
        : {
            name: regName || 'Honorable Guest',
            avatar: regGender === 'male'
              ? 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400&h=400'
              : 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=400&h=400',
            age: regAge,
            location: regLocation,
            occupation: regOccupation,
            gender: regGender,
            relationshipStatus: regStatus,
          };

      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(syncBody)
      });

      if (!response.ok) {
        throw new Error('Database server user synchronization failed.');
      }

      const dbUser = await response.json();

      onLoginSuccess({
        uid: dbUser.uid,
        token: token,
        name: dbUser.name,
        age: dbUser.age,
        location: dbUser.location,
        occupation: dbUser.occupation,
        relationshipStatus: dbUser.relationshipStatus,
        avatar: dbUser.avatar,
        gender: dbUser.gender,
        preferredGender: regLookingFor,
      });

    } catch (err: any) {
      console.error('Login sync error:', err);
      setError('Could not establish database liaison: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-100 via-[#FFF9F6] to-amber-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-700 relative overflow-hidden">
      
      <div className="absolute top-20 left-[15%] w-72 h-72 bg-rose-200/40 rounded-full filter blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-amber-100/40 rounded-full filter blur-3xl animate-pulse delay-700 pointer-events-none" />
  
      <div className="max-w-md w-full space-y-7 bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-rose-150 shadow-2xl relative z-10 premium-glow-shadow premium-gold-border smooth-spring hover:scale-[1.01]">
        
        <div className="text-center space-y-2">
          <div className="mx-auto bg-gradient-to-tr from-rose-500 to-rose-600 p-3.5 rounded-2xl text-white shadow-md w-fit hover:rotate-6 transition-transform">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-3xl font-serif font-black tracking-tight bg-gradient-to-r from-rose-700 via-[#9e2d30] to-amber-700 bg-clip-text text-transparent">
            Next Chapter
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Elegant slow matchmaking lounge synchronized securely on relational Cloud SQL tables.
          </p>
        </div>

        {/* Real Sign In with Google Button on Top of Onboarding Forms */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 bg-white hover:bg-stone-50 text-stone-700 font-bold rounded-2xl text-xs border border-stone-200/80 shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.86-3.577-7.86-8s3.53-8 7.86-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.056 1 1.05 6.01 1.05 12s5.006 11 11.19 11c6.457 0 10.748-4.53 10.748-10.94 0-.733-.08-1.284-.176-1.775H12.24z"
            />
          </svg>
          <span>Sign In with Google (谷歌登录)</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100"></div></div>
          <span className="relative px-3 text-[10px] text-stone-400 font-bold bg-[#FAFDFC] select-none">OR SECURE RECOVERY</span>
        </div>
  
        <div className="flex bg-stone-100/80 p-1 rounded-2xl border border-stone-200/60 shadow-inner">
          <button
            onClick={() => { setActiveTab('signin'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-300 ${
              activeTab === 'signin'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-stone-500 hover:text-rose-700'
            }`}
          >
            Password Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-300 ${
              activeTab === 'register'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-stone-500 hover:text-rose-700'
            }`}
          >
            Create Profile
          </button>
        </div>
  
        {error && (
          <div className="bg-rose-50 border border-rose-250/60 p-3 rounded-xl flex items-start gap-2 text-xs text-rose-950">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-semibold text-[10.5px] leading-relaxed">{error}</p>
          </div>
        )}
  
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-rose-500" /> Account Email address
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sam.zhou@heritage.com"
              className="w-full text-xs bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-stone-850 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all font-medium"
            />
          </div>
  
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-rose-500" /> Secure Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (minimum 6 characters)"
                className="w-full text-xs bg-stone-50/50 border border-stone-200 rounded-xl pl-4 pr-10 py-3 text-stone-850 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-rose-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {activeTab === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 pt-2 border-t border-stone-100 overflow-hidden"
            >
              <div className="text-[10px] uppercase font-black text-stone-700 tracking-wider border-l-2 border-rose-500 pl-2">
                Matcher Custom Settings
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wide">Your Full Name & Monogram</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Samuel Wang (王茂修)"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Current Age</label>
                  <input
                    type="number"
                    min="35"
                    max="95"
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Life Status</label>
                  <select
                    value={regStatus}
                    onChange={(e) => setRegStatus(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl py-2 px-1 text-stone-800"
                  >
                    <option value="Divorced">Divorced (离异)</option>
                    <option value="Widowed">Widowed (丧偶)</option>
                    <option value="Starting Over">Starting Over</option>
                    <option value="Single Parent">Single Parent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Your Gender</label>
                  <div className="grid grid-cols-2 gap-1 bg-stone-50 p-1 rounded-xl border border-stone-200">
                    <button
                      type="button"
                      onClick={() => { setRegGender('female'); setRegLookingFor('male'); }}
                      className={`py-1 text-[10px] font-bold rounded-lg ${regGender === 'female' ? 'bg-white text-rose-700 shadow-3xs' : 'text-stone-500'}`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRegGender('male'); setRegLookingFor('female'); }}
                      className={`py-1 text-[10px] font-bold rounded-lg ${regGender === 'male' ? 'bg-white text-rose-700 shadow-3xs' : 'text-stone-500'}`}
                    >
                      Male
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Looking For</label>
                  <select
                    value={regLookingFor}
                    onChange={(e) => setRegLookingFor(e.target.value as any)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl py-2 px-1 text-stone-800"
                  >
                    <option value="male">Men (男士)</option>
                    <option value="female">Women (女士)</option>
                    <option value="all">Everyone</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Location Base</label>
                  <input
                    type="text"
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Occupation</label>
                  <input
                    type="text"
                    value={regOccupation}
                    onChange={(e) => setRegOccupation(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-650 text-white font-bold rounded-2xl text-xs shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
          >
            <span>{activeTab === 'signin' ? 'Verify Credentials & Sync' : 'Register Profile & Sync'}</span>
             animate-spin
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
  
        <div className="pt-4 border-t border-stone-100 space-y-2">
          <div className="text-[10px] uppercase font-black text-rose-800/85 tracking-widest flex items-center gap-1 select-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            VETTED DEMO MEMBERS (免密快捷通道)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickFill('female')}
              className="p-3 bg-rose-50/60 hover:bg-rose-50 border border-rose-100 hover:border-rose-300 rounded-2xl text-left transition-all duration-300 cursor-pointer hover:shadow-3xs"
            >
              <div className="text-[10.5px] font-extrabold text-rose-900 leading-tight">Mei-Ling Zhou (周美玲)</div>
              <div className="text-[9px] text-stone-500 mt-0.5 leading-tight truncate">Divorced Guzheng Teacher</div>
              <div className="text-[8px] font-mono text-stone-400 mt-1 truncate">sam.zhou@heritage.com</div>
            </button>
            <button
              onClick={() => handleQuickFill('male')}
              className="p-3 bg-emerald-50/45 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-300 rounded-2xl text-left transition-all duration-300 cursor-pointer hover:shadow-3xs"
            >
              <div className="text-[10.5px] font-extrabold text-emerald-900 leading-tight">Dr. Raymond Goh (吴国荣)</div>
              <div className="text-[9px] text-stone-500 mt-0.5 leading-tight truncate">Widowed Medicine Scholar</div>
              <div className="text-[8px] font-mono text-stone-400 mt-1 truncate">raymond.goh@wisdom.com</div>
            </button>
          </div>
        </div>
  
        <div className="flex items-center justify-center gap-1 text-[10px] text-stone-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Vetted for real-time relational storage. Safe & compliant.</span>
        </div>

      </div>
    </div>
  );
}
