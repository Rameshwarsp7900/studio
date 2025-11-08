

export type Skill = {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  profilePictureUrlId: string;
  bio: string;
  locationCity: string;
  locationCountry: string;
  skillsOffered: Skill[];
  skillsSought: Skill[];
  trustScore: number;
  creditsBalance: number;
  isAdmin?: boolean;
};

export type Session = {
  id: string;
  teacherId: string;
  learnerId: string;
  memberIds: string[];
  skillId: string;
  sessionType: 'in_person' | 'remote';
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  scheduledAt: Date;
  durationHours: number;
};

export type Conversation = {
  id: string;
  user1Id: string;
  user2Id: string;
  memberIds: string[];
  lastMessage: string;
  lastMessageAt: Date;
};

export type Message = {
    id: string;
    senderId: string;
    text: string;
    createdAt: any; // Can be Date or Firebase Timestamp
}
