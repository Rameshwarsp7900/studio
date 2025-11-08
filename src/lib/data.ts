
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
