import React, { useState, useEffect, useRef } from 'react';
import { DatingProfile, Message, MatchChat } from '../types';
import { COMPASS_PROFILES } from '../data/profiles';
import { 
  Send, 
  User, 
  MessageSquare, 
  ShieldAlert, 
  Sparkles, 
  CheckCheck,
  Check,
  Video,
  PhoneCall,
  Calendar,
  AlertCircle,
  Inbox,
  Mail,
  MailOpen,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  BookOpen
} from 'lucide-react';

interface ConversationCenterProps {
  activeProfileChat: DatingProfile | null;
  initialIcebreakerText: string;
  onClearActiveChatSelection: () => void;
}

export function ConversationCenter({ 
  activeProfileChat, 
  initialIcebreakerText,
  onClearActiveChatSelection
}: ConversationCenterProps) {
  // Setup sample pre-loaded conversations
  const [chats, setChats] = useState<MatchChat[]>(() => {
    return [
      {
        profileId: '1',
        name: 'Sarah Lin (林敏梅)',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
        statusText: 'Active 20m ago',
        unreadCount: 1,
        messages: [
          {
            id: 'm1',
            senderId: '1',
            receiverId: 'user',
            text: "Hello Mei-Ling, I loved reading your insight about how maintaining a peaceful, safe home of mutual respect is far more precious than chasing accomplishments. Sincerity of family harmony takes years to truly structure.",
            timestamp: '10:14 AM',
            isCurrentUser: false
          },
          {
            id: 'm2',
            senderId: 'user',
            receiverId: '1',
            text: "Thank you, Sarah. It was a hard-won truth but it has brought me so much peace. Your bonsai garden curatorships look incredibly peaceful as well.",
            timestamp: '10:30 AM',
            isCurrentUser: true
          },
          {
            id: 'm3',
            senderId: '1',
            receiverId: 'user',
            text: "They are! I find so much solace in miniature oolong and bonsai arrangements. Sometime, I would love to arrange a low-key Saturday morning oolong session or walk the botanical greenhouse together, if you are comfortable.",
            timestamp: '10:35 AM',
            isCurrentUser: false
          }
        ]
      },
      {
        profileId: '2',
        name: 'Dr. Raymond Goh (吴国荣)',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400&h=400',
        statusText: 'Steeping raw Pu-erh',
        unreadCount: 0,
        messages: [
          {
            id: 'd1',
            senderId: 'user',
            receiverId: '2',
            text: "Hello Dr. Raymond! I saw you collect antique coins and appreciate ancient botany. I brew traditional tea too!",
            timestamp: 'Yesterday',
            isCurrentUser: true
          },
          {
            id: 'd2',
            senderId: '2',
            receiverId: 'user',
            text: "Hello there, Mei-Ling! Today I am testing a nice batch of raw 2008 aged Pu-erh. The earthy warmth makes the morning garden rain feel so calming. How do you usually brew your oolong tea?",
            timestamp: 'Yesterday',
            isCurrentUser: false
          }
        ]
      }
    ];
  });

  const [activeChatId, setActiveChatId] = useState<string>('1');
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Mailbox tabs state for incoming and outgoing messages
  const [mailboxTab, setMailboxTab] = useState<'active' | 'sent' | 'received'>('active');
  const [selectedSentId, setSelectedSentId] = useState<string | null>('sent-1');
  const [selectedReceivedId, setSelectedReceivedId] = useState<string | null>('rec-1');

  // Interactive Modals state
  const [isWalkModalOpen, setIsWalkModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  // Walk Form values
  const [walkDate, setWalkDate] = useState('2026-06-12');
  const [walkTime, setWalkTime] = useState('14:30');
  const [walkVenue, setWalkVenue] = useState('Seattle Japanese Garden Tea House (西雅图日本花园茶室)');
  const [walkTheme, setWalkTheme] = useState('Quiet Oolong Tea Brewing Stroll (岩茶小酌漫步)');

  // Call status simulator values
  const [isCallConnecting, setIsCallConnecting] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callMessageSub, setCallMessageSub] = useState('');

  const [sentLetters, setSentLetters] = useState([
    {
      id: 'sent-1',
      profileId: '4', // Master Jun-Ho Park
      name: 'Master Jun-Ho Park (朴俊浩)',
      avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=400&h=400',
      subject: 'Inquiry on Traditional Teaware Arts',
      text: 'Hello Master Jun-Ho, I was deeply moved by your commitment to keeping traditional high-fire clay techniques alive. Our heritage oolong brewing deserves matching hand-crafted vessels of sincerity. I would be immensely honored to correspond with you and learn about your studio work.',
      timestamp: 'Sent 1 day ago',
      status: 'pending', // 'pending' | 'opened'
      sealType: 'Tea Serenity'
    },
    {
      id: 'sent-2',
      profileId: '5', // Sunita Nair
      name: 'Sunita Nair (孙妮达)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
      subject: 'Ayurvedic Soup-baking Synergy',
      text: 'Greetings Sunita! Your knowledge on ayurvedic restorative ingredients is spectacular. I prepare Cantonese herbal slow-brewed soups weekly, and find massive alignments in how we treat culinary herbs as a wellness anchor.',
      timestamp: 'Sent 3 days ago',
      status: 'opened',
      sealType: 'Sincere Truth'
    }
  ]);

  const [receivedLetters, setReceivedLetters] = useState([
    {
      id: 'rec-1',
      profileId: '6', // William Wu
      name: 'William Wu (吴建德)',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400&h=400',
      subject: 'An Invitation to Joint Calligraphy & Tea Society Review',
      text: 'Dear Mei-Ling, I read your beautiful story in the Next Chapter lounge. Your classical Guzheng string teaching is legendary, and I have spent my high school principal years supporting student traditional ensembles. I play and catalog cursive writing. I would be truly delighted to share a mutual tea session to converse about Zhejiang local ancestry.',
      timestamp: 'Received 4 hours ago',
      status: 'unopened', // 'unopened' | 'read' | 'accepted'
      sealType: 'Concord Harmony'
    }
  ]);

  // Set first item as selected when switching tabs
  useEffect(() => {
    if (mailboxTab === 'sent' && sentLetters.length > 0) {
      setSelectedSentId(sentLetters[0].id);
      setSelectedReceivedId(null);
    } else if (mailboxTab === 'received') {
      const activeRec = receivedLetters.filter(r => r.status !== 'accepted');
      if (activeRec.length > 0) {
        setSelectedReceivedId(activeRec[0].id);
        setSelectedSentId(null);
      } else {
        setSelectedReceivedId(null);
      }
    }
  }, [mailboxTab]);

  const handleAcceptReceivedLetter = (letter: typeof receivedLetters[0]) => {
    // 1. Move to chats if not already exists
    const exists = chats.some(c => c.profileId === letter.profileId);
    if (!exists) {
      const newChat: MatchChat = {
        profileId: letter.profileId,
        name: letter.name,
        avatar: letter.avatar,
        statusText: 'Recently Activated',
        unreadCount: 0,
        messages: [
          {
            id: 'm-rec-init',
            senderId: letter.profileId,
            receiverId: 'user',
            text: letter.text,
            timestamp: 'Yesterday',
            isCurrentUser: false
          },
          {
            id: 'm-rec-accept',
            senderId: 'user',
            receiverId: letter.profileId,
            text: `Thank you for your beautiful invitation letter, ${letter.name.split(' ')[0]}. I am delighted to accept your corresponding welcome. Let us discuss traditional tea and calligraphy together!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCurrentUser: true
          }
        ]
      };
      setChats(prev => [newChat, ...prev]);
    }
    
    // 2. Mark as accepted in received list
    setReceivedLetters(prev => prev.map(r => r.id === letter.id ? { ...r, status: 'accepted' } : r));
    
    // 3. Switch active tab to active chats
    setMailboxTab('active');
    setActiveChatId(letter.profileId);
  };

  // Monitor if a new chat request came through props
  useEffect(() => {
    if (activeProfileChat) {
      // Find if this chat already exists
      const existingChatIdx = chats.findIndex(c => c.profileId === activeProfileChat.id);
      
      if (existingChatIdx > -1) {
        // Chat exists, make it active
        setActiveChatId(activeProfileChat.id);
        
        // If an icebreaker text was passed explicitly, append it
        if (initialIcebreakerText) {
          const updatedChats = [...chats];
          updatedChats[existingChatIdx].messages.push({
            id: 'm-ice-' + Date.now(),
            senderId: 'user',
            receiverId: activeProfileChat.id,
            text: initialIcebreakerText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCurrentUser: true
          });
          setChats(updatedChats);
          triggerSimulatedResponse(activeProfileChat.id, activeProfileChat.name);
        }
      } else {
        // Create new chat
        const letterText = initialIcebreakerText || `Hello ${activeProfileChat.name}, I’d love to connect. I really admire your profile and baseline outlook.`;
        const newChat: MatchChat = {
          profileId: activeProfileChat.id,
          name: activeProfileChat.name,
          avatar: activeProfileChat.avatar,
          statusText: 'Connecting...',
          unreadCount: 0,
          messages: [
            {
              id: 'm-ice-init',
              senderId: 'user',
              receiverId: activeProfileChat.id,
              text: letterText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isCurrentUser: true
            }
          ]
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(activeProfileChat.id);

        // Also add to sentLetters list placeholder
        const newSentLog = {
          id: 'sent-' + Date.now(),
          profileId: activeProfileChat.id,
          name: activeProfileChat.name,
          avatar: activeProfileChat.avatar,
          subject: 'Guided Compass Proposal',
          text: letterText,
          timestamp: 'Sent just now',
          status: 'pending',
          sealType: 'Tea Serenity'
        };
        setSentLetters(prev => [newSentLog, ...prev]);

        triggerSimulatedResponse(activeProfileChat.id, activeProfileChat.name);
      }
      setMailboxTab('active');
      onClearActiveChatSelection();
    }
  }, [activeProfileChat, initialIcebreakerText]);

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId, isTyping, mailboxTab]);

  // Clock timer for active audio VOIP calls
  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleStartCall = () => {
    if (!activeChatId) return;
    const currentActiveChat = chats.find(c => c.profileId === activeChatId);
    if (!currentActiveChat) return;
    setIsPhoneModalOpen(true);
    setIsCallConnecting(true);
    setIsCallActive(false);
    setCallMessageSub('Establishing secure audited link via Seattle nodes...');

    setTimeout(() => {
      setIsCallConnecting(false);
      setIsCallActive(true);

      let voiceGreeting = '';
      if (currentActiveChat.profileId === '1') {
        voiceGreeting = `"Hello there! Sarah here. I was just watering a miniature cypress trunk when your secure line initialized. Saturday walks sound incredibly peaceful, I would love that."`;
      } else if (currentActiveChat.profileId === '2') {
        voiceGreeting = `"Warm greetings! Raymond here. Savoring a hot kettle of Pu-erh in the rain. Let us absolutely arrange a traditional walking path soon!"`;
      } else {
        voiceGreeting = `"Hello! Sincere honor to hear your voice over our curated safe lounge channel. Let us proceed with mutual care."`;
      }
      setCallMessageSub(voiceGreeting);
    }, 2000);
  };

  // RESTful polling synchronizer for Cloud SQL PostgreSQL messages
  const reloadMessages = () => {
    const token = (window as any).firebaseToken;
    if (!token || !activeChatId) return;

    fetch(`/api/messages?partnerUid=${activeChatId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        const mapped = data.map((m: any) => ({
          id: String(m.id),
          senderId: m.senderUid === (window as any).currentUserUid ? 'user' : m.senderUid,
          receiverId: m.receiverUid === (window as any).currentUserUid ? 'user' : m.receiverUid,
          text: m.text,
          timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCurrentUser: m.senderUid === (window as any).currentUserUid,
          icebreakerTopic: m.icebreakerTopic,
        }));

        setChats(prev => prev.map(c => {
          if (c.profileId === activeChatId) {
            return {
              ...c,
              messages: mapped
            };
          }
          return c;
        }));
      }
    })
    .catch(err => console.error("Error reading database chats:", err));
  };

  useEffect(() => {
    reloadMessages();
    const interval = setInterval(reloadMessages, 4000);
    return () => clearInterval(interval);
  }, [activeChatId]);

  const handleCommitWalk = () => {
    const currentActiveChat = chats.find(c => c.profileId === activeChatId);
    if (!currentActiveChat) return;

    const invitationText = `Protected Walk Proposal: Let us meet at ${walkVenue} on ${walkDate} at ${walkTime} for our first traditional walk, themed around "${walkTheme}". Sincere values and safe companionship guide our path.`;

    const token = (window as any).firebaseToken;

    if (token) {
      fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverUid: currentActiveChat.profileId,
          text: invitationText
        })
      })
      .then(res => res.json())
      .then(() => {
        reloadMessages();
        setIsWalkModalOpen(false);

        // Store virtual accepted response from partner matching profile
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const companionShort = currentActiveChat.name.split(" ")[0];
            const acceptanceText = `💮 Walk Proposal Accepted! 💮\n\nI would be absolutely delighted to accompany you to ${walkVenue} on ${walkDate} at ${walkTime} for the ${walkTheme}. It sounds extraordinarily peaceful and safe. I will bring dry Oolong in my thermal glass container. Look forward to corresponding!`;

            fetch("/api/messages/simulate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                senderUid: currentActiveChat.profileId,
                text: acceptanceText
              })
            })
            .then(res => res.json())
            .then(() => {
              reloadMessages();
            })
            .catch(err => console.error("Simulator database save error:", err));
          }, 2500);
        }, 1500);
      })
      .catch(err => console.error("Error sending walk invitation:", err));
    }
  };

  const activeChat = chats.find(c => c.profileId === activeChatId);
  const activeSentLetter = sentLetters.find(l => l.id === selectedSentId);
  const activeReceivedLetter = receivedLetters.find(l => l.id === selectedReceivedId);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedMessage.trim() || !activeChat) return;

    const token = (window as any).firebaseToken;
    if (token) {
      fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverUid: activeChat.profileId,
          text: typedMessage
        })
      })
      .then(res => res.json())
      .then(() => {
        reloadMessages();
        triggerSimulatedResponse(activeChat.profileId, activeChat.name);
      })
      .catch(err => console.error("Error sending message to Cloud SQL:", err));
    }

    setTypedMessage("");
  };

  const triggerSimulatedResponse = (profileId: string, name: string) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      let responseText = "";
      if (profileId === "1" || profileId === "profile-1") {
        responseText = `That is very true. It is liberating to find a companion who shares those quiet values. I'm taking my time too. What are some of your favorite recipes when you brew restorative herbal tea?`;
      } else if (profileId === "2" || profileId === "profile-2") {
        responseText = `Yes, premium aged Pu-erh has a beautiful way of warming any quiet writing desk. I'd love to organize a casual afternoon walk to share tea traditions. I appreciate your thoughtful, respectful questions. No rush, of course!`;
      } else if (profileId === "3" || profileId === "profile-3") {
        responseText = `Thank you for reaching out. It is a pleasure to meet someone else who values string melodies and family care too. My children are visiting today, but I will write back fully this evening. Have a peaceful day!`;
      } else if (profileId === "4" || profileId === "profile-4") {
        responseText = `Hello! Thank you for the high-respect note. It's refreshing to connect with other parents who maintain filial duties and filial care lines. How is your weekend shaping up?`;
      } else {
        responseText = `I deeply appreciate how gentle and respectful your greeting is. It means a lot. I'd love to keep talking and see how our moral alignments connect over deep tea sessions.`;
      }

      const token = (window as any).firebaseToken;
      if (token) {
        fetch("/api/messages/simulate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            senderUid: profileId,
            text: responseText
          })
        })
        .then(res => res.json())
        .then(() => {
          reloadMessages();
        })
        .catch(err => console.error("Simulation storage error:", err));
      }

    }, 2200);
  };

  return (
    <>
      <div id="convo-center-container" className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
      {/* Chats List Sidebar (Left) */}
      <div className="md:col-span-4 border-r border-stone-200/60 flex flex-col bg-stone-50/50">
        
        {/* Mailbox Header & Tabs */}
        <div className="p-4 border-b border-stone-200/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-850 text-sm flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-rose-600" />
              Correspondence
            </h3>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200/55">
              Safe Lounge
            </span>
          </div>

          {/* Mailbox Tab navigation buttons */}
          <div className="grid grid-cols-3 gap-1 bg-stone-200/60 p-1 rounded-xl border border-stone-200/40">
            <button
              onClick={() => { setMailboxTab('active'); }}
              className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                mailboxTab === 'active' 
                  ? 'bg-white text-stone-900 shadow-3xs font-extrabold' 
                  : 'text-stone-550 hover:text-stone-800 font-medium'
              }`}
            >
              Active ({chats.length})
            </button>
            <button
              onClick={() => { setMailboxTab('sent'); }}
              className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                mailboxTab === 'sent' 
                  ? 'bg-white text-stone-900 shadow-3xs font-extrabold' 
                  : 'text-stone-550 hover:text-stone-800 font-medium'
              }`}
            >
              Sent ({sentLetters.length})
            </button>
            <button
              onClick={() => { setMailboxTab('received'); }}
              className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                mailboxTab === 'received' 
                  ? 'bg-white text-stone-900 shadow-3xs font-extrabold' 
                  : 'text-stone-550 hover:text-stone-800 font-medium'
              }`}
            >
              Inbox ({receivedLetters.filter(r => r.status !== 'accepted').length})
            </button>
          </div>
        </div>

        {/* Dynamic Sidebar Content list based on active tab */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-150">
          
          {/* TAB 1: ACTIVE CHATS */}
          {mailboxTab === 'active' && chats.map((chat) => (
            <button
              key={chat.profileId}
              onClick={() => {
                setActiveChatId(chat.profileId);
                // Clear unread count on select
                setChats(prev => prev.map(c => c.profileId === chat.profileId ? { ...c, unreadCount: 0 } : c));
              }}
              className={`w-full text-left p-4 flex gap-3 transition-all cursor-pointer ${
                activeChatId === chat.profileId && mailboxTab === 'active'
                  ? 'bg-stone-100/80 border-l-4 border-rose-600'
                  : 'hover:bg-stone-100/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-xs border border-stone-200">
                <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-xs text-stone-850 truncate w-28">{chat.name}</span>
                  <span className="text-[9px] text-stone-400 font-medium">
                    {chat.messages[chat.messages.length - 1]?.timestamp || 'Active'}
                  </span>
                </div>
                <p className="text-[9px] text-stone-500 mt-0.5 truncate uppercase tracking-tight">Status: {chat.statusText}</p>
                <p className="text-[11px] text-stone-600 mt-1 truncate leading-tight italic">
                  {chat.messages[chat.messages.length - 1]?.text}
                </p>
              </div>

              {chat.unreadCount > 0 && (
                <span className="w-2 h-2 bg-rose-600 rounded-full self-center animate-pulse" />
              )}
            </button>
          ))}

          {/* TAB 2: SENT LETTERS */}
          {mailboxTab === 'sent' && (
            sentLetters.length === 0 ? (
              <div className="p-8 text-center text-stone-400">
                <p className="text-xs">No outgoing correspondances yet.</p>
              </div>
            ) : (
              sentLetters.map((letter) => (
                <button
                  key={letter.id}
                  onClick={() => {
                    setSelectedSentId(letter.id);
                  }}
                  className={`w-full text-left p-4 flex gap-3 transition-all cursor-pointer ${
                    selectedSentId === letter.id
                      ? 'bg-stone-100/80 border-l-4 border-rose-600'
                      : 'hover:bg-stone-100/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-xs border border-stone-200">
                    <img src={letter.avatar} alt={letter.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-xs text-stone-850 truncate w-24">{letter.name}</span>
                      <span className="text-[8.5px] text-stone-400 font-medium">{letter.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-rose-750 font-bold truncate mt-1">💌 Sent Spark (发出心意)</p>
                    <p className="text-[11px] text-stone-600 mt-0.5 truncate leading-tight italic">
                      "{letter.text}"
                    </p>
                  </div>
                </button>
              ))
            )
          )}

          {/* TAB 3: RECEIVED LETTERS INBOX */}
          {mailboxTab === 'received' && (
            (() => {
              const activeRec = receivedLetters.filter(r => r.status !== 'accepted');
              return activeRec.length === 0 ? (
                <div className="p-8 text-center text-stone-400">
                  <p className="text-xs">All invitations read & active.</p>
                </div>
              ) : (
                activeRec.map((letter) => (
                  <button
                    key={letter.id}
                    onClick={() => {
                      setSelectedReceivedId(letter.id);
                    }}
                    className={`w-full text-left p-4 flex gap-3 transition-all cursor-pointer ${
                      selectedReceivedId === letter.id
                        ? 'bg-stone-100/80 border-l-4 border-rose-600'
                        : 'hover:bg-stone-100/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-xs border border-stone-200">
                      <img src={letter.avatar} alt={letter.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-xs text-stone-850 truncate w-24">{letter.name}</span>
                        <span className="text-[8.5px] text-stone-400 font-medium">{letter.timestamp}</span>
                      </div>
                      <p className="text-[10px] text-emerald-800 font-bold truncate mt-1">🏮 Incoming Invitation</p>
                      <p className="text-[11px] text-stone-600 mt-0.5 truncate leading-tight italic">
                        "{letter.text}"
                      </p>
                    </div>
                  </button>
                ))
              );
            })()
          )}

        </div>
      </div>

      {/* Message Feed / Letter Envelope Canvas (Right) */}
      <div className="md:col-span-8 flex flex-col justify-between bg-stone-50/20">
        
        {/* VIEW 1: ACTIVE CHAT SCREEN */}
        {mailboxTab === 'active' && activeChat && (
          <>
            {/* Conversation Header */}
            <div className="p-4 bg-white border-b border-stone-200/60 flex justify-between items-center px-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-stone-200 shadow-xs font-semibold">
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-800">{activeChat.name}</h4>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-semibold border border-amber-200 px-1.5 py-0.5 rounded">
                    Co-Parenting / Compass Match
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleStartCall}
                  className="p-2 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                  title="Secure Audio call"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsWalkModalOpen(true)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book a Walk
                </button>
              </div>
            </div>

            {/* Conversation Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[380px]">
              {/* Trust banner */}
              <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-[11px] text-emerald-800/90 flex items-start gap-2 max-w-md mx-auto">
                <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>By mutual consensus, your chat log is fully secured. Always support other members by maintaining soft, respectful boundaries.</span>
              </div>

              {activeChat.messages.map((msg) => {
                const isWaxSealed = msg.text.includes('Concord Seal') || msg.text.includes('Tea Serenity') || msg.text.includes('Sincere Truth');
                const isWalkProposal = msg.text.includes('Protected Walk Proposal');
                const isWalkAccepted = msg.text.includes('Walk Proposal Accepted!');
                
                let cleanText = msg.text;
                let stampIcon = "🈴";
                let stampName = "Concord Harmony Seal (祖籍和合印契)";
                
                if (isWaxSealed) {
                  if (msg.text.includes('Tea Serenity')) {
                    stampIcon = "🍵";
                    stampName = "Tea Serenity Seal (禅茶同气之缘)";
                  }
                  if (msg.text.includes('Sincere Truth')) {
                    stampIcon = "💮";
                    stampName = "Sincere Sincerity Seal (真诚如初印信)";
                  }
                  cleanText = msg.text
                    .replace(/^.*?Premium Traditional Invitation: /, "")
                    .replace(/^.*?Invitation: /, "")
                    .replace(/\n\n\(Sent via.*$/, "");
                }

                return (
                  <div 
                    key={msg.id}
                    className={`flex w-full ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {isWalkProposal ? (
                      <div className="max-w-[85%] bg-stone-900 border-2 border-amber-600/30 text-stone-100 rounded-2xl p-5 shadow-lg relative overflow-hidden my-1">
                        <div className="absolute top-1.5 right-1.5 text-xs text-amber-500/20">☕</div>
                        <div className="flex items-center gap-2 pb-2 border-b border-stone-800 mb-3">
                          <Calendar className="w-4 h-4 text-rose-500" />
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-rose-400 block font-bold font-mono">Next Chapter Safe Route</span>
                            <h5 className="font-serif font-bold text-xs text-stone-100">TEA WALK PROPOSAL</h5>
                          </div>
                        </div>
                        <div className="space-y-1.5 text-[11px] text-stone-300">
                          <p><strong className="text-amber-400 font-mono">📍 Meet Station:</strong> {msg.text.split('\n').find(l => l.startsWith('Venue:'))?.replace('Venue:', '').trim()}</p>
                          <p><strong className="text-amber-400 font-mono">📅 Agreed Time:</strong> {msg.text.split('\n').find(l => l.startsWith('Date/Time:'))?.replace('Date/Time:', '').trim()}</p>
                          <p><strong className="text-amber-400 font-mono">🌿 Soft Topic:</strong> {msg.text.split('\n').find(l => l.startsWith('Focus:'))?.replace('Focus:', '').trim()}</p>
                        </div>
                        <div className="mt-3.5 pt-2 border-t border-stone-800 flex items-center justify-between text-[8px] font-mono text-stone-500">
                          <span>Sealed & Dispatched</span>
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    ) : isWalkAccepted ? (
                      <div className="max-w-[85%] bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl p-5 shadow-xs relative overflow-hidden my-1">
                        <div className="absolute top-1.5 right-1.5 text-xs text-emerald-600/20">💮</div>
                        <div className="flex items-center gap-2 pb-2 border-b border-emerald-200 mb-3">
                          <CheckCheck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-emerald-700 block font-bold font-mono">Zodiac & Schedule Sequence</span>
                            <h5 className="font-serif font-bold text-xs text-emerald-900 font-extrabold">PROPOSAL CONFIRMED</h5>
                          </div>
                        </div>
                        <p className="text-[11.5px] leading-relaxed italic text-emerald-900">
                          {msg.text.replace('💮 Walk Proposal Accepted! 💮', '').trim()}
                        </p>
                        <div className="mt-3.5 pt-2 border-t border-emerald-100 flex items-center justify-between text-[8px] font-mono text-emerald-700/80">
                          <span>Status: Logged into Offline Agenda</span>
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    ) : isWaxSealed ? (
                      /* LUXURIOUS VISUAL EMBOSSED TRADITIONAL CHINESE FOLDER CARD */
                      <div className="max-w-[85%] bg-gradient-to-br from-rose-950 via-rose-900 to-[#4d0c0e] text-[#f7e4c5] rounded-2xl p-5 border-2 border-amber-500/35 relative shadow-xl font-sans overflow-hidden my-1">
                        
                        <div className="absolute top-1.5 left-1.5 text-[8px] text-amber-500/40 select-none">🈴</div>
                        <div className="absolute top-1.5 right-1.5 text-[8px] text-amber-500/40 select-none">💮</div>
                        <div className="absolute bottom-1.5 left-1.5 text-[8px] text-amber-500/40 select-none">💮</div>
                        <div className="absolute bottom-1.5 right-1.5 text-[8px] text-amber-500/40 select-none">🈴</div>

                        <div className="flex items-center gap-2.5 pb-2.5 border-b border-amber-500/20 mb-3 relative z-10">
                          <span className="text-2xl filter drop-shadow animate-pulse select-none bg-stone-900/40 w-8 h-8 rounded-full flex items-center justify-center border border-amber-500/20">
                            {stampIcon}
                          </span>
                          <div>
                            <span className="text-[8px] uppercase font-bold tracking-widest text-amber-400 block font-mono">Traditional Orchid Society courier dispatch</span>
                            <span className="font-serif font-bold text-xs text-stone-100">{stampName}</span>
                          </div>
                        </div>

                        <p className="text-stone-100 leading-relaxed text-xs italic font-serif relative z-10 py-1 pl-2.5 border-l border-amber-500/25">
                          "{cleanText}"
                        </p>

                        <div className="mt-3.5 pt-2 border-t border-amber-500/15 flex items-center justify-between text-[8px] text-amber-400/90 font-mono relative z-10">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Registered Traditional Courier: Signed with High Respect
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    ) : (
                      /* STANDARD UI TALK CHAT BUBBLE */
                      <div className={`max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                        msg.isCurrentUser 
                          ? 'bg-stone-900 text-stone-100 rounded-tr-none' 
                          : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-none'
                      }`}>
                        {msg.icebreakerTopic ? (
                          <div className="bg-stone-100 text-stone-600 rounded-lg p-2.5 mb-2 border-l-2 border-orange-500 font-mono text-[10px]">
                            🎯 Prompt response: "{msg.icebreakerTopic}"
                          </div>
                        ) : null}
                        
                        <p>{msg.text}</p>
                        
                        <div className={`mt-2 text-[9px] flex items-center justify-end gap-1 ${
                          msg.isCurrentUser ? 'text-stone-400' : 'text-stone-400'
                        }`}>
                          <span>{msg.timestamp}</span>
                          {msg.isCurrentUser && <CheckCheck className="w-3 h-3 text-rose-500" />}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-stone-400 border border-stone-200/50 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-0" />
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-300" />
                    </span>
                    <span>{activeChat.name} is drafting a response...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Conversational Text Bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-stone-200/60 flex gap-2">
              <input
                type="text"
                id="convo-msg-input"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder={`Type a thoughtful, supportive message to ${activeChat.name}...`}
                className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50"
              />
              <button
                type="submit"
                id="convo-send-btn"
                disabled={!typedMessage.trim()}
                className={`px-4 rounded-xl flex items-center justify-center transition-all ${
                  typedMessage.trim() 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer' 
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                <Send className="w-4 h-4 font-bold" />
              </button>
            </form>
          </>
        )}

        {/* VIEW 2: SENT LETTERS CARD HOLDER PREVIEW */}
        {mailboxTab === 'sent' && (
          activeSentLetter ? (
            <div className="p-8 flex flex-col justify-center items-center h-full space-y-6 max-w-xl mx-auto">
              
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full border border-stone-250 bg-stone-105 overflow-hidden shadow-xs mb-2">
                  <img src={activeSentLetter.avatar} alt={activeSentLetter.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-sm font-bold text-stone-850">Your Outgoing Letter to {activeSentLetter.name}</h4>
                <p className="text-[10px] text-stone-400 uppercase font-mono tracking-wider mt-0.5">Dispatched via Next Chapter safe courier</p>
              </div>

              {/* Embossed Wax Letter Envelope Placeholder */}
              <div className="w-full bg-[#fbf9f5] border border-amber-200 rounded-2xl p-6 shadow-md relative font-serif overflow-hidden">
                <div className="absolute top-2 right-2 text-rose-850/10 text-5xl select-none pointer-events-none">🏮</div>
                <div className="border border-stone-200/50 rounded-xl p-4 bg-white/70">
                  <div className="flex justify-between items-start border-b border-amber-200/35 pb-2 mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#9d2933] font-bold font-mono">✉️ SEALED OUTBOX CARD</span>
                    <span className="text-[9px] text-stone-400 font-mono italic">{activeSentLetter.timestamp}</span>
                  </div>
                  <h5 className="text-[11px] font-sans font-bold text-stone-500 mb-1">Subject: {activeSentLetter.subject}</h5>
                  <p className="text-stone-750 text-xs leading-relaxed italic">
                    "{activeSentLetter.text}"
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px] font-sans">
                  <span className="text-[#a12f3b] font-bold flex items-center gap-1 bg-rose-50/50 border border-rose-200/30 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" /> Status: {activeSentLetter.status === 'pending' ? 'Pending Acceptance' : 'Opened & Acknowledged'}
                  </span>
                  <span className="font-mono text-stone-400 text-[9px]">Seal: {activeSentLetter.sealType}</span>
                </div>
              </div>

              <div className="text-center p-4 bg-stone-50 border border-stone-200 rounded-2xl text-[11px] text-stone-500 leading-relaxed max-w-sm font-sans">
                Next Chapter encourages letting relationships ripen in due time. Rushing replies is deactivated so candidates can prioritize sincere reading of your values before responding.
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-2 font-sans">
              <Mail className="w-12 h-12 stroke-1" />
              <span className="text-xs">Select any sent envelope on the left to read outbox logs.</span>
            </div>
          )
        )}

        {/* VIEW 3: INCOMING LETTERS DETAILED PREVIEW */}
        {mailboxTab === 'received' && (
          activeReceivedLetter ? (
            <div className="p-8 flex flex-col justify-center items-center h-full space-y-6 max-w-xl mx-auto">
              
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full border border-stone-250 bg-stone-105 overflow-hidden shadow-xs mb-2 font-semibold">
                  <img src={activeReceivedLetter.avatar} alt={activeReceivedLetter.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-sm font-bold text-stone-850">Candidacy Invitation from {activeReceivedLetter.name}</h4>
                <p className="text-[10px] text-emerald-800 uppercase font-mono tracking-widest mt-0.5 font-bold">Unopened Safe Sincerity Folder</p>
              </div>

              {/* Rich Chinese Parchment Calligraphy visual wrapper */}
              <div className="w-full bg-[#fcfaf2] border-2 border-emerald-600/20 rounded-3xl p-6 shadow-xl relative font-serif bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]">
                
                <div className="absolute top-2 left-2 text-[9px] text-emerald-700/30 font-mono">🈴 SECURITY BLOCK</div>
                <div className="absolute bottom-2 right-2 text-emerald-700/30 text-5xl select-none pointer-events-none">🍵</div>

                <div className="border border-emerald-600/10 rounded-2xl p-5 bg-white/70 space-y-3">
                  <div className="flex justify-between items-center border-b border-emerald-600/20 pb-2.5">
                    <span className="text-xs text-[#1e4d2b] font-bold uppercase tracking-widest flex items-center gap-1 font-sans">
                      <Inbox className="w-3.5 h-3.5" /> Traditional Sincerity Invitation
                    </span>
                    <span className="text-[9px] text-stone-400 font-sans font-medium">{activeReceivedLetter.timestamp}</span>
                  </div>

                  <p className="text-stone-850 text-[12px] leading-relaxed italic font-serif">
                    "{activeReceivedLetter.text}"
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px] font-sans">
                  <span className="text-stone-500 font-mono">Zodiac align check: Verified</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                    ✉️ Signed with High Respect (拜上)
                  </span>
                </div>
              </div>

              {/* Acceptance Call to Action Row */}
              <div className="flex flex-col sm:flex-row gap-3 w-full font-sans">
                <button
                  onClick={() => handleAcceptReceivedLetter(activeReceivedLetter)}
                  className="flex-1 py-3 bg-stone-900 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Accept and Activate Corresponding Room</span>
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-2 font-sans">
              <Inbox className="w-12 h-12 stroke-1 animate-pulse" />
              <span className="text-xs">Your Inbox is quiet. Select an incoming letter envelope from the left.</span>
            </div>
          )
        )}

        {/* DEFAULT FALLBACK WATERMARK FOR EMPTY STATE */}
        {mailboxTab === 'active' && !activeChat && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-3 font-sans">
            <MessageSquare className="w-12 h-12 stroke-1" />
            <span className="text-sm">Select an active companion match on the left to start corresponding.</span>
          </div>
        )}

      </div>
    </div>

      {/* ==================== WALK SCHEDULER MODAL overlay ==================== */}
      {isWalkModalOpen && activeChat && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 font-sans animate-fade-in">
          <div className="bg-white border hover:border-rose-250 border-stone-200 rounded-[32px] p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-6 premium-gold-border smooth-spring">
            <button 
              onClick={() => setIsWalkModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-rose-600 font-extrabold p-1 rounded-full hover:bg-stone-100 transition-all cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[9px] uppercase font-black tracking-widest text-rose-700 px-3 py-1 bg-rose-50 border border-rose-200/50 rounded-full">
                👑 Safe Outdoor Rendezvous
              </span>
              <h4 className="font-serif font-black text-rose-950 text-xl mt-3.5">
                Arrange a Protected Tea Walk
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed mt-1">
                Establish serene real-life corresponding connections on high-respect, fully verified public grounds under safe companion bounds.
              </p>
            </div>

            <div className="space-y-4">
              {/* Venue SELECT */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider">📍 Public Meeting Grounds</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Seattle Japanese Garden Tea House (日本花园)',
                    'Volunteer Park Conservatory Greenhouse (温室花房)',
                    'Kubota Bamboo Garden Walking Path (久保田竹林)',
                    'Cascadia Cedar Traditional Tea Parlor (凯斯卡迪亚茶室)'
                  ].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setWalkVenue(v)}
                      className={`p-2.5 text-left rounded-xl border text-[10.5px] transition-all cursor-pointer leading-tight font-medium hover:scale-[1.02] ${
                        walkVenue === v 
                          ? 'border-rose-600 bg-rose-50/50 text-rose-950 font-bold' 
                          : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-white'
                      }`}
                    >
                      <span className="block font-black text-rose-900 text-[11px]">{v.split(' ')[0]}</span>
                      <span className="block text-[9px] text-stone-500 font-normal mt-0.5 truncate">{v}</span>
                    </button>
                  ))}
                </div>
                <input 
                  type="text"
                  value={walkVenue}
                  onChange={(e) => setWalkVenue(e.target.value)}
                  className="w-full text-xs bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2 text-stone-850 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-600 font-medium"
                  style={{ height: '36px' }}
                  placeholder="Or enter custom scenic location..."
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider">📅 Date</label>
                  <input
                    type="date"
                    value={walkDate}
                    onChange={(e) => setWalkDate(e.target.value)}
                    className="w-full text-xs bg-stone-50/50 border border-stone-200 rounded-xl px-3 text-stone-850 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10 font-bold"
                    style={{ height: '36px' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider">🕒 Time</label>
                  <input
                    type="time"
                    value={walkTime}
                    onChange={(e) => setWalkTime(e.target.value)}
                    className="w-full text-xs bg-stone-50/50 border border-stone-200 rounded-xl px-3 text-stone-850 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10 font-bold"
                    style={{ height: '36px' }}
                  />
                </div>
              </div>

              {/* Walk Theme / Stroll Intent */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider">🌿 Stroll Intent & Conversation Focus</label>
                <div className="space-y-1.5">
                  {[
                    'Quiet Oolong Tea Brewing Stroll (岩茶小酌漫步)',
                    'Chinese Calligraphy Exchange in the Park (金石草书之缘)',
                    'Bonsai Curating & Herbal Garden Walk (盆景药草闲游)',
                    'Filial Family Duties & Story Sharing (孝道与儿孙琐事杂谈)'
                  ].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setWalkTheme(t)}
                      className={`w-full p-2.5 rounded-xl border text-[11px] text-left transition-all cursor-pointer leading-tight block ${
                        walkTheme === t 
                          ? 'border-rose-605 bg-rose-50/50 text-rose-950 font-extrabold shadow-sm' 
                          : 'border-stone-200 hover:border-stone-250 text-stone-600 bg-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsWalkModalOpen(false)}
                className="flex-1 py-3 border border-stone-200 hover:bg-stone-55 text-stone-600 rounded-2xl text-xs transition-all font-bold cursor-pointer font-sans"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCommitWalk}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs shadow-md hover:shadow-lg transition-all font-bold cursor-pointer font-sans"
              >
                Seal & Dispatch Stroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SECURE TELEPHONE VIRTUAL DIALER overlay ==================== */}
      {isPhoneModalOpen && activeChat && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 font-sans animate-fade-in text-white">
          <div className="bg-[#121111] border border-stone-850 rounded-[32px] p-6 md:p-8 max-w-xs w-full text-center shadow-2xl relative space-y-6">
            
            {/* Vetted logo elements */}
            <div className="flex justify-between items-center text-[8px] font-mono text-stone-500 uppercase tracking-widest border-b border-stone-900 pb-2.5">
              <span>Secure Audited Line</span>
              <span className="text-rose-500 animate-pulse">● VETTED COMPASS VOICE</span>
            </div>

            {/* Pulsing profile image stack */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#bd2a2e]/20 rounded-full animate-ping pointer-events-none" />
              <div className="absolute inset-2 bg-[#bd2a2e]/10 rounded-full animate-pulse pointer-events-none" />
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rose-500 relative shadow-2xl shrink-0">
                <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>

            {/* Caller Identification */}
            <div>
              <h4 className="font-serif font-black text-rose-50 text-base">{activeChat.name}</h4>
              <p className="text-[9px] text-stone-400 font-mono tracking-wider mt-0.5">Secure Dial Routing: SEA-7719-WA</p>
            </div>

            {/* Call State Feedback container */}
            <div className="min-h-[100px] bg-stone-900/60 p-4 rounded-2xl border border-stone-850/50 flex flex-col justify-center items-center">
              {isCallConnecting ? (
                <div className="space-y-1.5">
                  <div className="flex justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-0" />
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-300" />
                  </div>
                  <p className="text-[9px] text-amber-400 font-mono tracking-widest uppercase mt-1">Connecting premium line...</p>
                </div>
              ) : isCallActive ? (
                <div className="space-y-2.5 w-full">
                  <div className="flex items-center justify-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      CONNECTED • {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-[11px] italic text-[#f7e4c5]/90 leading-relaxed max-w-xs mx-auto">
                    {callMessageSub}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Action Row buttons */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsPhoneModalOpen(false);
                  setIsCallActive(false);
                  setIsCallConnecting(false);
                }}
                className="w-12 h-12 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-full inset-shadow-xs transition-all mx-auto flex items-center justify-center cursor-pointer shadow-lg hover:shadow-rose-900/40"
                title="Hang up secure link"
              >
                <PhoneCall className="w-5 h-5 rotate-135" />
              </button>
              <span className="block text-[8px] font-mono text-[#edcf9e] mt-2 tracking-wider">HANG UP SAFE LOUNGE</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

