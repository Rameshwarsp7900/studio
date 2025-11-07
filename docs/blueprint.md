# **App Name**: SkillSwap

## Core Features:

- User Authentication and Profiles: Enable users to create profiles with skills offered and sought, manage availability, and verify their identity using Firebase Authentication and a profile wizard. Incorporates profile images and optional intro videos to help users connect, also enabling them to receive SMS messages via Firebase Phone Authentication tool, assisting new signups by verifying the validity of phone numbers.
- Skill Matching: Implements a skill matching system allowing users to search, filter, and discover other users based on skill sets, location, and availability, enhanced by an AI recommendation engine using other people who have similar skill swaps that can suggest compatible matches. If users authorize its usage, location will also be determined with access to the browser's location settings.
- Session Management: Enables users to request, accept, decline, reschedule, and cancel sessions. Supports both in-person (utilizing React Native Maps, which would rely on using geolocation of the browser and a Map provider) and remote sessions.
- In-App Messaging: Provides real-time chat functionality for users to communicate before, during, and after sessions.
- Ratings and Reviews: Facilitates a 5-star rating system and written reviews for users to provide feedback on their learning and teaching experiences.
- Trust and Safety Measures: Implements identity and skill verification processes, along with reporting and blocking functionalities to ensure a safe environment.
- Notifications: Sends real-time push notifications (using Firebase Cloud Messaging) to inform users about new session requests, accepted sessions, messages, and other important updates, to keep users aware of important updates, and prevent them missing the notifications.

## Style Guidelines:

- Primary color: Deep indigo (#4B0082), embodying knowledge, trust, and creativity for a platform where skills are shared. 
- Background color: Light lavender (#E6E6FA), providing a gentle, non-intrusive backdrop that keeps focus on content.
- Accent color: Muted orchid (#DDA0DD), adding a touch of individuality while complementing the primary palette.
- Body font: 'Inter', sans-serif for clean readability. Headlines: 'Space Grotesk', sans-serif, offering a modern, computerized feel to grab attention.
- Use consistent and clear icons from a library like FontAwesome or Material Icons, tailored to each skill category to improve visual navigation and user experience.
- Employ a modular grid system, providing a consistent feel. A sense of spaciousness with negative space makes the display less dense. Design the elements like the feed with search option, and user profiles, each tailored for seamless user journeys, ensuring clarity and visual consistency across devices.
- Incorporate micro-interactions and subtle animations when navigating, loading content, or confirming actions. This can give users a satisfying response and give the user a polished user experience.