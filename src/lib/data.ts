export type Skill = {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
};

export type User = {
  id: string;
  name: string;
  profilePictureUrlId: string;
  bio: string;
  location: string;
  skillsOffered: Skill[];
  skillsSought: Skill[];
  trustScore: number;
};

export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    profilePictureUrlId: 'user-1',
    bio: 'Frontend developer with a passion for UI/UX. Looking to learn backend development.',
    location: 'San Francisco, CA',
    skillsOffered: [{ name: 'React', level: 'Expert' }, { name: 'UI/UX Design', level: 'Intermediate' }],
    skillsSought: [{ name: 'Node.js', level: 'Beginner' }, { name: 'PostgreSQL', level: 'Beginner' }],
    trustScore: 95,
  },
  {
    id: '2',
    name: 'Bob Williams',
    profilePictureUrlId: 'user-2',
    bio: 'Professional photographer and videographer. Eager to improve my marketing skills.',
    location: 'New York, NY',
    skillsOffered: [{ name: 'Photography', level: 'Expert' }, { name: 'Video Editing', level: 'Expert' }],
    skillsSought: [{ name: 'Digital Marketing', level: 'Beginner' }, { name: 'SEO', level: 'Beginner' }],
    trustScore: 88,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    profilePictureUrlId: 'user-3',
    bio: 'Hobbyist painter, loves to cook Italian food. Wants to learn Spanish for my next trip.',
    location: 'Austin, TX',
    skillsOffered: [{ name: 'Oil Painting', level: 'Intermediate' }, { name: 'Italian Cooking', level: 'Expert' }],
    skillsSought: [{ name: 'Spanish', level: 'Beginner' }, { name: 'Guitar', level: 'Beginner' }],
    trustScore: 92,
  },
  {
    id: '4',
    name: 'Diana Prince',
    profilePictureUrlId: 'user-4',
    bio: 'Certified Yoga Instructor and fitness coach. I can help you with your fitness goals!',
    location: 'Miami, FL',
    skillsOffered: [{ name: 'Yoga', level: 'Expert' }, { name 'Personal Training', level: 'Expert' }],
    skillsSought: [{ name: 'Web Development', level: 'Beginner' }, { name: 'Graphic Design', level: 'Beginner' }],
    trustScore: 98,
  },
  {
    id: '5',
    name: 'Ethan Hunt',
    profilePictureUrlId: 'user-5',
    bio: 'Data scientist who loves digging into numbers. I can teach Python and SQL.',
    location: 'Chicago, IL',
    skillsOffered: [{ name: 'Python', level: 'Expert' }, { name: 'Data Analysis', level: 'Expert' }, { name: 'SQL', level: 'Intermediate' }],
    skillsSought: [{ name: 'Public Speaking', level: 'Intermediate' }, { name: 'Project Management', level: 'Intermediate' }],
    trustScore: 91,
  },
  {
    id: '6',
    name: 'Fiona Glenanne',
    profilePictureUrlId: 'user-6',
    bio: 'Guitarist and songwriter. Looking to learn how to produce my own music.',
    location: 'Los Angeles, CA',
    skillsOffered: [{ name: 'Guitar', level: 'Expert' }, { name: 'Songwriting', level: 'Intermediate' }],
    skillsSought: [{ name: 'Music Production', level: 'Beginner' }, { name: 'Ableton Live', level: 'Beginner' }],
    trustScore: 94,
  },
  {
    id: '7',
    name: 'George Banks',
    profilePictureUrlId: 'user-7',
    bio: 'Finance professional with 10+ years experience. Can help with personal finance and investing.',
    location: 'London, UK',
    skillsOffered: [{ name: 'Financial Planning', level: 'Expert' }, { name: 'Investing', level: 'Expert' }],
    skillsSought: [{ name: 'Gardening', level: 'Beginner' }, { name: 'French', level: 'Intermediate' }],
    trustScore: 99,
  },
  {
    id: '8',
    name: 'Hannah Abbott',
    profilePictureUrlId: 'user-8',
    bio: 'Pottery artist and sculptor. Let\'s create something beautiful together!',
    location: 'Portland, OR',
    skillsOffered: [{ name: 'Pottery', level: 'Expert' }, { name: 'Sculpture', level: 'Intermediate' }],
    skillsSought: [{ name: 'Business Management', level: 'Beginner' }, { name: 'E-commerce', level: 'Beginner' }],
    trustScore: 93,
  },
];
