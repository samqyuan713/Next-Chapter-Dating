export type RelationshipStatus = 'Divorced' | 'Widowed' | 'Single Parent' | 'Never Married' | 'Separated' | 'Starting Over';

export type CompanionGoal = 'Companionship First' | 'Long-Term Marriage' | 'Deep Friendship & Coffee' | 'Activity Partner' | 'A Restful Co-existence';

export interface DatingProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  occupation: string;
  avatar: string;
  tagline: string;
  relationshipStatus: RelationshipStatus;
  childrenStatus: string; // e.g., "Adult children", "Co-parenting school age", "No children"
  aboutMe: string;
  previousChapterInsight: string; // Reflective perspective on what their previous relationships or divorce taught them
  whatImLookingFor: string; // Values they cherish today vs in their twenties
  values: string[]; // Comfort, Honesty, Laughter, Stability, Serenity, etc.
  interests: string[];
  icebreakerQuestion: string; // e.g. "On a lazy Sunday, you can find me..."
  icebreakerAnswer: string;
  compatibilityScore: number;
  height?: string;
  weight?: string;
  education?: string;
  ancestralRoots?: string;
  chineseZodiac?: string;
  personalHobbies?: string[];
  preferredPartnerAge?: string;
  preferredPartnerHeight?: string;
  preferredPartnerEducation?: string;
  preferredPartnerRoots?: string;
  preferredPartnerDescription?: string;
  sportsActivities?: string[];
  socialPreferences?: string;
  photos?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
  icebreakerTopic?: string;
}

export interface MatchChat {
  profileId: string;
  name: string;
  avatar: string;
  statusText: string;
  unreadCount: number;
  messages: Message[];
}

export interface ActivityGroup {
  id: string;
  title: string;
  description: string;
  participantsCount: number;
  tags: string[];
  hostName: string;
}
