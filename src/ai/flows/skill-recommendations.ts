// SkillRecommendations flow provides personalized skill swap recommendations.
'use server';

/**
 * @fileOverview An AI agent that recommends skill swaps to users.
 *
 * - getSkillRecommendations - A function that handles the skill recommendation process.
 * - SkillRecommendationsInput - The input type for the getSkillRecommendations function.
 * - SkillRecommendationsOutput - The return type for the getSkillRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillRecommendationsInputSchema = z.object({
  profile: z
    .string()
    .describe('User profile, including skills offered, skills sought, experience level, and interests.'),
  skillsOffered: z.array(z.string()).describe('List of skills the user is offering.'),
  skillsSought: z.array(z.string()).describe('List of skills the user is seeking.'),
  location: z
    .string()
    .describe('User location (city, country) to find nearby skill swap opportunities.'),
  pastInteractions: z
    .string()
    .optional()
    .describe('Optional: User past interactions and preferences to personalize recommendations.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional: User preferences for learning, teaching, and skill swaps.'),
});
export type SkillRecommendationsInput = z.infer<typeof SkillRecommendationsInputSchema>;

const SkillRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      userId: z.string().describe('The ID of the recommended user.'),
      name: z.string().describe('The name of the recommended user.'),
      offeredSkills: z.array(z.string()).describe('Skills offered by the recommended user.'),
      soughtSkills: z.array(z.string()).describe('Skills sought by the recommended user.'),
      matchScore: z
        .number()
        .describe('A score indicating how well the recommended user matches the current user.'),
      reason: z.string().describe('Why this user is a good skill swap match.'),
    })
  ).describe('A list of recommended skill swaps for the user.'),
});
export type SkillRecommendationsOutput = z.infer<typeof SkillRecommendationsOutputSchema>;

export async function getSkillRecommendations(input: SkillRecommendationsInput): Promise<SkillRecommendationsOutput> {
  return skillRecommendationsFlow(input);
}

const skillRecommendationsPrompt = ai.definePrompt({
  name: 'skillRecommendationsPrompt',
  input: {schema: SkillRecommendationsInputSchema},
  output: {schema: SkillRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized skill swap recommendations to users of the SkillSwap app.

  Given a user's profile, skills offered, skills sought, location, past interactions, and preferences, generate a list of recommended skill swaps.

  Profile: {{{profile}}}
  Skills Offered: {{#each skillsOffered}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Skills Sought: {{#each skillsSought}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Location: {{{location}}}
  Past Interactions: {{{pastInteractions}}}
  User Preferences: {{{userPreferences}}}

  Consider the following when generating recommendations:
  - Complementary skills: Recommend users who offer skills that the current user is seeking, and vice versa.
  - Location: Prioritize users who are located nearby.
  - Skill level: Match users with similar experience levels.
  - Interests: Recommend users who share similar interests or have interacted positively in the past.

  Format the recommendations as a JSON array of user objects. Each user object should include:
  - userId: The ID of the recommended user.
  - name: The name of the recommended user.
  - offeredSkills: A list of skills offered by the recommended user.
  - soughtSkills: A list of skills sought by the recommended user.
  - matchScore: A score indicating how well the recommended user matches the current user.
  - reason: A short explanation of why this user is a good skill swap match.

  Ensure that the recommendations are relevant, diverse, and likely to be of interest to the user.
  `, // Ensure proper handlebars syntax and escaping
});

const skillRecommendationsFlow = ai.defineFlow(
  {
    name: 'skillRecommendationsFlow',
    inputSchema: SkillRecommendationsInputSchema,
    outputSchema: SkillRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await skillRecommendationsPrompt(input);
    return output!;
  }
);
