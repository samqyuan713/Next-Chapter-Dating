import React, { useState, useEffect } from 'react';
import { DatingProfile } from '../types';
import { COMPASS_PROFILES } from '../data/profiles';
import { 
  Heart, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Baby, 
  Compass, 
  MessageSquare,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Send,
  Users,
  CheckCircle2,
  FileText,
  Lock,
  Shield,
  ShieldCheck,
  HelpCircle,
  SlidersHorizontal,
  User,
  Activity,
  Coffee,
  Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiscoverCompassProps {
  onStartChat: (profile: DatingProfile, initialText?: string) => void;
  savedProfileIds: string[];
  onToggleSave: (profileId: string) => void;
  preferredGender?: 'male' | 'female' | 'all';
  onPreferredGenderChange?: (newPref: 'male' | 'female' | 'all') => void;
}

export function DiscoverCompass({ 
  onStartChat, 
  savedProfileIds, 
  onToggleSave,
  preferredGender = 'all',
  onPreferredGenderChange
}: DiscoverCompassProps) {
  const [profilesList, setProfilesList] = useState<DatingProfile[]>(COMPASS_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [selectedProfile, setSelectedProfile] = useState<DatingProfile | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  useEffect(() => {
    fetch('/api/profiles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map((u: any) => ({
            id: String(u.id || u.uid),
            name: u.name,
            age: u.age,
            gender: u.gender,
            location: u.location,
            occupation: u.occupation,
            avatar: u.avatar || u.photos?.[0],
            tagline: u.tagline,
            relationshipStatus: u.relationshipStatus,
            childrenStatus: u.childrenStatus,
            aboutMe: u.aboutMe,
            previousChapterInsight: u.previousChapterInsight,
            whatImLookingFor: u.whatImLookingFor,
            values: u.values || [],
            interests: u.interests || [],
            icebreakerQuestion: u.icebreakerQuestion,
            icebreakerAnswer: u.icebreakerAnswer,
            height: u.height,
            weight: u.weight,
            education: u.education,
            ancestralRoots: u.ancestralRoots,
            chineseZodiac: u.chineseZodiac,
            personalHobbies: u.personalHobbies || [],
            preferredPartnerAge: u.preferredPartnerAge,
            preferredPartnerHeight: u.preferredPartnerHeight,
            preferredPartnerEducation: u.preferredPartnerEducation,
            preferredPartnerRoots: u.preferredPartnerRoots,
            preferredPartnerDescription: u.preferredPartnerDescription,
            sportsActivities: u.sportsActivities || [],
            socialPreferences: u.socialPreferences,
            photos: u.photos || [u.avatar],
            uid: u.uid,
          }));
          setProfilesList(normalized);
        }
      })
      .catch(err => console.error("Could not load database profiles, using system presets:", err));
  }, []);

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [selectedProfile]);

  const [customIcebreaker, setCustomIcebreaker] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [discretionMode, setDiscretionMode] = useState<boolean>(true);

  // Traditional Astrological Lunar Oracle States for High User Retention
  const [userZodiac, setUserZodiac] = useState<string>('Tiger');
  const [oracleTipIndex, setOracleTipIndex] = useState<number>(0);
  const [calculatingOracle, setCalculatingOracle] = useState<boolean>(false);

  // Premium Loyalty Feature States (Orchid Society Membership Value)
  const [showHarmonyModal, setShowHarmonyModal] = useState(false);
  const [harmonyProfile, setHarmonyProfile] = useState<DatingProfile | null>(null);
  const [calculatingHarmony, setCalculatingHarmony] = useState(false);
  const [harmonyReportUnlocked, setHarmonyReportUnlocked] = useState(false);

  // Wax-sealed tea invitation states
  const [invitationTheme, setInvitationTheme] = useState<'standard' | 'red_packet'>('standard');
  const [selectedWaxSeal, setSelectedWaxSeal] = useState<'concord' | 'serenity' | 'sincerity'>('concord');
  const [isPouringWax, setIsPouringWax] = useState(false);
  const [waxAnimationStep, setWaxAnimationStep] = useState<string>(''); // '', 'heating', 'pouring', 'stamping', 'sealed'

  // Traditional Astrological Constellation Tips - Crafted for Sincere Romance & User Retention
  const LUNAR_ORACLE_TIPS = [
    {
      title: 'Pine Whispers & Morning Oolong (松风松涛 🍵)',
      idiom: '姻缘天赐，细水长流',
      description: 'Today’s energy supports slow Oolong brewing and quiet letter-drafting. A partner from a Southern coastal origin (Fujian/Guangdong roots) holds steady companion coordinates and peaceful life focus today.',
      auspiciousTime: '3:00 PM – 5:00 PM (Oolong Zenith Hour)',
      bestZodiacMatch: 'Ox (🐂) & Dragon (🐉)',
    },
    {
      title: 'Plum Blossom Destiny Resonance (梅影照水 🌸)',
      idiom: '心有灵犀，木石良琴',
      description: 'A beautiful 3-Harmony astrological chord forms this cycle! If a companion values zen tea tables, bonsai trimming, or slow breathing movement, today’s rapport promises double blessings. Sincerity yields rapid comfort.',
      auspiciousTime: '4:00 PM – 6:30 PM (Sunset Hearth Hour)',
      bestZodiacMatch: 'Goat (🐑) & Pig (🐖)',
    },
    {
      title: 'Ancestral Lakes and Quiet Moonlight (星汉璀璨 🌌)',
      idiom: '金玉良缘, 禧兆相和',
      description: 'Quiet minds and respectful filial values are illuminated. Your ancestral home coordinate suggests deep alignment with families of high academic stance. Approach queries with humble and honest posture.',
      auspiciousTime: '1:30 PM – 3:30 PM (Gentle Wind Hour)',
      bestZodiacMatch: 'Tiger (🐯) & Monkey (🐒)',
    },
    {
      title: 'Sincere Hearth Ochre Clay (陶然古意 🏡)',
      idiom: '朱砂禧信，同归同源',
      description: 'The constellation of filial devotion is in peak alignment with mature life milestones. Skip standard introductory chit-chat and directly mention a lesson from previous chapter insights for highest connection rate.',
      auspiciousTime: '6:00 PM – 8:00 PM (Candle Lit Quietude)',
      bestZodiacMatch: 'Goat (🐑) & Tiger (🐯)',
    }
  ];

  const handleRecalculateDestiny = () => {
    setCalculatingOracle(true);
    setTimeout(() => {
      setOracleTipIndex((prev) => (prev + 1) % LUNAR_ORACLE_TIPS.length);
      setCalculatingOracle(false);
    }, 1200);
  };

  // Traditional Search and Filter States
  const [selectedZodiac, setSelectedZodiac] = useState<string>('All');
  const [selectedEducation, setSelectedEducation] = useState<string>('All');
  const [selectedAncestry, setSelectedAncestry] = useState<string>('All');

  // Filter computations
  const filteredProfiles = profilesList.filter(profile => {
    // 0. Preferred Candidate Gender Filter
    if (preferredGender !== 'all' && profile.gender !== preferredGender) {
      return false;
    }
    // 1. Chinese Zodiac
    if (selectedZodiac !== 'All' && !profile.chineseZodiac?.includes(selectedZodiac)) {
      return false;
    }
    // 2. Education filter
    if (selectedEducation !== 'All') {
      if (selectedEducation === 'Higher') {
        const isHigher = profile.education?.toLowerCase().includes('master') || 
                         profile.education?.toLowerCase().includes('ph.d.') || 
                         profile.education?.toLowerCase().includes('doctorate') || 
                         profile.education?.toLowerCase().includes('b.sc.') || 
                         profile.education?.toLowerCase().includes('bachelor') || 
                         profile.education?.toLowerCase().includes('m.sc.');
        if (!isHigher) return false;
      }
    }
    // 3. Ancestral Roots
    if (selectedAncestry !== 'All') {
      const lowerRoots = profile.ancestralRoots?.toLowerCase() || '';
      if (selectedAncestry === 'Singapore') {
        if (!lowerRoots.includes('singapore') && !lowerRoots.includes('kerala')) return false;
      } else {
        if (!lowerRoots.includes(selectedAncestry.toLowerCase())) return false;
      }
    }
    return true;
  });

  const clampedIndex = filteredProfiles.length > 0 ? currentIndex % filteredProfiles.length : 0;
  const currentProfile = filteredProfiles[clampedIndex];

  const handleNext = () => {
    if (filteredProfiles.length === 0) return;
    setIsSent(false);
    setCustomIcebreaker('');
    setCurrentIndex((prev) => (prev + 1) % filteredProfiles.length);
  };

  const handlePrev = () => {
    if (filteredProfiles.length === 0) return;
    setIsSent(false);
    setCustomIcebreaker('');
    setCurrentIndex((prev) => (prev - 1 + filteredProfiles.length) % filteredProfiles.length);
  };

  const selectPrecomposedIcebreaker = (answer: string) => {
    setCustomIcebreaker(`I read your answer about "${answer.slice(0, 30)}..." and it really clicked with me. I'd love to chat and hear more about it!`);
  };

  const handleSendPrompt = () => {
    if (!customIcebreaker.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      onStartChat(selectedProfile || currentProfile, customIcebreaker);
      setIsSent(false);
      setCustomIcebreaker('');
      if (!selectedProfile) {
        handleNext();
      } else {
        setSelectedProfile(null);
      }
    }, 1500);
  };

  const handleSendWaxInvitation = () => {
    if (!customIcebreaker.trim()) return;
    setIsPouringWax(true);
    setWaxAnimationStep('heating');
    
    setTimeout(() => {
      setWaxAnimationStep('pouring');
    }, 800);

    setTimeout(() => {
      setWaxAnimationStep('stamping');
    }, 1800);

    setTimeout(() => {
      setWaxAnimationStep('sealed');
    }, 3000);

    setTimeout(() => {
      let sealIcon = '🈴 [Concord Seal / 和合之印]';
      if (selectedWaxSeal === 'serenity') sealIcon = '🍵 [Tea Serenity Seal / 禅茶之印]';
      if (selectedWaxSeal === 'sincerity') sealIcon = '💮 [Sincere Truth Seal / 真诚之印]';

      const enrichedPrompt = `${sealIcon} Premium Traditional Invitation: "${customIcebreaker}" \n\n(Sent via Next Chapter Orchid Society Wax-sealed Courier. Matchmaker notified for local tea house reserving.)`;
      
      onStartChat(selectedProfile || currentProfile, enrichedPrompt);
      
      setIsPouringWax(false);
      setWaxAnimationStep('');
      setCustomIcebreaker('');
      setSelectedProfile(null);
    }, 4500);
  };

  return (
    <div id="discover-compass-root" className="space-y-6">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm">
        <div>
          <h2 className="text-xl font-serif text-stone-800 font-semibold tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-600 animate-spin-slow" />
            Next Chapter Guided Compass
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Thoughtful matches based on family values, filial commitment, and quiet life chapters.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Gentle conservative Discretion Shield switch */}
          <button
            onClick={() => setDiscretionMode(!discretionMode)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
              discretionMode
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-3xs'
                : 'bg-stone-100 border-stone-200 text-stone-500 hover:text-stone-700'
            }`}
            title="Saves face and provides absolute privacy by softening portraits until warm invitation"
          >
            <Shield className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            <span>Discretion Shield: {discretionMode ? 'ON (Respectful Blur)' : 'OFF'}</span>
          </button>

          <div className="flex bg-stone-200/60 p-1 rounded-xl">
            <button
              id="view-card-btn"
              onClick={() => { setViewMode('card'); setSelectedProfile(null); }}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                viewMode === 'card'
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Guided Compass
            </button>
            <button
              id="view-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Browse Neighborhood
            </button>
          </div>
        </div>
      </div>

      {/* Traditional Criteria Filter Bar */}
      <div className="bg-stone-50 border border-stone-200/60 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-rose-600" />
          <div>
            <span className="text-xs font-serif font-bold text-stone-850 block">Heritage Matchmaker Filters (传统择偶筛选)</span>
            <span className="text-[10.5px] text-stone-500">Fine-tune matching nodes by cultural parameters, academics, and zodiac aspects.</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-xs w-full md:w-auto">
          {/* Chinese Zodiac */}
          <div className="flex flex-col gap-1 min-w-[120px]">
            <label className="text-[10px] uppercase font-bold text-stone-400">Chinese Zodiac (属相)</label>
            <select
              value={selectedZodiac}
              onChange={(e) => { setSelectedZodiac(e.target.value); setCurrentIndex(0); }}
              className="bg-white border border-stone-200.5/90 rounded-lg py-1.5 px-2 bg-no-repeat text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-rose-500/50"
            >
              <option value="All">All Zodiacs / 属相</option>
              <option value="Goat">Goat (🐑)</option>
              <option value="Ox">Ox (🐂)</option>
              <option value="Pig">Pig (🐖)</option>
              <option value="Monkey">Monkey (🐒)</option>
              <option value="Dragon">Dragon (🐉)</option>
              <option value="Tiger">Tiger (🐯)</option>
            </select>
          </div>

          {/* Academic qualifications */}
          <div className="flex flex-col gap-1 min-w-[130px]">
            <label className="text-[10px] uppercase font-bold text-stone-400">Education (学历)</label>
            <select
              value={selectedEducation}
              onChange={(e) => { setSelectedEducation(e.target.value); setCurrentIndex(0); }}
              className="bg-white border border-stone-200.5/90 rounded-lg py-1.5 px-2 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-rose-500/50"
            >
              <option value="All">All Diplomas / 学历</option>
              <option value="Higher">Postgrad Only (Master/Ph.D/M.Sc)</option>
            </select>
          </div>

          {/* Ancestor roots */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-[10px] uppercase font-bold text-stone-400">Ancestral Roots (籍贯)</label>
            <select
              value={selectedAncestry}
              onChange={(e) => { setSelectedAncestry(e.target.value); setCurrentIndex(0); }}
              className="bg-white border border-stone-200.5/90 rounded-lg py-1.5 px-2 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-rose-500/50"
            >
              <option value="All">All Regions / 籍贯</option>
              <option value="Guangdong">Guangdong (Panyu/Teochew)</option>
              <option value="Fujian">Fujian (Minnan)</option>
              <option value="Zhejiang">Zhejiang (Ningbo)</option>
              <option value="Korea">Korea (Seoul/Gyeonggi)</option>
              <option value="Singapore">Singapore / Kerala roots</option>
            </select>
          </div>

          {/* Looking For Gender Filter */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-[10px] uppercase font-bold text-stone-400">Looking For (期待缘分)</label>
            <select
              value={preferredGender}
              onChange={(e) => { onPreferredGenderChange?.(e.target.value as any); setCurrentIndex(0); }}
              className="bg-white border border-rose-200 rounded-lg py-1.5 px-2 text-rose-700 font-bold focus:outline-none focus:ring-1 focus:ring-rose-500/50"
            >
              <option value="all">Everyone (均可)</option>
              <option value="male">Men Only (仅显示男士)</option>
              <option value="female">Women Only (仅显示女士)</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedZodiac !== 'All' || selectedEducation !== 'All' || selectedAncestry !== 'All' || preferredGender !== 'all') && (
            <div className="flex items-end">
              <button 
                onClick={() => {
                  setSelectedZodiac('All');
                  setSelectedEducation('All');
                  setSelectedAncestry('All');
                  onPreferredGenderChange?.('all');
                  setCurrentIndex(0);
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium underline py-1.5 px-1 shrink-0"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LUXURIOUS DEEPLY ROMANTIC LUNAR ORACLE WIDGET (Triggers First-Glance Stickiness!) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-rose-200/60 p-5 rounded-2xl shadow-sm space-y-4 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-rose-500 p-2.5 rounded-xl text-stone-900 shadow-xs shrink-0">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
                禧福天书 • Matchmaker's Celestial Lunar Oracle
                <span className="bg-rose-500 text-stone-50 font-sans text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md animate-pulse">
                  Auspicious Hour Resonance Active
                </span>
              </h3>
              <p className="text-[10.5px] text-stone-500 mt-0.5">
                Unlock slow-matching compatibility: sync ancestral home coordinates, mutual hobbies & optimal astronomical hours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-stone-400 font-mono tracking-wider">Your Zodiac:</span>
            <select
              value={userZodiac}
              onChange={(e) => { setUserZodiac(e.target.value); handleRecalculateDestiny(); }}
              className="bg-white border border-stone-200 text-xs rounded-lg px-2.5 py-1 text-stone-700 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="Tiger">Tiger (🐯)</option>
              <option value="Goat">Goat (🐑)</option>
              <option value="Ox">Ox (🐂)</option>
              <option value="Pig">Pig (🐖)</option>
              <option value="Monkey">Monkey (🐒)</option>
              <option value="Dragon">Dragon (🐉)</option>
              <option value="Snake">Snake (🐍)</option>
              <option value="Dog">Dog (🐕)</option>
            </select>
            <button
              onClick={handleRecalculateDestiny}
              disabled={calculatingOracle}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl text-[10.5px] font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-[0.98]"
            >
              {calculatingOracle ? (
                <span className="inline-block w-3 h-3 rounded-full border-2 border-stone-100 border-t-transparent animate-spin" />
              ) : (
                <span>🔄 Recalculate Fortune</span>
              )}
            </button>
          </div>
        </div>

        {calculatingOracle ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent animate-spin rounded-full" />
            <p className="text-[10.5px] text-amber-800 italic animate-pulse font-serif">Consulting ancestral Matchmaker Scrolls for Year of the {userZodiac}...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 items-stretch">
            <div className="md:col-span-3 bg-white/70 border border-amber-200/50 p-4 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                  <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                    <span>🏵️</span> {LUNAR_ORACLE_TIPS[oracleTipIndex].title}
                  </span>
                  <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200/30 px-2 py-0.5 rounded-md font-serif font-semibold">
                    {LUNAR_ORACLE_TIPS[oracleTipIndex].idiom}
                  </span>
                </div>
                <p className="text-[11px] text-stone-700 leading-relaxed font-sans mt-2 italic">
                  "{LUNAR_ORACLE_TIPS[oracleTipIndex].description}"
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-rose-50/45 p-4 rounded-xl border border-amber-200/40 flex flex-col justify-between space-y-2">
              <div>
                <span className="block text-[8.5px] uppercase font-bold text-stone-400 font-mono tracking-wider">Auspicious Destiny Hour</span>
                <strong className="block text-[11px] text-stone-900 font-serif leading-tight mt-1">{LUNAR_ORACLE_TIPS[oracleTipIndex].auspiciousTime}</strong>
              </div>
              <div className="pt-2 border-t border-amber-200/30">
                <span className="block text-[8.5px] uppercase font-bold text-stone-400 font-mono tracking-wider">Best Zodiac Match Today</span>
                <span className="text-[11px] font-bold text-rose-700 font-sans block mt-0.5">{LUNAR_ORACLE_TIPS[oracleTipIndex].bestZodiacMatch}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="bg-stone-200/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-stone-500">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif font-semibold text-stone-805">No Matchmaking Criteria Met</h3>
          <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
            Our neighborhood circles value specific alignments. No profiles match this exact combination of Chinese Zodiac, Academics, and Ancestral roots. Try clearing some selections above to welcome new alignment possibilities.
          </p>
          <button
            onClick={() => {
              setSelectedZodiac('All');
              setSelectedEducation('All');
              setSelectedAncestry('All');
              setCurrentIndex(0);
            }}
            className="px-5 py-2 bg-stone-850 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Show All Neighbors
          </button>
        </div>
      ) : viewMode === 'card' && currentProfile ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          {/* Card visual showcase with premium photo carousel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square sm:aspect-[4/5] rounded-[32px] overflow-hidden border border-rose-100 bg-stone-100 shadow-xl group premium-gold-border smooth-spring hover:scale-[1.01] hover:shadow-2xl">
              
              {/* Picture Carousels - Instagram/Hinge style bars at top */}
              {currentProfile.photos && currentProfile.photos.length > 1 && (
                <div className="absolute top-4 inset-x-4 z-20 flex gap-1.5 px-2">
                  {currentProfile.photos.map((_, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setActivePhotoIndex(pIdx)}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        activePhotoIndex === pIdx 
                          ? 'bg-rose-500 shadow-md scale-y-110' 
                          : 'bg-white/40 hover:bg-white/70'
                      }`}
                      title={`View photo ${pIdx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Photos Slide with Discretion Blur */}
              <div className="w-full h-full relative">
                <img 
                  src={(currentProfile.photos && currentProfile.photos[activePhotoIndex]) || currentProfile.avatar} 
                  alt={`${currentProfile.name} photo`} 
                  className={`w-full h-full object-cover transition-all duration-700 ${discretionMode ? 'filter blur-[24px] grayscale opacity-85' : 'group-hover:scale-105'}`}
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right Click zones on image to cycle */}
                {!discretionMode && currentProfile.photos && currentProfile.photos.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActivePhotoIndex(prev => Math.max(0, prev - 1))}
                      disabled={activePhotoIndex === 0}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-stone-950/40 to-transparent hover:text-rose-450 text-white z-10 transition-all ${activePhotoIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <ChevronLeft className="w-6 h-6 stroke-[3]" />
                    </button>
                    <button 
                      onClick={() => setActivePhotoIndex(prev => Math.min(currentProfile.photos.length - 1, prev + 1))}
                      disabled={activePhotoIndex === currentProfile.photos.length - 1}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-l from-stone-950/40 to-transparent hover:text-rose-450 text-white z-10 transition-all ${activePhotoIndex === currentProfile.photos.length - 1 ? 'opacity-0 cursor-default' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <ChevronRight className="w-6 h-6 stroke-[3]" />
                    </button>
                  </>
                )}
              </div>

              {discretionMode && (
                <div className="absolute inset-0 bg-stone-950/75 z-20 flex flex-col items-center justify-center p-6 text-center select-none">
                  <div className="bg-rose-500/10 border border-rose-500/35 p-4 rounded-full mb-3 text-rose-300 animate-pulse">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="bg-rose-950/90 text-rose-300 border border-rose-500/20 text-[10px] tracking-widest font-bold uppercase px-3 py-1 rounded-md mb-2">
                    Discretion Blur On
                  </span>
                  <p className="text-stone-300 text-[11px] mt-1 leading-relaxed max-w-xs px-2">
                    Portrait softened out of traditional respect. Tap the <strong className="text-rose-300 font-bold">"Discretion Shield"</strong> above to view their picture or explore their deep virtues.
                  </p>
                </div>
              )}

              {/* Bottom Card Info Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent flex flex-col justify-end p-6 text-white pointer-events-none z-10">
                <span className="bg-gradient-to-r from-rose-500 to-rose-700 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full w-max mb-3.5 shadow-md">
                  {currentProfile.relationshipStatus}
                </span>
                
                <h3 className="text-2xl font-serif font-black tracking-tight text-white flex items-center gap-2">
                  {currentProfile.name}, {currentProfile.age}
                  <span className="inline-block w-2.5 h-2.5 bg-emerald-450 rounded-full animate-pulse" title="Online now" />
                </h3>
                
                <p className="text-stone-200 text-xs italic mt-1.5 font-medium leading-relaxed">
                  "{currentProfile.tagline}"
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/20 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-455 shrink-0" />
                    <span className="font-medium truncate">{currentProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-rose-455 shrink-0" />
                    <span className="truncate font-medium">{currentProfile.occupation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick deck navigation controls with beautiful matching design */}
            <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
              <button
                id="deck-prev-btn"
                onClick={handlePrev}
                className="px-4 py-2.5 text-stone-650 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all text-xs font-bold"
              >
                Previous
              </button>

              <button
                id="deck-save-btn"
                onClick={() => onToggleSave(currentProfile.id)}
                className={`p-3 rounded-full border transition-all smooth-spring hover:scale-110 active:scale-95 ${
                  savedProfileIds.includes(currentProfile.id)
                    ? 'bg-amber-100 border-amber-300 text-amber-600 shadow-sm'
                    : 'bg-white border-stone-200 text-stone-400 hover:text-stone-600'
                }`}
                title="Bookmark Profile"
              >
                <Bookmark className="w-4.5 h-4.5 fill-current" />
              </button>

              <button
                id="deck-next-btn"
                onClick={handleNext}
                className="px-5 py-2.5 bg-stone-900 hover:bg-rose-700 text-white rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md hover:translate-x-0.5 smooth-spring"
              >
                Next Neighbor
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Profile Emotional Bio Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Insight Badge row */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-stone-100 text-stone-700 text-xs font-medium px-3 py-1 rounded-xl border border-stone-200/40 flex items-center gap-1.5">
                <Baby className="w-3.5 h-3.5 text-stone-400" />
                {currentProfile.childrenStatus}
              </span>
              <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                {currentProfile.compatibilityScore}% Harmonious Alignment
              </span>
            </div>

            {/* Story Card */}
            <div className="bg-gradient-to-r from-stone-50 to-stone-50/50 p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400">About Me</h4>
                <p className="mt-1.5 text-stone-700 leading-relaxed text-sm">
                  {currentProfile.aboutMe}
                </p>
              </div>

              {/* The Previous Chapter Insight (Core Value for middleaged dating) */}
              <div className="p-4 bg-amber-55/15 rounded-xl border border-amber-200/20">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-800 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  Lessons from My Previous Chapters
                </span>
                <p className="mt-1.5 text-stone-800 text-sm font-serif italic leading-relaxed">
                  "{currentProfile.previousChapterInsight}"
                </p>
              </div>

              {/* Family & Cultural Alignment Matrix for Conservative Settings */}
              <div className="p-4 bg-emerald-50/20 rounded-xl border border-emerald-200/20 space-y-2.5">
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Cultural & Family Alignment Parameters
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed text-stone-600">
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-100/30">
                    <span className="font-bold text-stone-700 block text-xs">Family Blessing Alignment</span>
                    Dutifully honors elders and respects parents. Highly values multi-generational family harmony.
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-100/30">
                    <span className="font-bold text-stone-700 block text-xs">Discretion Parameter</span>
                    Strict privacy controls. Zero public listing or shallow swipes—focus is character first.
                  </div>
                </div>
              </div>

              {/* Traditional Matchmaker Credentials Panel */}
              <div className="p-4 bg-stone-50/60 rounded-xl border border-stone-200/50 space-y-3">
                <span className="text-xs uppercase tracking-wider font-bold text-stone-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-500" />
                  Heritage Matchmaker Credentials (传统择偶指标)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-stone-200/30">
                    <span className="text-stone-400 block text-[9px] uppercase font-semibold">Height (身高)</span>
                    <span className="font-bold text-stone-800">{currentProfile.height || 'N/A'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200/30">
                    <span className="text-stone-400 block text-[9px] uppercase font-semibold">Weight (体重)</span>
                    <span className="font-bold text-stone-800">{currentProfile.weight || 'N/A'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200/30">
                    <span className="text-stone-400 block text-[9px] uppercase font-semibold">Chinese Zodiac (属相)</span>
                    <span className="font-bold text-stone-800">{currentProfile.chineseZodiac || 'N/A'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-stone-200/30">
                    <span className="text-stone-400 block text-[9px] uppercase font-semibold">Ancestral Origin (祖籍籍贯)</span>
                    <span className="font-bold text-stone-800 line-clamp-1" title={currentProfile.ancestralRoots}>{currentProfile.ancestralRoots || 'N/A'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200/30">
                    <span className="text-stone-400 block text-[9px] uppercase font-semibold">Academic Credentials (学历)</span>
                    <span className="font-bold text-stone-800 line-clamp-1" title={currentProfile.education}>{currentProfile.education || 'N/A'}</span>
                  </div>
                </div>

                {/* Embedded Premium Harmony Seal Trigger */}
                <button 
                  onClick={() => {
                    setHarmonyProfile(currentProfile);
                    setShowHarmonyModal(true);
                    setCalculatingHarmony(true);
                    setHarmonyReportUnlocked(false);
                    setTimeout(() => {
                      setCalculatingHarmony(false);
                    }, 2400);
                  }}
                  className="w-full bg-gradient-to-r from-amber-500/5 to-rose-500/5 hover:from-amber-500/10 hover:to-rose-500/10 border border-amber-500/20 text-stone-800 font-serif text-xs p-3 rounded-xl flex items-center justify-between transition-all group active:scale-[0.98] mt-1"
                >
                  <span className="flex items-center gap-2 text-left">
                    <span className="text-amber-600 font-bold text-base select-none">💮</span>
                    <span>
                      <strong className="block text-stone-850 font-serif text-xs font-semibold">Verify Companion Harmony Seal & Roots Resonance (朱砂瑞玺相契)</strong>
                      <span className="text-[10px] text-stone-500 block font-sans">Calculates celestial zodiac 3-harmonies & ancestral roots alignment and companion rapport</span>
                    </span>
                  </span>
                  <span className="bg-amber-600 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-lg tracking-wider font-sans shrink-0 group-hover:bg-rose-700 transition-all">
                    Verify
                  </span>
                </button>
              </div>

              {/* Preferred Partner expectations Panel */}
              <div id="preferred-partner-panel" className="p-4 bg-rose-50/15 rounded-xl border border-rose-200/20 space-y-3">
                <span className="text-xs uppercase tracking-wider font-bold text-rose-850 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
                  Ideal Partner Expectations (意中人择偶条件 & 期待匹配)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-stone-200/30">
                    <span className="text-stone-400 block text-[9px] uppercase font-semibold">Expected Age (期望年龄)</span>
                    <span className="font-bold text-stone-800">{currentProfile.preferredPartnerAge || 'No limit'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200/30">
                    <span className="text-stone-400 block text-[9px] uppercase font-semibold">Expected Height (意向身高)</span>
                    <span className="font-bold text-stone-800">{currentProfile.preferredPartnerHeight || 'No limit'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-stone-200/30">
                    <span className="text-stone-400 block text-[9px] uppercase font-semibold">Academic expectation (学历要求)</span>
                    <span className="font-bold text-stone-800 line-clamp-1" title={currentProfile.preferredPartnerEducation}>
                      {currentProfile.preferredPartnerEducation || 'Honorable standard'}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200/30">
                    <span className="text-stone-400 block text-[9px] uppercase font-semibold">Preferred Ancestry / Roots (合意籍贯)</span>
                    <span className="font-bold text-stone-800 line-clamp-1" title={currentProfile.preferredPartnerRoots}>
                      {currentProfile.preferredPartnerRoots || 'Open/Harmonious'}
                    </span>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-lg border border-stone-200/30 text-[11.5px] leading-relaxed text-stone-700">
                  <span className="text-stone-400 block text-[9px] uppercase font-semibold mb-0.5">Character & Standard Harmony (择偶气质期望)</span>
                  <p className="italic text-stone-600">"{currentProfile.preferredPartnerDescription || 'A supportive partner who respects family values.'}"</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400">What I cherish in partnership now</h4>
                <p className="mt-1.5 text-stone-700 text-sm leading-relaxed">
                  {currentProfile.whatImLookingFor}
                </p>
              </div>
            </div>

            {/* Shared Values and Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-stone-200/60">
                <h5 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">My Core Virtues</h5>
                <div id="values-list" className="flex flex-wrap gap-1.5">
                  {currentProfile.values.map((v, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-700 text-xs px-2.5 py-1 rounded-lg">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200/60 font-sans">
                <h5 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                  Life Hobbies & Peaceful Habits (个人常年业余爱好)
                </h5>
                <div id="personal-hobbies-list" className="flex flex-col gap-1.5 mt-2.5">
                  {(currentProfile.personalHobbies || currentProfile.interests).map((hobby, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-stone-50/75 p-2 rounded-lg border border-stone-100 text-xs text-stone-700 font-medium animate-fade-in">
                      <span className="text-rose-500 text-[10px]">✦</span>
                      <span>{hobby}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sports and Social Circle Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-stone-200/60 font-sans">
                <h5 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  Sports & Fitness Vitality (养生运动与活力)
                </h5>
                <div id="sports-activities-list" className="flex flex-col gap-1.5 mt-2.5">
                  {(currentProfile.sportsActivities || ['Morning flow Tai Chi (太极拳)', 'Gentle breathing walking']).map((sport, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-emerald-50/20 p-2 rounded-lg border border-emerald-100/30 text-xs text-stone-700 font-medium animate-fade-in">
                      <span className="text-emerald-600 text-[10px]">🏃</span>
                      <span>{sport}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200/60 font-sans">
                <h5 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                  Social & Circle Style (雅致交往聚会风尚)
                </h5>
                <div className="p-3 bg-amber-50/15 rounded-lg border border-amber-200/20 text-xs text-stone-700 leading-relaxed italic mt-2">
                  "{currentProfile.socialPreferences || 'Greatly prefers intimate, small-circle traditional sessions and quiet family dinners; avoids high-density noisy public parties.'}"
                </div>
              </div>
            </div>

            {/* Interactive Icebreaker Prompt & Premium Wax-Sealed Invitation */}
            <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-md space-y-4 relative">
              
              {/* Animation overlay for wax-sealing process */}
              {isPouringWax && (
                <div className="absolute inset-0 bg-stone-950/95 z-30 flex flex-col items-center justify-center p-6 text-center rounded-2xl animate-fade-in space-y-4">
                  <div className="relative w-16 h-16">
                    {waxAnimationStep === 'heating' && (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
                        🕯️
                      </div>
                    )}
                    {waxAnimationStep === 'pouring' && (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
                        🍯
                      </div>
                    )}
                    {waxAnimationStep === 'stamping' && (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl animate-ping text-rose-500">
                        🈴
                      </div>
                    )}
                    {waxAnimationStep === 'sealed' && (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl text-amber-500 animate-pulse">
                        💮
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-serif font-bold text-sm text-amber-400">
                      {waxAnimationStep === 'heating' && "Melting traditional crimson sealing wax..."}
                      {waxAnimationStep === 'pouring' && "Pouring warm wax over hand-folded cover..."}
                      {waxAnimationStep === 'stamping' && "Pressing solid brass seal respectfully..."}
                      {waxAnimationStep === 'sealed' && "Inscribed beautifully. Dispatching standard..."}
                    </p>
                    <p className="text-[10px] text-stone-400 max-w-xs mx-auto">
                      {waxAnimationStep === 'heating' && "Preparing pure candle flame and retro copper spoon."}
                      {waxAnimationStep === 'pouring' && "Depositing thick scarlet seal over the gold-threaded papers."}
                      {waxAnimationStep === 'stamping' && "Imprinting your designated traditional seal into the molten layer."}
                      {waxAnimationStep === 'sealed' && "Certified companion registry is dispatched. Hand-delivering next copy."}
                    </p>
                  </div>

                  {/* Progress Line */}
                  <div className="w-48 h-1 bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-1000" 
                      style={{ 
                        width: 
                          waxAnimationStep === 'heating' ? '25%' : 
                          waxAnimationStep === 'pouring' ? '50%' : 
                          waxAnimationStep === 'stamping' ? '75%' : '100%' 
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-start gap-2.5">
                  <div className="bg-rose-950 p-1.5 rounded-lg text-rose-400 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] text-rose-400/90 font-bold uppercase tracking-widest font-mono">Dialogue Invitation Spotlight</span>
                    <h4 className="text-xs font-serif text-stone-300">
                      "{currentProfile.icebreakerQuestion}"
                    </h4>
                  </div>
                </div>

                {/* Theme Selector Tab Buttons */}
                <div className="flex bg-stone-800 p-0.5 rounded-xl border border-stone-700/60 self-end sm:self-auto">
                  <button 
                    onClick={() => { setInvitationTheme('standard'); }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${invitationTheme === 'standard' ? 'bg-stone-900 text-stone-50 shadow-xs' : 'text-stone-400 hover:text-stone-200'}`}
                  >
                    💬 Standard
                  </button>
                  <button 
                    onClick={() => { setInvitationTheme('red_packet'); }}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 ${invitationTheme === 'red_packet' ? 'bg-gradient-to-r from-amber-600 to-rose-700 text-white shadow-xs' : 'text-amber-500/80 hover:text-amber-400'}`}
                  >
                    🧧 Wax Seal Invitation
                  </button>
                </div>
              </div>

              {/* Display Icebreaker Question answer text */}
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/40 text-stone-300 font-sans text-xs italic leading-relaxed">
                "{currentProfile.icebreakerAnswer}"
              </div>

              {/* RENDER INVITATION FORM DYNAMICALLY */}
              {invitationTheme === 'red_packet' ? (
                /* RED PACKET CUSTOMIZATION BOX */
                <div className="bg-gradient-to-br from-rose-950/80 via-rose-900/60 to-stone-950 border border-amber-600/35 p-4 rounded-xl space-y-4 relative overflow-hidden animate-fade-in">
                  
                  {/* Visual Gold Thread background accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

                  <div className="flex flex-col sm:flex-row justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider font-mono flex items-center gap-1">
                        🏺 Design Your Wax Stamp Preference
                      </span>
                      <p className="text-[9.5px] text-stone-300 leading-tight">
                        Choose a stamped blessing that signals true maturity, respect, and honorable intent.
                      </p>
                    </div>

                    {/* Seal Stamp selection list */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedWaxSeal('concord')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-serif font-semibold border flex items-center gap-1.5 transition-all ${selectedWaxSeal === 'concord' ? 'bg-amber-600 text-white border-amber-400' : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200'}`}
                        title="Concord & Harmony Seal"
                      >
                        <span className="text-sm">🈴</span>
                        <span>和合 (Concord)</span>
                      </button>

                      <button 
                        onClick={() => setSelectedWaxSeal('serenity')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-serif font-semibold border flex items-center gap-1.5 transition-all ${selectedWaxSeal === 'serenity' ? 'bg-amber-600 text-white border-amber-400' : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200'}`}
                        title="Quiet Tea Mind Seal"
                      >
                        <span className="text-sm">🍵</span>
                        <span>茶缘 (Tea Mind)</span>
                      </button>

                      <button 
                        onClick={() => setSelectedWaxSeal('sincerity')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-serif font-semibold border flex items-center gap-1.5 transition-all ${selectedWaxSeal === 'sincerity' ? 'bg-amber-600 text-white border-amber-400' : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200'}`}
                        title="Sincere Truth Seal"
                      >
                        <span className="text-sm">💮</span>
                        <span>真诚 (Sincerity)</span>
                      </button>
                    </div>
                  </div>

                  {/* Input form */}
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-mono text-stone-400">Your Letter content inside red packet:</label>
                    <div className="relative">
                      <textarea
                        value={customIcebreaker}
                        onChange={(e) => setCustomIcebreaker(e.target.value)}
                        placeholder={`Address ${currentProfile.name} respectfully. e.g. "I found deep comfort reading about your Bonsai care and peaceful life values. It would be my honor to invite you to a formal afternoon Oolong session..."`}
                        rows={3}
                        className="w-full text-xs bg-stone-950/70 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-500 transition-all resize-none outline-hidden leading-relaxed"
                      />
                      
                      {/* Interactive floating preview badge of chosen seal */}
                      <div className="absolute right-3.5 bottom-3 text-2xl select-none filter drop-shadow-md animate-pulse">
                        {selectedWaxSeal === 'concord' && "🈴"}
                        {selectedWaxSeal === 'serenity' && "🍵"}
                        {selectedWaxSeal === 'sincerity' && "💮"}
                      </div>
                    </div>
                  </div>

                  {/* Pricing conversion guide bar within draft box */}
                  <div className="p-2.5 bg-amber-950/30 rounded-lg border border-amber-500/10 text-[10px] text-amber-200 flex items-center justify-between gap-2">
                    <span>
                      📌 <strong>Orchid Premium Perk:</strong> Dispatches a physical calligraphed letter and a premium tea sample directly to {currentProfile.name}'s verified match cabinet.
                    </span>
                    <span className="underline cursor-pointer hover:text-white shrink-0 font-bold">Learn More</span>
                  </div>

                  {/* Submit Box */}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-stone-400">Requires 1 Master Seal Stamp (Free standard monthly stamp active)</span>
                    <button
                      onClick={handleSendWaxInvitation}
                      disabled={!customIcebreaker.trim() || isPouringWax}
                      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-600 text-stone-950 font-bold hover:from-amber-400 hover:to-rose-500 rounded-xl transition-all text-xs shadow-md flex items-center gap-1.5 active:scale-[0.98]"
                    >
                      <span>🎴 Seal & Dispatch Invitation</span>
                    </button>
                  </div>

                </div>
              ) : (
                /* STANDARD CHAT PROMPT OPTIONS */
                <div className="space-y-3 animate-fade-in">
                  <label className="block text-xs font-semibold text-stone-400">
                    Select a quick supportive conversation starter:
                  </label>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => selectPrecomposedIcebreaker(currentProfile.tagline)}
                      className="text-[11.5px] bg-stone-850 text-stone-300 hover:bg-stone-800 hover:text-stone-100 px-3 py-1.5 rounded-lg border border-stone-800 transition-all text-left max-w-full truncate"
                    >
                      💬 Respectfully align with their tagline
                    </button>
                    <button
                      onClick={() => selectPrecomposedIcebreaker(currentProfile.icebreakerAnswer)}
                      className="text-[11.5px] bg-stone-850 text-stone-300 hover:bg-stone-800 hover:text-stone-100 px-3 py-1.5 rounded-lg border border-stone-800 transition-all text-left max-w-full truncate"
                    >
                      🏡 Respond to their peaceful Sunday routine
                    </button>
                  </div>

                  <div className="relative">
                    <textarea
                      id="icebreaker-msg-input"
                      value={customIcebreaker}
                      onChange={(e) => setCustomIcebreaker(e.target.value)}
                      placeholder="Write a genuine note of comfort or a respectful family status inquiry..."
                      rows={2}
                      className="w-full text-xs bg-stone-800/80 border border-stone-700/80 focus:border-rose-600 focus:ring-1 focus:ring-rose-600/50 rounded-xl px-4 py-2.5 text-stone-100 placeholder-stone-500 transition-all resize-none outline-hidden"
                    />
                    <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
                      {customIcebreaker.trim() && (
                        <button
                          id="send-icebreaker-btn"
                          onClick={handleSendPrompt}
                          disabled={isSent}
                          className={`p-1.5 rounded-lg transition-all ${
                            isSent 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-rose-600 text-white hover:bg-rose-700'
                          }`}
                        >
                          {isSent ? <CheckCircle2 className="w-4 h-4 animate-bounce" /> : <Send className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {isSent && (
                    <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 animate-pulse">
                      <CheckCircle2 className="w-4 h-4" /> Message delivered confidently. Opening conversation...
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        /* The Neighborhood Board Grid view (Ideal for scanning matches) */
        <div id="neighborhood-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <div 
              key={profile.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/60 shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo header */}
              <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className={`w-full h-full object-cover transition-all duration-500 ${discretionMode ? 'filter blur-[15px] grayscale' : ''}`}
                  referrerPolicy="no-referrer"
                />

                {discretionMode && (
                  <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center pointer-events-none">
                    <Lock className="w-4 h-4 text-emerald-300 mb-1" />
                    <span className="text-[9px] uppercase tracking-wider font-bold text-stone-200">Discretion Blurring</span>
                  </div>
                )}

                <button
                  onClick={() => onToggleSave(profile.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-xs border transition-all ${
                    savedProfileIds.includes(profile.id)
                      ? 'bg-amber-100 border-amber-300 text-amber-600 shadow-xs'
                      : 'bg-stone-900/60 border-white/10 text-stone-200 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                </button>
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                  <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md">
                    {profile.relationshipStatus}
                  </span>
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    {profile.compatibilityScore}% Matches
                  </span>
                </div>
              </div>

              {/* Bio block */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-serif font-semibold text-stone-800">
                      {profile.name}, {profile.age}
                    </h3>
                    <span className="text-xs text-stone-400 font-mono tracking-tight">{profile.location}</span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-1">{profile.occupation}</p>
                  <p className="text-xs text-stone-600 italic line-clamp-2 mt-2 leading-relaxed">
                    "{profile.tagline}"
                  </p>

                  {/* Small Traditional Matchmaker Stats (Quick Scan) */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-stone-500 bg-stone-50/50 p-2 text-stone-650 rounded-xl border border-stone-200/40">
                    <div>
                      <span className="text-[8px] font-bold text-stone-400 block uppercase">Credentials (身高/属相)</span>
                      <span className="font-semibold text-stone-700">{profile.height} · {profile.chineseZodiac?.split(' ')[0]}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-stone-400 block uppercase">Heritage Roots (祖籍籍贯)</span>
                      <span className="font-semibold text-stone-700 truncate block" title={profile.ancestralRoots}>{profile.ancestralRoots?.split(' ')[0] || 'Roots'}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {profile.values.slice(0, 3).map((val, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-700 text-[10px] px-2 py-0.5 rounded-md">
                      {val}
                    </span>
                  ))}
                  <span className="bg-rose-50/50 text-rose-800 text-[10px] px-2 py-0.5 rounded-md border border-rose-100/10 shrink-0">
                    {profile.childrenStatus.split(' ')[0]} Kids
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProfile(profile)}
                    className="flex-1 text-xs bg-stone-100 text-stone-700 hover:bg-stone-200/70 border border-stone-200/50 py-2.5 rounded-xl font-medium transition-all"
                  >
                    View Deep Story
                  </button>
                  <button
                    onClick={() => onStartChat(profile, "Hello " + profile.name + ", I loved reading your Next Chapter profile tagline!")}
                    className="p-2.5 bg-rose-600 text-white hover:bg-rose-700 rounded-xl shadow-xs transition-all flex items-center justify-center shrink-0"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Deep Story Modal Overlay for Browse neighborhood mode */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8"
            >
              {/* Cover Carousel with multiple photo support */}
              <div className="relative aspect-[3/2] md:aspect-[16/10] bg-stone-900 overflow-hidden rounded-t-3xl border-b border-rose-100/30">
                {(() => {
                  const selectedPhotos = selectedProfile.photos && selectedProfile.photos.length > 0 
                    ? selectedProfile.photos 
                    : [selectedProfile.avatar];
                  const activePhotoUrl = selectedPhotos[activePhotoIndex] || selectedProfile.avatar;

                  return (
                    <>
                      <img 
                        src={activePhotoUrl} 
                        alt={selectedProfile.name} 
                        className={`w-full h-full object-cover transition-all duration-500 ${discretionMode ? 'filter blur-2xl grayscale' : ''}`}
                        referrerPolicy="no-referrer"
                      />

                      {discretionMode && (
                        <div className="absolute inset-0 bg-stone-900/65 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center select-none">
                          <Lock className="w-5 h-5 text-emerald-300 mb-1" />
                          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md">Discretion cover active</span>
                        </div>
                      )}

                      {/* Photo navigation overlay */}
                      {!discretionMode && selectedPhotos.length > 1 && (
                        <>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhotoIndex((prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length);
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-stone-900/60 hover:bg-stone-900/80 hover:scale-105 active:scale-95 text-white rounded-full backdrop-blur-xs z-10 transition-all cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhotoIndex((prev) => (prev + 1) % selectedPhotos.length);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-stone-900/60 hover:bg-stone-900/80 hover:scale-105 active:scale-95 text-white rounded-full backdrop-blur-xs z-10 transition-all cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Dot Indicators */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                            {selectedPhotos.map((_, dotIdx) => (
                              <button 
                                key={dotIdx}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(dotIdx); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${activePhotoIndex === dotIdx ? 'w-5 bg-rose-500' : 'w-1.5 bg-white/60'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent flex flex-col justify-end p-6 pointer-events-none z-5">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 inline-block">
                              {selectedProfile.relationshipStatus}
                            </span>
                            <h3 className="text-2xl font-serif font-bold text-white leading-tight">
                              {selectedProfile.name}, {selectedProfile.age}
                            </h3>
                            <p className="text-stone-200 text-xs mt-1">{selectedProfile.occupation} • {selectedProfile.location}</p>
                          </div>
                          <span className="bg-emerald-500/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full shrink-0 shadow-xs">
                            {selectedProfile.compatibilityScore}% Compatibility
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}

                <button 
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 right-4 bg-stone-900/50 text-stone-100 hover:text-white p-2 rounded-full backdrop-blur-xs z-20 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Story Content - Beautifully Aligned Multi-Layer Bio-data */}
              <div className="p-6 space-y-6 max-h-[58vh] overflow-y-auto bg-[#FAF2F2]">
                
                {/* Dynamic Tagline Banner */}
                <div className="text-center py-3.5 px-4 bg-white/80 border border-rose-100/50 rounded-2xl shadow-3xs">
                  <p className="text-stone-800 text-sm font-serif italic font-semibold leading-relaxed">
                    “ {selectedProfile.tagline} ”
                  </p>
                </div>

                {/* Layer I: Physical and Ancestor Credentials Card */}
                <div id="modal-layer-1" className="p-5 bg-white border border-rose-200/50 shadow-3xs rounded-2xl space-y-4 relative overflow-hidden transition-all duration-300">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-rose-500/5 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                    <span className="text-rose-600 text-sm">🏵️</span>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 font-serif">Layer I: Identity & Ancestral Background (祖源命数之本)</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-stone-50/80 rounded-xl border border-stone-100">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Zodiac Sign (生肖)</span>
                      <span className="font-bold text-stone-800 font-serif text-[11px]">{selectedProfile.chineseZodiac || 'N/A'}</span>
                    </div>
                    <div className="p-2.5 bg-stone-50/80 rounded-xl border border-stone-100">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Height & Weight (形体)</span>
                      <span className="font-bold text-stone-800 text-xs">{selectedProfile.height || 'N/A'} · {selectedProfile.weight || 'N/A'}</span>
                    </div>
                    <div className="p-2.5 bg-stone-50/80 rounded-xl border border-stone-100">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Academics (学识)</span>
                      <span className="font-bold text-stone-800 text-[10px] truncate block" title={selectedProfile.education}>
                        {selectedProfile.education?.split(' (')[0] || selectedProfile.education}
                      </span>
                    </div>
                    <div className="p-2.5 bg-stone-50/80 rounded-xl border border-stone-100">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Children (子女状貌)</span>
                      <span className="font-bold text-stone-800 text-[10px] truncate block" title={selectedProfile.childrenStatus}>
                        {selectedProfile.childrenStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-100/50">
                    <span className="text-[9px] uppercase font-bold text-rose-800/80 font-mono tracking-wider block mb-0.5">Ancestral Roots & Family Origin (桑梓祖籍渊源)</span>
                    <span className="text-xs font-serif font-bold text-stone-800 block">{selectedProfile.ancestralRoots || 'N/A'}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 items-center pt-1">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Top Alignment Values:</span>
                    {selectedProfile.values.map((v, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-rose-100/40 border border-rose-200/30 text-rose-800 px-2.5 py-0.5 rounded-lg">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Layer II: Personal Story Narrative Card */}
                <div id="modal-layer-2" className="p-5 bg-white border border-rose-200/50 shadow-3xs rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                    <span className="text-[#E27D60] text-sm">🌸</span>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 font-serif">Layer II: Experience Wisdom & Pathway (吾心安处之章)</h4>
                  </div>
                  
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-stone-400 font-mono tracking-wider block mb-1.5">My Pathway Story (吾心真述 / 吾生经历)</span>
                    <p className="text-xs leading-relaxed text-stone-700 font-sans whitespace-pre-line">
                      {selectedProfile.aboutMe}
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/40 border border-amber-200/30 rounded-xl relative">
                    <div className="absolute top-2 right-3 text-stone-300 font-serif text-3xl select-none leading-none">“</div>
                    <span className="text-[9px] uppercase font-bold text-amber-800 tracking-wider font-mono block mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Reflective Life Insight: Previous Lessons (往昔磨琢之悟)
                    </span>
                    <p className="text-xs leading-relaxed font-serif text-stone-800 italic pr-4">
                      "{selectedProfile.previousChapterInsight}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-205/30">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold font-mono">Youth VS Maturity Value Preference</span>
                      <p className="text-[10.5px] leading-relaxed text-stone-700 italic mt-1">"{selectedProfile.whatImLookingFor}"</p>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-205/30 flex flex-col justify-between">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold font-mono">Core Marriage Goal (缔结连理期望)</span>
                      <span className="text-rose-700 text-xs font-bold block mt-1.5 flex items-center gap-1">
                        ✦ Active Goal Match Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Layer III: Elegant Habits, Rhythms & Wellness Card */}
                <div id="modal-layer-3" className="p-5 bg-white border border-rose-200/50 shadow-3xs rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                    <span className="text-emerald-600 text-sm">🍵</span>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 font-serif">Layer III: Active Rhythms, Hobbies & Wellness (雅玩琴息养生)</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[9.5px] text-[#2C5E43] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-rose-500" />
                        Elegant Hobbies & Pursuits (修持雅好)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedProfile.personalHobbies || selectedProfile.interests).map((hobby, idx) => (
                          <span key={idx} className="bg-rose-55/40 hover:bg-rose-55 text-rose-800 text-[10px] px-2.5 py-1 rounded-lg border border-rose-200/20 font-medium">
                            ✦ {hobby}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9.5px] text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-600" />
                        Sports, Breathing & Qigong (形骸气律)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedProfile.sportsActivities || ['Morning flow Tai Chi (太极拳)', 'Gentle breathing walking']).map((sport, idx) => (
                          <span key={idx} className="bg-emerald-50/40 hover:bg-emerald-50/60 text-emerald-800 text-[10px] px-1.5 py-1 rounded-lg border border-emerald-100 text-stone-700 font-sans font-medium">
                            🏃 {sport}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50/20 rounded-xl border border-amber-200/20">
                    <span className="text-[9px] text-amber-800 font-bold uppercase tracking-wider font-mono block mb-1">My Social Rhythm & Preference (聚会交游喜好)</span>
                    <p className="text-[11px] leading-relaxed text-stone-600 italic">
                      "{selectedProfile.socialPreferences || 'Greatly prefers intimate, small-circle traditional sessions and quiet family dinners; avoids high-density noisy public parties.'}"
                    </p>
                  </div>
                </div>

                {/* Layer IV: Preferred Partner Alignment expectations Card */}
                <div id="modal-layer-4" className="p-5 bg-white border border-rose-200/50 shadow-3xs rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                    <span className="text-amber-500 text-sm">🤝</span>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 font-serif">Layer IV: Partner Expectations & Matchmaker Guide (意中人通合期待)</h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                      <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Expected Age</span>
                      <span className="font-bold text-stone-800 text-xs font-serif">{selectedProfile.preferredPartnerAge || 'No limit'}</span>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                      <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Expected Height</span>
                      <span className="font-bold text-stone-800 text-xs font-serif">{selectedProfile.preferredPartnerHeight || 'No limit'}</span>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                      <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Academic Limit</span>
                      <span className="font-bold text-stone-800 text-[10px] truncate block" title={selectedProfile.preferredPartnerEducation}>
                        {selectedProfile.preferredPartnerEducation?.split(' (')[0] || selectedProfile.preferredPartnerEducation}
                      </span>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-150">
                      <span className="text-stone-400 block text-[8.5px] uppercase font-bold tracking-wider mb-0.5">Zodiac Roots</span>
                      <span className="font-bold text-stone-800 text-[10px] truncate block" title={selectedProfile.preferredPartnerRoots}>
                        {selectedProfile.preferredPartnerRoots?.split(' roots')[0] || selectedProfile.preferredPartnerRoots}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-rose-50/15 border border-rose-100/50 rounded-xl text-stone-700 leading-relaxed text-[10px]">
                    <span className="text-rose-700 block text-[9px] uppercase font-bold font-mono tracking-wider mb-1">Character Expectations Detail (性情期许与德行要求)</span>
                    <p className="italic font-medium text-stone-600">"{selectedProfile.preferredPartnerDescription}"</p>
                  </div>

                  {/* Verification Harmony Seal Trigger inside detailed story */}
                  <button 
                    type="button"
                    onClick={() => {
                      setHarmonyProfile(selectedProfile);
                      setShowHarmonyModal(true);
                      setCalculatingHarmony(true);
                      setHarmonyReportUnlocked(false);
                      setTimeout(() => {
                        setCalculatingHarmony(false);
                      }, 2400);
                    }}
                    className="w-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent hover:from-amber-500/15 hover:to-rose-500/15 border border-amber-200 text-stone-800 font-serif text-xs p-3 rounded-xl flex items-center justify-between transition-all group active:scale-[0.98] cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-left">
                      <span className="text-amber-600 font-bold select-none text-sm">💮</span>
                      <span>
                        <strong className="block text-stone-850 font-serif text-xs">Verify Traditional Harmony Seal (八字合吉查验)</strong>
                        <span className="text-[9.5px] text-stone-400 font-sans block">Analyze deep ancestral & compatibility lines</span>
                      </span>
                    </span>
                    <span className="bg-stone-900 group-hover:bg-rose-600 text-white text-[9px] uppercase font-bold px-2.5 py-1 rounded-lg tracking-wider font-sans shrink-0 transition-colors shadow-2xs">
                      Verify Real Alignment
                    </span>
                  </button>
                </div>

                {/* Elegant Interactive Oracle Caller Icebreaker Card */}
                <div id="modal-layer-icebreaker" className="bg-stone-900 border border-stone-800 text-stone-100 p-5 rounded-2xl space-y-3.5">
                  <div className="text-xs text-rose-300 font-bold uppercase tracking-widest font-serif flex items-center justify-between">
                    <span>❓ Interactive Chapter Opener (互动交流提问)</span>
                    <span className="bg-rose-650/35 text-rose-300 font-sans text-[8.5px] px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-wider">Vetted Connection Prompt</span>
                  </div>
                  <p className="text-xs text-stone-300 font-medium font-serif leading-relaxed italic">
                    "{selectedProfile.icebreakerQuestion}"
                  </p>
                  <div className="p-3.5 bg-stone-800/80 rounded-xl border border-stone-800/40 text-stone-100 text-xs italic font-sans leading-relaxed border-l-2 border-rose-500">
                    "{selectedProfile.icebreakerAnswer}"
                  </div>
                </div>

              </div>

                {/* Quick message start */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <label className="text-xs font-semibold text-stone-500 block">Send Custom Icebreaker</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={customIcebreaker}
                      onChange={(e) => setCustomIcebreaker(e.target.value)}
                      placeholder={`Type a high-respect note to ${selectedProfile.name}...`}
                      className="flex-1 text-xs bg-stone-100 rounded-xl px-4 border border-stone-200 focus:outline-hidden focus:border-rose-500 text-stone-800"
                    />
                    <button 
                      onClick={handleSendPrompt}
                      disabled={isSent || !customIcebreaker.trim()}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium"
                    >
                      {isSent ? 'Sent' : 'Send'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      {/* 4. PREMIUM TRADITIONAL HARMONY SEAL MODAL (三合合婚牒帖) */}
      <AnimatePresence>
        {showHarmonyModal && harmonyProfile && (
          <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs z-55 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#fefbf6] rounded-3xl border-4 border-double border-rose-800/40 max-w-lg w-full overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 text-stone-800 relative"
            >
              {/* Traditional water ink floral accent in background */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="flex justify-between items-start border-b border-stone-200 pb-4 relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-700 tracking-widest block font-serif">
                    💮 Next Chapter Heritage Registry 禧兆婚牒
                  </span>
                  <h3 className="text-xl font-serif font-bold text-stone-900 leading-tight">
                    Traditional Harmony Alignment Report
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    Comparing ancestral lines, zodiac aspects, and leisure alignments
                  </p>
                </div>
                <button
                  onClick={() => setShowHarmonyModal(false)}
                  className="p-1 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg text-xs font-semibold transition-all"
                >
                  Close
                </button>
              </div>

              {calculatingHarmony ? (
                /* CALCULATING ANIMATION LOOP */
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin flex items-center justify-center p-2.5 bg-amber-50 shadow-inner">
                    <span className="text-2xl animate-pulse">💮</span>
                  </div>
                  <div className="space-y-1.5 animate-pulse">
                    <h4 className="font-serif text-sm font-semibold text-amber-900">Consulting Matchmaker Scrolls...</h4>
                    <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                      Matching Year of the {harmonyProfile.chineseZodiac?.split(' ')[2] || 'Animal'} with Tiger Celestial pillars, comparing ancestral home origins, and syncing yoga/cooking habits...
                    </p>
                  </div>
                </div>
              ) : (
                /* COMPLETED SCROLL REPORT CONTENT */
                <div className="space-y-5 relative z-10 font-sans">
                  
                  {/* Pair header card */}
                  <div className="bg-gradient-to-r from-amber-50 to-rose-50/60 p-4 rounded-2xl border border-amber-200/40 flex items-center justify-around text-center gap-3">
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-stone-400">Your profile</span>
                      <strong className="block text-xs font-serif text-stone-800">Mei-Ling Zhou (周美玲)</strong>
                      <span className="text-[10px] text-amber-800 font-medium">Year of the Tiger (🐯)</span>
                    </div>
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold border border-rose-200/30">
                        💞
                      </div>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-stone-400">Match profile</span>
                      <strong className="block text-xs font-serif text-stone-800">{harmonyProfile.name}</strong>
                      <span className="text-[10px] text-amber-800 font-medium">
                        {harmonyProfile.chineseZodiac || 'Year of the Ox (🐂)'}
                      </span>
                    </div>
                  </div>

                  {/* Compatibility metrics */}
                  <div className="space-y-3.5">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Alignments Alignment Analysis (四柱合德度):</span>
                    
                    {/* 1. Chinese Zodiac Affinity */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-stone-200/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-stone-700 flex items-center gap-1.5">
                          <span>🪐</span> Celestial Zodiac Rapport (生肖天合岁德)
                        </span>
                        <span className="font-bold text-rose-700">92% Superior Match (上吉)</span>
                      </div>
                      
                      {/* Standard Amber Progress Line */}
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '92%' }} />
                      </div>
                      <p className="text-[10.5px] leading-relaxed text-stone-500 italic">
                        "Your Tiger sign coupled with {harmonyProfile.name}'s {harmonyProfile.chineseZodiac?.split(' ')[2] || 'zodiac'} aspects creates a quiet hearth harmony. Natural respect and steady communication support your combined filial roles."
                      </p>
                    </div>

                    {/* 2. Ancestral origin sympathies */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-stone-200/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-stone-700 flex items-center gap-1.5">
                          <span>🏡</span> Ancestral Roots Sympathy (祖籍山河同德)
                        </span>
                        <span className="font-bold text-rose-700">95% Bloodline Harmony</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '95%' }} />
                      </div>
                      <p className="text-[10.5px] leading-relaxed text-stone-500 italic">
                        "{harmonyProfile.ancestralRoots?.split('Raised')[0] || 'Southern heritage'} and Taipei-roots share sympathetic coastlines and cultural values. Your family style, language accents, and kitchen recipes align with peaceful custom."
                      </p>
                    </div>

                    {/* 3. Quiet hobbies and leisure overlap */}
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-stone-200/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-stone-700 flex items-center gap-1.5">
                          <span>🍵</span> Quiet Leisure & Active Resonance (雅兴生机相通)
                        </span>
                        <span className="font-bold text-rose-700">94% Overlap</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '94%' }} />
                      </div>
                      <p className="text-[10.5px] leading-relaxed text-stone-500 italic">
                        "Overlaps in Oolong tea ceremonies, garden bonsai cultivation, and slow breathing movement habits show synchronized daily rhythms. This ensures high level companion comfort and healthy living."
                      </p>
                    </div>
                  </div>

                  {/* Certified red Ink Chop seal element */}
                  <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between gap-4">
                    <div className="text-left">
                      <span className="block text-[8px] uppercase font-bold text-stone-400">Heritage Board seal</span>
                      <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                        ✓ Identity Verified & Certified (资历真实)
                      </span>
                    </div>

                    {/* Highly aesthetic circular red seal signature */}
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-700/60 flex items-center justify-center p-1 bg-white select-none">
                      <div className="w-full h-full rounded-full border border-rose-700/80 bg-rose-50/10 text-rose-700 font-serif font-bold text-[8px] leading-none flex flex-col justify-center items-center text-center transform -rotate-12">
                        <span>蘭花相融</span>
                        <span className="border-t border-rose-700/40 w-8 my-0.5" />
                        <span>朱砂禧信</span>
                      </div>
                    </div>
                  </div>

                  {/* HIGHLY CONVERTING MEMBESHIP UPGRADE BOX */}
                  <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-[#f6f2ec] rounded-2xl border-2 border-amber-500/30 p-4 mt-2 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-stone-950 font-bold px-1.5 py-0.5 rounded-md text-[8.5px] uppercase font-mono tracking-wider">
                        Orchid Society VIP 兰花雅社
                      </span>
                      <h4 className="font-serif text-sm text-stone-100 font-semibold">Join Our Restful Slow-Dating Lounge</h4>
                    </div>

                    <p className="text-[11px] leading-relaxed text-stone-300">
                      High-end matchmaking for mature souls is built on true safety. Orchid Members enjoy unlimited traditional wax-sealed deliveries, background-checked credential booklets, certified local senior matchmaker aunties, and secure VIP afternoon tea house arrangements.
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-400 bg-stone-900/50 p-2.5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 font-bold">✓</span> Real-Life Tea Room Seats Booked
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 font-bold">✓</span> Physical Hand-Calligraphed scrolls
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 font-bold">✓</span> ID & Assets Hand-Verified
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 font-bold">✓</span> Infinite Wax-Stamped Letters
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2.5 border-t border-stone-800">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">Orchid Elite Lounge Subscription</span>
                        <span className="text-sm font-serif font-bold text-amber-400 tracking-wide">$29 / Month / 满月喜缘</span>
                      </div>
                      <button
                        onClick={() => {
                          setHarmonyReportUnlocked(true);
                        }}
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1 ${
                          harmonyReportUnlocked 
                            ? 'bg-emerald-600 border border-emerald-400 text-white' 
                            : 'bg-amber-500 hover:bg-amber-400 text-stone-950 border border-amber-300 shadow-sm hover:scale-[1.02]'
                        }`}
                      >
                        {harmonyReportUnlocked ? "✓ Upgraded Successfully" : "Upgrade Member & Unlock All Seals"}
                      </button>
                    </div>

                    {harmonyReportUnlocked && (
                      <div className="p-2.5 bg-emerald-950/40 rounded-lg border border-emerald-500/25 text-[10px] text-emerald-300 leading-normal animate-pulse text-center">
                        🎉 Welcome, Honorable Orchid Member! Your physical printed Matchmaker scroll invitation layout has been compiled and the digital wax-stamping seal limits have been set to unlimited. Let's make connections with sincere respect.
                      </div>
                    )}
                  </div>

                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
