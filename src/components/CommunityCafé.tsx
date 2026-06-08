import React, { useState } from 'react';
import { ActivityGroup } from '../types';
import { INITIAL_ROOMS } from '../data/profiles';
import { 
  Users, 
  Sparkles, 
  Check, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  Plus, 
  Send,
  MessageSquare,
  ThumbsUp,
  Heart
} from 'lucide-react';

export function CommunityCafé() {
  const [groups, setGroups] = useState<ActivityGroup[]>(INITIAL_ROOMS);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(['room-1']);
  const [activeGroupId, setActiveGroupId] = useState<string>('room-1');
  const [postInput, setPostInput] = useState('');
  
  // High fidelity forum discussions for the selected category
  const [roomDiscussions, setRoomDiscussions] = useState<{ [key: string]: any[] }>({
    'room-1': [
      {
        id: 'p1',
        author: 'Sarah Lin (林敏梅)',
        avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150&h=150',
        content: 'I have arranged a low-key tea tasting this Saturday at our local botanical garden oolong corner. We will sample five custom roasted varieties including premium aged Tieguanyin! Vetted family and neighbors welcome.',
        likes: 12,
        liked: false,
        time: '3 hours ago',
        replies: [
          { author: 'Master Jun-Ho Park (朴俊浩)', content: 'Count me in! I will bring some of my hand-carved juniper tea scoops to share wood-carving anecdotes.' },
          { author: 'Mei-Ling Zhou (周美玲)', content: 'This sounds deeply comforting. I would love to join and swap notes on Guzheng melodies.' }
        ]
      },
      {
        id: 'p2',
        author: 'Dr. Raymond Goh (吴国荣)',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150',
        content: 'Does anyone practice evening mindfulness in their orchid garden? Reconnecting with soil and botany is incredibly healing when recovering a calm lifestyle.',
        likes: 8,
        liked: true,
        time: 'Yesterday',
        replies: []
      }
    ],
    'room-2': [
      {
        id: 'p3',
        author: 'Dr. Raymond Goh (吴国荣)',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150',
        content: 'Filial respect and elder care are lifelong devotions. It took me a year of co-parenting and organizing daily menus for my elderly mother to realize how peaceful a family-first home is.',
        likes: 24,
        liked: false,
        time: '2 days ago',
        replies: [
          { author: 'Meilin Tan (陈美玲)', content: 'Beautifully put, Dr. Goh. Traditional loyalty and family dedication are the quiet seeds of lasting companionship.' }
        ]
      }
    ],
    'room-3': [
      {
        id: 'p4',
        author: 'William Wu (吴建德)',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
        content: 'This Saturday, we are hosting a small brush writing exchange. Tracing the traditional character for "Harmony" (和) together under warm natural light is a wonderful way to express our silent heart alignments.',
        likes: 5,
        liked: false,
        time: '1 day ago',
        replies: []
      }
    ],
    'room-4': [
      {
        id: 'p5',
        author: 'Sunita Nair (孙妮达)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150',
        content: 'The weather is ideal for our walk through the hidden conservatory. We will spend two hours enjoying the aromatic ginger blossoms and orchids. No rush, focus is soft companion presence.',
        likes: 15,
        liked: false,
        time: '4 days ago',
        replies: []
      }
    ]
  });

  const handleToggleJoin = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJoinedGroupIds(prev => {
      const exists = prev.includes(groupId);
      if (exists) {
        // Leave
        setGroups(g => g.map(room => room.id === groupId ? { ...room, participantsCount: room.participantsCount - 1 } : room));
        return prev.filter(id => id !== groupId);
      } else {
        // Join
        setGroups(g => g.map(room => room.id === groupId ? { ...room, participantsCount: room.participantsCount + 1 } : room));
        return [...prev, groupId];
      }
    });
  };

  const handleLikePost = (postId: string) => {
    setRoomDiscussions(prev => {
      const currentDiscussions = prev[activeGroupId] || [];
      const updatedDiscussions = currentDiscussions.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked
          };
        }
        return post;
      });
      return {
        ...prev,
        [activeGroupId]: updatedDiscussions
      };
    });
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postInput.trim()) return;

    const newPost = {
      id: 'p-custom-' + Date.now(),
      author: 'Mei-Ling Zhou (周美玲) (You)',
      avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=150&h=150',
      content: postInput,
      likes: 1,
      liked: true,
      time: 'Just now',
      replies: []
    };

    setRoomDiscussions(prev => ({
      ...prev,
      [activeGroupId]: [newPost, ...(prev[activeGroupId] || [])]
    }));

    setPostInput('');
  };

  const activeGroup = groups.find(g => g.id === activeGroupId);
  const activeDiscussions = roomDiscussions[activeGroupId] || [];

  return (
    <div id="community-cafe-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Discussion groups list (Left) */}
      <div className="lg:col-span-5 space-y-4">
        <h3 className="text-serif font-bold text-stone-800 text-sm flex items-center gap-1.5 uppercase tracking-wider">
          <Users className="w-4.5 h-4.5 text-rose-600" />
          The Neighborhood Cafés
        </h3>
        <p className="text-xs text-stone-500">
          Join small, moderated group boards centered on common hobbies or life milestones. Skip the pressure of one-on-one profiles.
        </p>

        <div className="space-y-3">
          {groups.map((group) => {
            const joined = joinedGroupIds.includes(group.id);
            const active = activeGroupId === group.id;
            return (
              <div
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  active 
                    ? 'bg-rose-50/50 border-rose-300 shadow-xs' 
                    : 'bg-white border-stone-200/60 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-800">{group.title}</h4>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed line-clamp-2">
                      {group.description}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleToggleJoin(group.id, e)}
                    className={`px-3 py-1 text-[10px] uppercase font-bold rounded-lg transition-all ${
                      joined
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {joined ? <Check className="w-3 h-3 inline mr-1" /> : <Plus className="w-3 h-3 inline mr-1" />}
                    {joined ? 'Joined' : 'Join'}
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100 text-[10px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {group.participantsCount} Neighbors
                  </span>
                  <span>Host: <strong>{group.hostName}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Group discussion boards (Right) */}
      <div className="lg:col-span-7 space-y-6">
        {activeGroup ? (
          <div className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden flex flex-col justify-between">
            {/* Header info */}
            <div className="p-6 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest font-mono">ACTIVE CAFE DISCUSSION</span>
                <h3 className="text-lg font-serif font-bold text-stone-800 mt-0.5">{activeGroup.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed mt-1">{activeGroup.description}</p>
                
                {/* tags */}
                <div className="flex gap-1.5 mt-3">
                  {activeGroup.tags.map((tag, idx) => (
                    <span key={idx} className="bg-stone-200/60 text-stone-700 text-[10px] px-2.5 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-md border border-emerald-150 font-semibold">
                    Host Verified Secure
                  </span>
                </div>
              </div>
            </div>

            {/* Discussion Feed */}
            <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto">
              {/* Post input form */}
              {joinedGroupIds.includes(activeGroup.id) ? (
                <form onSubmit={handleAddPost} className="bg-stone-50 border border-stone-200/60 p-4 rounded-2xl flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200 shrink-0">
                    <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=150&h=150" alt="We" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={postInput}
                      onChange={(e) => setPostInput(e.target.value)}
                      placeholder={`Draft a thoughtful comment or share a story in ${activeGroup.title}...`}
                      rows={2}
                      className="w-full text-xs bg-white rounded-xl border border-stone-200 p-2.5 outline-hidden focus:border-rose-500 text-stone-800"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-stone-400">Please respect privacy and support local neighbors.</span>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-all flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> Post
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100 text-center space-y-2">
                  <p className="text-xs text-orange-900 font-medium">You need to join this Café board to write responses and view neighborhood schedules.</p>
                  <button
                    onClick={(e) => handleToggleJoin(activeGroup.id, e)}
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-2xs transition-all"
                  >
                    Join Café Now
                  </button>
                </div>
              )}

              {/* Feed posts list */}
              {activeDiscussions.length > 0 ? (
                <div className="space-y-6 pt-4 border-t border-stone-100">
                  {activeDiscussions.map((post) => (
                    <div key={post.id} className="space-y-3 p-4 bg-stone-50/30 rounded-2xl border border-stone-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200">
                          <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-800 block">{post.author}</span>
                          <span className="text-[9px] text-stone-400 font-mono inline-block">{post.time}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed pl-1">{post.content}</p>

                      {/* actions */}
                      <div className="flex items-center gap-4 pl-1 text-[11px]">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1 ${
                            post.liked ? 'text-rose-600' : 'text-stone-400 hover:text-stone-600'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{post.likes} Likes</span>
                        </button>

                        <span className="text-stone-300">•</span>

                        <span className="text-stone-400 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 animate-pulse" />
                          <span>{post.replies.length} Replies</span>
                        </span>
                      </div>

                      {/* Nested Replies */}
                      {post.replies.length > 0 && (
                        <div className="bg-white rounded-xl p-3 border border-stone-100 leading-relaxed shadow-3xs space-y-2.5 ml-4">
                          {post.replies.map((reply: any, rIdx: number) => (
                            <div key={rIdx} className="text-xs border-b border-stone-50 last:border-0 pb-2.5 last:pb-0">
                              <span className="font-bold text-stone-800 block mb-0.5">{reply.author}</span>
                              <p className="text-stone-600 font-sans leading-relaxed text-[11px]">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-stone-400 flex flex-col items-center justify-center space-y-2">
                  <MessageSquare className="w-10 h-10 stroke-1" />
                  <span className="text-xs">No posts yet in this Café room. Be the first to start a conversation!</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-stone-200/65 text-center text-stone-400 flex flex-col items-center justify-center space-y-3">
            <Users className="w-12 h-12 stroke-1" />
            <span className="text-xs">Select a Neighborhood Café room from the list on the left to start conversing.</span>
          </div>
        )}
      </div>
    </div>
  );
}
