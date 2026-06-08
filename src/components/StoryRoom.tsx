import React, { useState, useEffect } from 'react';
import { RelationshipStatus, CompanionGoal } from '../types';
import { 
  User, 
  Settings, 
  Baby, 
  Bookmark, 
  Heart, 
  Camera, 
  Check, 
  RefreshCw, 
  Coffee, 
  PenTool,
  Save,
  CheckCircle2,
  Lock,
  Sparkles,
  SlidersHorizontal,
  HelpCircle,
  Activity,
  Plus,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

interface StoryRoomProps {
  onProfileUpdated: (updates: any) => void;
}

export function StoryRoom({ onProfileUpdated }: StoryRoomProps) {
  // Local profile state
  const [profile, setProfile] = useState({
    name: 'Mei-Ling Zhou (周美玲)',
    age: 50,
    location: 'Seattle, WA (Taipei-born)',
    occupation: 'Guzheng Instructor & Tea Ceremony Host',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=400&h=400',
    tagline: 'Weaving string melodies and traditional tea ritual into a restful, quiet sanctuary.',
    relationshipStatus: 'Divorced' as RelationshipStatus,
    companionGoal: 'Companionship First' as CompanionGoal,
    childrenStatus: 'Two adult independent children, settled',
    aboutMe: 'I teach classical Guzheng string instruments, and enjoy hosting small traditional tea gatherings for local neighbors. After a long historical transition six years ago, I value slow-paced mornings, growing balcony orchids, and ancestral family respect. I seek a quiet lifestyle of refined, gentle, and steady growth.',
    previousChapterInsight: 'My earlier chapter taught me that maintaining a peaceful, safe home of mutual respect is far more precious than chasing superficial achievements. Emotional security and a humble posture are the nonnegotiable keystones of any lasting bridge.',
    whatImLookingFor: 'A soft-spoken, emotionally stable partner who values family dedication, respects parent responsibilities, and seeks a quiet co-existence without rushed expectations.',
    values: ['Filial Respect', 'Quiet Harmony', 'Discretion', 'Gentleness'],
    icebreakerQuestion: 'The happiest moments in my weekly schedule look like...',
    icebreakerAnswer: 'A quiet Friday afternoon sorting dried oolong tea leaves, practicing ink brush calligraphy, and drinking green barley tea with soft Guzheng music in the background.',
    privateBioNotes: 'Only visible on deep harmonious check matches.',
    height: '163 cm',
    weight: '52 kg',
    education: 'Bachelor of Traditional Music (Taipei National University of the Arts)',
    ancestralRoots: 'Zhejiang (Ningbo) ancestry, born in Taipei',
    chineseZodiac: 'Year of the Dog (🐶)',
    personalHobbies: ['Playing Guzheng classical strings', 'Nurturing balcony orchids', 'Traditional cursive calligraphy', 'Healthy Cantonese double-boiled soup baking'],
    preferredPartnerAge: '48 - 60',
    preferredPartnerHeight: '170 cm +',
    preferredPartnerRoots: 'Zhejiang or Southern Min heritage appreciated',
    preferredPartnerEducation: 'College graduate or above',
    preferredPartnerDescription: 'An honest, kind, and emotionally stable gentleman of good moral character who values family responsibility, does not smoke, and appreciates tea art.',
    sportsActivities: ['Morning Tai Chi forms (太极拳)', 'Gentle scenic health walking', 'Restorative light yoga stretch'],
    socialPreferences: 'Prefers small tea groups, close heritage societies, and direct quiet cozy family birthday dinners rather than loud public associations or restaurants.',
    photos: [
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=400&h=400',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400&h=400',
      'https://images.unsplash.com/photo-1512429215308-27ef0923cbb1?auto=format&fit=crop&q=80&w=400&h=400'
    ]
  });

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handleAddPhoto = (url: string) => {
    if (!url.trim()) return;
    setProfile(prev => {
      const currentPhotos = prev.photos || [prev.avatar];
      if (currentPhotos.includes(url)) return prev;
      return {
        ...prev,
        photos: [...currentPhotos, url]
      };
    });
    setNewPhotoUrl('');
  };

  const handleDeletePhoto = (urlToDel: string) => {
    setProfile(prev => {
      const currentPhotos = prev.photos || [prev.avatar];
      const filtered = currentPhotos.filter(p => p !== urlToDel);
      let nextAvatar = prev.avatar;
      if (prev.avatar === urlToDel && filtered.length > 0) {
        nextAvatar = filtered[0];
      }
      return {
        ...prev,
        avatar: nextAvatar,
        photos: filtered.length > 0 ? filtered : [nextAvatar]
      };
    });
  };

  const handleSetPrimary = (urlToPrimary: string) => {
    setProfile(prev => ({
      ...prev,
      avatar: urlToPrimary
    }));
  };

  const availableValues = [
    'Filial Respect', 'Quiet Harmony', 'Discretion', 'Patience', 'Sincerity',
    'Family devotion', 'Generosity', 'Humility', 'Emotional maturity',
    'Financial dependability', 'Quiet confidence', 'Gentleness', 'Honesty'
  ];

  const handleValueToggle = (val: string) => {
    setProfile(prev => {
      const exists = prev.values.includes(val);
      const updatedValues = exists 
        ? prev.values.filter(v => v !== val)
        : [...prev.values, val];
      return { ...prev, values: updatedValues };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage('');

    setTimeout(() => {
      setSaving(false);
      setStatusMessage('Your Journey Profile is safely synced and optimized!');
      onProfileUpdated(profile);
      
      // Auto clear alert
      setTimeout(() => setStatusMessage(''), 3000);
    }, 1200);
  };

  return (
    <div id="story-room-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Guide */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200/60 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-rose-100 p-2 rounded-xl text-rose-600">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-stone-800 text-lg">My Story Builder</h3>
          </div>
          <p className="text-stone-500 text-xs leading-relaxed">
            Unlike rapid, high-pressure networks, Next Chapter features deep profiles constructed step-by-step. Let's design an authentic representation of your journey.
          </p>
          <div className="mt-4 pt-4 border-t border-stone-200/50 space-y-3.5 text-xs">
            <div className="flex items-start gap-2 text-stone-600">
              <span className="bg-stone-200 text-stone-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
              <span><strong>Emotional Baggage is Life Insight:</strong> Frame past endings as learning blocks of stable maturity.</span>
            </div>
            <div className="flex items-start gap-2 text-stone-600">
              <span className="bg-stone-200 text-stone-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
              <span><strong>Clear Guardrails:</strong> Set clear family structures to attract partners aligned with co-parenting schedules.</span>
            </div>
            <div className="flex items-start gap-2 text-stone-600">
              <span className="bg-stone-200 text-stone-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
              <span><strong>Companionship Focus:</strong> Highlight friendship first over rushed romantic projection.</span>
            </div>
          </div>
        </div>

        {/* Private Vault Notice */}
        <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100/60 text-xs text-orange-850 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Privacy-First Architecture</span>
            Your contact details and deep bio questions are stored with strict encryption. Profiles are only shown to vetted members matching common trust parameters.
          </div>
        </div>

        {/* Quick switcher tabs */}
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/30">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'edit'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Edit Journey Info
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'preview'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Show Public Preview
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="lg:col-span-8">
        {activeTab === 'edit' ? (
          <form id="profile-edit-form" onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm space-y-6">
            <h3 className="text-lg font-serif font-semibold text-stone-800 border-b border-stone-100 pb-3 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-rose-600" />
              Craft Your Public Chapter
            </h3>

            {/* Multi-Photo Manager Section */}
            <div className="p-5 bg-rose-50/10 rounded-2xl border border-rose-200/15 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-rose-100/50 pb-2">
                <Camera className="w-4 h-4 text-rose-650 animate-pulse" />
                <span className="text-xs uppercase tracking-wide font-bold text-rose-900 font-serif">
                  My Showcase Photos Gallery (我的生动照片展示)
                </span>
                <span className="text-[10px] text-stone-400 font-sans ml-auto">Up to 6 warm moments</span>
              </div>
              
              <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
                A warm story glows in details. Share images representing your lifestyle—tea chambers, watering orchids, active wellness, or calligraphy studies!
              </p>

              {/* Photo grid of current uploads */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(profile.photos || [profile.avatar]).map((url, idx) => {
                  const isPrimary = profile.avatar === url;
                  return (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 shadow-3xs bg-stone-100">
                      <img src={url} alt={`Showcase ${idx}`} className="w-full h-full object-cover" />
                      
                      {/* Controls layer */}
                      <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-between items-center">
                          {isPrimary ? (
                            <span className="text-[8px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded uppercase">Primary</span>
                          ) : (
                            <button 
                              type="button" 
                              onClick={() => handleSetPrimary(url)}
                              className="text-[8.5px] bg-white hover:bg-rose-50 hover:text-rose-700 text-stone-800 font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer"
                            >
                              Set Main
                            </button>
                          )}
                          <button 
                            type="button"
                            disabled={(profile.photos || []).length <= 1}
                            onClick={() => handleDeletePhoto(url)}
                            className="bg-red-650 hover:bg-red-700 text-white p-1 rounded-sm disabled:opacity-40 transition-all cursor-pointer"
                            title="Delete Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {isPrimary && (
                          <div className="text-[8.5px] text-emerald-300 font-bold text-center">Primary Avatar</div>
                        )}
                      </div>
                      
                      {isPrimary && (
                        <div className="absolute bottom-1.5 right-1.5 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add photo URL and Preset section inside the manager */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Add a new photo by web URL/address..."
                    className="flex-1 text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddPhoto(newPhotoUrl)}
                    className="px-4 py-2 bg-stone-900 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add link
                  </button>
                </div>

                {/* Preset helpers */}
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/40">
                  <span className="text-[9.5px] font-bold text-stone-505 block mb-1.5 uppercase font-mono">Or quickly add a beautiful romantic heritage preset photo:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { name: '🍵 Tea ceremony', url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400&h=400' },
                      { name: '🌸 Fresh orchid', url: 'https://images.unsplash.com/photo-1512429215308-27ef0923cbb1?auto=format&fit=crop&q=80&w=400&h=400' },
                      { name: '🎶 Guzheng string', url: 'https://images.unsplash.com/photo-1561571210-9721759685a4?auto=format&fit=crop&q=80&w=400&h=400' },
                      { name: '📚 Scholar study', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400&h=400' },
                      { name: '🚶 Serene walk', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400&h=400' },
                    ].map((pre, pidx) => {
                      const isAdded = (profile.photos || []).includes(pre.url);
                      return (
                        <button
                          key={pidx}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddPhoto(pre.url)}
                          className={`text-[9.5px] py-1.5 px-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                            isAdded 
                              ? 'bg-stone-100 border-stone-200 text-stone-400 font-medium' 
                              : 'bg-white hover:bg-rose-50 hover:border-rose-250 border-stone-205 text-stone-700 font-medium cursor-pointer'
                          }`}
                        >
                          <span className="truncate">{pre.name}</span>
                          {!isAdded && <Plus className="w-2.5 h-2.5 text-rose-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Top row Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5ClassName">Public Profile Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-stone-800 focus:outline-hidden focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Occupation / Main Devotion</label>
                <input 
                  type="text" 
                  value={profile.occupation}
                  onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-stone-800 focus:outline-hidden focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Current Age</label>
                <input 
                  type="number" 
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 40})}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-stone-800 focus:outline-hidden focus:border-rose-500"
                  required
                  min={35}
                  max={99}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Living Location</label>
                <input 
                  type="text" 
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-stone-800 focus:outline-hidden focus:border-rose-500"
                  required
                />
              </div>
            </div>

            {/* Dropdowns for Niche middle-aged parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/50">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1 flex items-center gap-1">
                  Relationship Status
                </label>
                <select
                  value={profile.relationshipStatus}
                  onChange={(e) => setProfile({...profile, relationshipStatus: e.target.value as RelationshipStatus})}
                  className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700 outline-hidden"
                >
                  <option value="Divorced">Divorced (Proudly Rebuilding)</option>
                  <option value="Widowed">Widowed (Exploring Companion Paths)</option>
                  <option value="Single Parent">Single Parent (Kids come first)</option>
                  <option value="Separated">Separated (Transitioning)</option>
                  <option value="Starting Over">Starting Over (Fresh Canvas)</option>
                  <option value="Never Married">Never Married</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1 flex items-center gap-1">
                  Family / Children Status
                </label>
                <input 
                  type="text"
                  value={profile.childrenStatus}
                  onChange={(e) => setProfile({...profile, childrenStatus: e.target.value})}
                  placeholder="e.g. Co-parenting teens / Grown children"
                  className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
                  My Primary Connection Intent Today
                </label>
                <select
                  value={profile.companionGoal}
                  onChange={(e) => setProfile({...profile, companionGoal: e.target.value as CompanionGoal})}
                  className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700 outline-hidden"
                >
                  <option value="Companionship First">Companionship & Slow Cup of Coffee First</option>
                  <option value="Long-Term Marriage">Long-Term Remarriage / Partnership</option>
                  <option value="Deep Friendship & Coffee">Deep Friendship & Mutual Growth</option>
                  <option value="Activity Partner">Museum, Travel & Hiking Activity Partner</option>
                  <option value="A Restful Co-existence">Quiet Co-existence / Safe Anchor</option>
                </select>
              </div>
            </div>

            {/* Heritage Matchmaker Specs (传统指标) */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/50 space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-500" />
                Heritage Matchmaker Credentials (我的传统择偶资质)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Height (身高)</label>
                  <input 
                    type="text" 
                    value={profile.height}
                    onChange={(e) => setProfile({...profile, height: e.target.value})}
                    placeholder="e.g., 163 cm"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Weight (体重)</label>
                  <input 
                    type="text" 
                    value={profile.weight}
                    onChange={(e) => setProfile({...profile, weight: e.target.value})}
                    placeholder="e.g., 52 kg"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Chinese Zodiac (生肖)</label>
                  <select
                    value={profile.chineseZodiac}
                    onChange={(e) => setProfile({...profile, chineseZodiac: e.target.value})}
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden outline-hidden"
                  >
                    <option value="Year of the Goat (🐑)">Goat (🐑)</option>
                    <option value="Year of the Ox (🐂)">Ox (🐂)</option>
                    <option value="Year of the Pig (🐖)">Pig (🐖)</option>
                    <option value="Year of the Monkey (🐒)">Monkey (🐒)</option>
                    <option value="Year of the Dragon (🐉)">Dragon (🐉)</option>
                    <option value="Year of the Tiger (🐯)">Tiger (🐯)</option>
                    <option value="Year of the Dog (🐶)">Dog (🐶)</option>
                    <option value="Year of the Rooster (🐓)">Rooster (🐓)</option>
                    <option value="Year of the Rabbit (🐇)">Rabbit (🐇)</option>
                    <option value="Year of the Snake (🐍)">Snake (🐍)</option>
                    <option value="Year of the Horse (🐎)">Horse (🐎)</option>
                    <option value="Year of the Rat (🐀)">Rat (🐀)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Academic Credentials (学历)</label>
                  <input 
                    type="text" 
                    value={profile.education}
                    onChange={(e) => setProfile({...profile, education: e.target.value})}
                    placeholder="e.g., Bachelor of Arts (Taiwan National University)"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Ancestral Origin (祖籍籍贯)</label>
                  <input 
                    type="text" 
                    value={profile.ancestralRoots}
                    onChange={(e) => setProfile({...profile, ancestralRoots: e.target.value})}
                    placeholder="e.g., Fujian (Minnan) raised in Taipei"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Ideal Partner Expectations (意中人匹配期望) */}
            <div className="p-5 bg-rose-50/15 rounded-2xl border border-rose-200/20 space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-rose-850 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
                Ideal Partner expectations (意中人择偶期待标准)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-rose-700 mb-1">Expected Age (期望对方年龄)</label>
                  <input 
                    type="text" 
                    value={profile.preferredPartnerAge}
                    onChange={(e) => setProfile({...profile, preferredPartnerAge: e.target.value})}
                    placeholder="e.g., 48 - 60"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-rose-700 mb-1">Expected Height (意向身高要求)</label>
                  <input 
                    type="text" 
                    value={profile.preferredPartnerHeight}
                    onChange={(e) => setProfile({...profile, preferredPartnerHeight: e.target.value})}
                    placeholder="e.g., 170 cm or taller"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-rose-700 mb-1">Academic Expectation (对应学历要求)</label>
                  <input 
                    type="text" 
                    value={profile.preferredPartnerEducation}
                    onChange={(e) => setProfile({...profile, preferredPartnerEducation: e.target.value})}
                    placeholder="e.g., Bachelor standard or above"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-rose-700 mb-1">Preferred Family Ancestry roots (中意对方籍贯)</label>
                  <input 
                    type="text" 
                    value={profile.preferredPartnerRoots}
                    onChange={(e) => setProfile({...profile, preferredPartnerRoots: e.target.value})}
                    placeholder="e.g., Zhejiang or Fujian ancestry preferred"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-rose-700 mb-1">Ideal Partner detailed character expectation (具体择偶品质描绘)</label>
                <textarea 
                  value={profile.preferredPartnerDescription}
                  onChange={(e) => setProfile({...profile, preferredPartnerDescription: e.target.value})}
                  rows={2}
                  placeholder="Describe your matchmaker expectations, character attributes, and standard family alignments..."
                  className="w-full text-xs bg-white border border-stone-200 rounded-xl px-4 py-2 text-stone-800 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Elegant Hobbies & Leisure pursuits */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                Elegant Personal Hobbies & Leisure habits (我的业余雅致爱好 - 英文逗号分隔)
              </label>
              <input 
                type="text" 
                value={profile.personalHobbies ? profile.personalHobbies.join(', ') : ''}
                onChange={(e) => setProfile({...profile, personalHobbies: e.target.value.split(',').map(s => s.trim())})}
                placeholder="e.g., Guzheng playing, Watering balcony orchids, Calligraphy"
                className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            {/* Sports & Physical Fitness Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  My Sports & Fitness Habits (健力气韵/活力养生 - 英文逗号分隔)
                </label>
                <input 
                  type="text" 
                  value={profile.sportsActivities ? profile.sportsActivities.join(', ') : ''}
                  onChange={(e) => setProfile({...profile, sportsActivities: e.target.value.split(',').map(s => s.trim())})}
                  placeholder="e.g., Tai Chi flow, Health breathing walking, Scenic slow golf"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-650" />
                  My Social Gather Style (交往喜好与聚会偏好)
                </label>
                <input 
                  type="text" 
                  value={profile.socialPreferences || ''}
                  onChange={(e) => setProfile({...profile, socialPreferences: e.target.value})}
                  placeholder="e.g., Small-circle tea sessions, intimate heritage circle walks"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            {/* Profile Tagline */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">My Profile Tagline / Life Principle</label>
              <input 
                type="text" 
                value={profile.tagline}
                onChange={(e) => setProfile({...profile, tagline: e.target.value})}
                placeholder="A gentle motto that summarizes your outlook now..."
                className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-stone-800 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            {/* Emotional and Story Content */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">About Me & My Routines</label>
                <textarea 
                  value={profile.aboutMe}
                  onChange={(e) => setProfile({...profile, aboutMe: e.target.value})}
                  rows={3}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-stone-800 focus:outline-hidden placeholder-stone-400"
                />
              </div>

              <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100/60">
                <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                  🌿 Reflective Insight: What My Previous Marriage/Chapter Taught Me
                </label>
                <textarea 
                  value={profile.previousChapterInsight}
                  onChange={(e) => setProfile({...profile, previousChapterInsight: e.target.value})}
                  rows={2}
                  placeholder="Sharing constructive, peaceful perspective on what you learned helps connect with mature hearts with similar wisdom..."
                  className="w-full text-sm bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-hidden"
                />
                <p className="text-[10px] text-stone-400 mt-1">This insight helps find companions who have evolved past blame and value active personal growth.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">What matters to me in a companion today VS in my youth</label>
                <textarea 
                  value={profile.whatImLookingFor}
                  onChange={(e) => setProfile({...profile, whatImLookingFor: e.target.value})}
                  rows={2}
                  className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-stone-800 focus:outline-hidden focus:border-rose-500"
                />
              </div>
            </div>

            {/* Values checklists */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">My Core Partnership Values (Select up to 5)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableValues.map((v, idx) => {
                  const selected = profile.values.includes(v);
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleValueToggle(v)}
                      className={`text-xs py-2 px-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selected 
                          ? 'bg-rose-50 border-rose-300 text-rose-800 font-semibold' 
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <span>{v}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Icebreaker Configuration */}
            <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl space-y-4">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Configure My Guided Conversation Prompt</span>
              <div>
                <label className="block text-xs text-stone-400 mb-1.5 font-medium">Select a friendly starting prompt:</label>
                <select
                  value={profile.icebreakerQuestion}
                  onChange={(e) => setProfile({...profile, icebreakerQuestion: e.target.value})}
                  className="w-full text-xs bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 outline-hidden mb-3"
                >
                  <option value="The happiest moments in my weekly schedule look like...">"The happiest moments in my weekly schedule look like..."</option>
                  <option value="On a lazy Sunday, you can usually find me...">"On a lazy Sunday, you can usually find me..."</option>
                  <option value="A books or record album that shaped my perspective recently is...">"A books or record album that shaped my perspective recently is..."</option>
                  <option value="The most grounding piece of advice I received after building fresh is...">"The most grounding piece of advice I received after building fresh is..."</option>
                </select>

                <label className="block text-xs text-stone-400 mb-1.5 font-medium">Your reflective answer:</label>
                <textarea 
                  value={profile.icebreakerAnswer}
                  onChange={(e) => setProfile({...profile, icebreakerAnswer: e.target.value})}
                  rows={2}
                  className="w-full text-xs bg-stone-800 border border-stone-700 focus:border-rose-500 rounded-xl px-4 py-2 text-stone-100 outline-hidden"
                  placeholder="Give a warm, specific glimpse into your offline life..."
                />
              </div>
            </div>

            {/* Save Button & Status Alerts */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              {statusMessage ? (
                <p id="profile-success-msg" className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  {statusMessage}
                </p>
              ) : (
                <span className="text-xs text-stone-400 font-medium">Last saved: Just now (Local storage auto-synchronized)</span>
              )}

              <button
                type="submit"
                id="profile-save-btn"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving Chapter...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Journey Profile
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* High-Fidelity preview mode card matching DiscoverCompass details modal */
          <div id="profile-preview-card" className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden space-y-0">
            
            {/* Carousel Cover with Active Photo State */}
            <div className="relative aspect-[3/2] md:aspect-[16/10] bg-stone-900 overflow-hidden rounded-t-3xl border-b border-rose-100/30">
              {(() => {
                const selectedPhotos = profile.photos && profile.photos.length > 0 
                  ? profile.photos 
                  : [profile.avatar];
                const activePhotoUrl = selectedPhotos[activePhotoIndex] || profile.avatar;

                return (
                  <>
                    <img 
                      src={activePhotoUrl} 
                      alt={profile.name} 
                      className="w-full h-full object-cover transition-all duration-500" 
                    />
                    
                    {/* Carousel Navigation Arrows */}
                    {selectedPhotos.length > 1 && (
                      <>
                        <button 
                          type="button"
                          onClick={() => {
                            setActivePhotoIndex(prev => (prev === 0 ? selectedPhotos.length - 1 : prev - 1));
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900/40 hover:bg-stone-900/60 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 z-10"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setActivePhotoIndex(prev => (prev === selectedPhotos.length - 1 ? 0 : prev + 1));
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-900/40 hover:bg-stone-900/60 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 z-10"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Dot indicators */}
                    {selectedPhotos.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {selectedPhotos.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePhotoIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                              activePhotoIndex === idx 
                                ? 'bg-rose-500 scale-125 shadow-xs' 
                                : 'bg-white/50 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Cover Gradient & Floating Quick Tags */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none text-white z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-rose-650 font-sans text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-sm tracking-wider shadow-sm flex items-center gap-1">
                    🌹 {profile.companionGoal}
                  </span>
                  <span className="bg-stone-900/80 backdrop-blur-xs text-rose-250 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border border-rose-950/30">
                    {profile.relationshipStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Main content body containing 4 Layered Bio cards */}
            <div className="p-6 space-y-6 bg-[#FAF2F2]">
              
              {/* Layer I: Identity & Ancestral Background Code card */}
              <div id="preview-layer-1" className="p-5 bg-white border border-rose-200/50 shadow-3xs rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-500 text-sm">🏮</span>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 font-serif">Layer I: Identity & Ancestral Background (第一层：祖源命数之本)</h4>
                  </div>
                  <span className="text-[9.5px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-bold tracking-wider">CIVIL STATUS REPORT</span>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-rose-200 shadow-sm shrink-0 self-center md:self-start">
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif font-bold text-stone-900 leading-none">
                      {profile.name} <span className="font-sans text-sm font-semibold text-rose-700">({profile.age})</span>
                    </h3>
                    <p className="text-[10px] text-stone-500 font-sans tracking-wide">
                      {profile.occupation} • {profile.location}
                    </p>
                    <p className="text-xs text-stone-700 italic leading-relaxed py-1">
                      "{profile.tagline}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-stone-100/60">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                    <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Physical Frame</span>
                    <span className="font-bold text-stone-800 text-xs font-serif">{profile.height || '163 cm'} • {profile.weight || '52 kg'}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                    <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Zodiac Element</span>
                    <span className="font-bold text-rose-805 text-xs font-serif truncate block">{profile.chineseZodiac || 'Dog (🐶)'}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                    <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Ancestral Roots</span>
                    <span className="font-bold text-stone-850 text-xs font-serif truncate block" title={profile.ancestralRoots}>{profile.ancestralRoots || 'Zhejiang Roots'}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                    <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Parent Status</span>
                    <span className="font-semibold text-emerald-800 text-[10px] line-clamp-1 block" title={profile.childrenStatus}>{profile.childrenStatus || 'Settled independent'}</span>
                  </div>
                </div>
              </div>

              {/* Layer II: Experience Wisdom & Pathway Card */}
              <div id="preview-layer-2" className="p-5 bg-white border border-rose-200/50 shadow-3xs rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                  <span className="text-rose-500 text-sm">📜</span>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 font-serif">Layer II: Experience Wisdom & Pathway (第二层：吾心安处之章)</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider font-mono">Our Common Ground Story (生平详述与安顿追求)</span>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans mt-0.5">{profile.aboutMe}</p>
                  </div>

                  <div className="p-3.5 bg-amber-50/20 border border-amber-200/20 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-3 text-center md:text-left flex md:flex-col items-center md:items-start gap-1">
                      <span className="text-sm">🌿</span>
                      <span className="text-[9px] text-amber-800 font-extrabold uppercase font-mono tracking-wider">Life Chapter Insights</span>
                    </div>
                    <p className="md:col-span-9 text-[11px] leading-relaxed text-amber-955 border-t md:border-t-0 md:border-l border-amber-200/40 pt-2 md:pt-0 md:pl-3 italic col-span-9 font-serif">
                      "{profile.previousChapterInsight}"
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider font-mono block">Anchor Values Matchers (琴瑟合音核心德行)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.values.map((val, idx) => (
                        <span key={idx} className="bg-stone-50 hover:bg-stone-100 border border-stone-155 text-stone-700 text-[10px] px-2.5 py-1 rounded-lg font-mono">
                          🎻 {val}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer III: Active Rhythms, Hobbies & Wellness Card */}
              <div id="preview-layer-3" className="p-5 bg-white border border-rose-200/50 shadow-3xs rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                  <span className="text-rose-500 text-sm">🍵</span>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 font-serif">Layer III: Active Rhythms, Hobbies & Wellness (第三层：雅玩琴息养生)</h4>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-rose-800 font-bold uppercase tracking-wider font-mono block">My Fine Hobbies & Leisure Aesthetics (闲情雅致)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.personalHobbies && profile.personalHobbies.map((hobby, idx) => (
                        <span key={idx} className="bg-rose-55/40 hover:bg-rose-55 text-rose-800 text-[10px] px-2.5 py-1 rounded-lg border border-rose-200/20 font-medium">
                          ✦ {hobby}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1 border-t border-stone-100/50">
                    <div className="md:col-span-6 space-y-2">
                      <span className="text-[9.5px] text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-600" />
                        Sports, Breathing & Qigong (形骸气律)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.sportsActivities && profile.sportsActivities.map((sport, idx) => (
                          <span key={idx} className="bg-emerald-50/40 hover:bg-emerald-50/60 text-emerald-800 text-[10px] px-1.5 py-1 rounded-lg border border-emerald-100 font-sans font-medium">
                            🏃 {sport}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-6 p-3 bg-amber-50/20 rounded-xl border border-amber-200/20">
                      <span className="text-[9px] text-amber-800 font-bold uppercase tracking-wider font-mono block mb-1">My Social Rhythm & Preference (聚会交游喜好)</span>
                      <p className="text-[11px] leading-relaxed text-stone-600 italic">
                        "{profile.socialPreferences || 'Greatly prefers intimate, small-circle traditional sessions.'}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer IV: Preferred Partner Alignment expectations Card */}
              <div id="preview-layer-4" className="p-5 bg-white border border-rose-200/50 shadow-3xs rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                  <span className="text-amber-500 text-sm">🤝</span>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 font-serif">Layer IV: Partner Expectations & Matchmaker Guide (第四层：意中人通合期待)</h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                    <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Expected Age</span>
                    <span className="font-bold text-stone-800 text-xs font-serif">{profile.preferredPartnerAge || 'No limit'}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                    <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Expected Height</span>
                    <span className="font-bold text-stone-800 text-xs font-serif">{profile.preferredPartnerHeight || 'No limit'}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                    <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Academic Limit</span>
                    <span className="font-bold text-stone-800 text-[10px] truncate block" title={profile.preferredPartnerEducation}>
                      {profile.preferredPartnerEducation?.split(' (')[0] || profile.preferredPartnerEducation}
                    </span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                    <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Zodiac Roots</span>
                    <span className="font-bold text-stone-800 text-[10px] truncate block" title={profile.preferredPartnerRoots}>
                      {profile.preferredPartnerRoots?.split(' roots')[0] || profile.preferredPartnerRoots}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-rose-50/15 border border-rose-100/50 rounded-xl text-stone-700 leading-relaxed text-[10px]">
                  <span className="text-rose-700 block text-[9px] uppercase font-bold font-mono tracking-wider mb-1">Character Expectations Detail (性情期许与德行要求)</span>
                  <p className="italic font-medium text-stone-600">"{profile.preferredPartnerDescription}"</p>
                </div>
              </div>

              {/* Elegant Interactive Oracle Caller Icebreaker Card */}
              <div id="preview-layer-icebreaker" className="bg-stone-900 border border-stone-800 text-stone-100 p-5 rounded-2xl space-y-3.5">
                <div className="text-xs text-rose-300 font-bold uppercase tracking-widest font-serif flex items-center justify-between">
                  <span>❓ Interactive Chapter Opener (互动交流提问)</span>
                  <span className="bg-rose-650/35 text-rose-300 font-sans text-[8.5px] px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-wider text-right scale-95 origin-right">Active Connection Prompt</span>
                </div>
                <p className="text-xs text-stone-300 font-medium font-serif leading-relaxed italic">
                  "{profile.icebreakerQuestion}"
                </p>
                <div className="p-3.5 bg-[#1C1917] rounded-xl border border-stone-800/45 text-stone-100 text-xs italic font-sans leading-relaxed border-l-2 border-rose-500">
                  "{profile.icebreakerAnswer}"
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
