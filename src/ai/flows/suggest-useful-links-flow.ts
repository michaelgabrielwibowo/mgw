
'use server';
/**
 * @fileOverview A Genkit flow to suggest new useful links.
 *
 * - suggestUsefulLinks - A function that suggests new useful links.
 * - SuggestUsefulLinksInput - The input type for the suggestUsefulLinks function.
 * - SuggestUsefulLinksOutput - The return type for the suggestUsefulLinks function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExistingLinkSchema = z.object({
  title: z.string().describe('The title of an existing link.'),
  url: z.string().describe('The URL of an existing link.'),
});

const SuggestUsefulLinksInputSchema = z.object({
  existingLinks: z
    .array(ExistingLinkSchema)
    .describe('An array of existing links to avoid suggesting duplicates.'),
});
export type SuggestUsefulLinksInput = z.infer<
  typeof SuggestUsefulLinksInputSchema
>;

const SuggestedLinkSchema = z.object({
  title: z.string().describe('The clear and concise title of the suggested link.'),
  url: z.string().describe('The direct URL to the resource. Must be a valid HTTP/HTTPS URL.'), // No .url() validator
  author: z.string().optional().describe('The author, creator, or organization, if applicable.'),
  description: z.string().describe('A brief, informative description (1-2 sentences).'),
  category: z
    .enum([
      'project_repository',
      'website',
      'book',
      'youtube', // Combined category
    ])
    .describe(
      "The category of the link. Must be one of 'project_repository', 'website', 'book', 'youtube'."
    ),
  iconKeywords: z
    .string()
    .describe(
      'One or two keywords that describe the link type or content. For YouTube links, use "youtube video" for single videos and "youtube playlist" for playlists. Other examples: "code repository", "learning platform", "book series", "online tool".'
    ),
});
export type SuggestedLink = z.infer<typeof SuggestedLinkSchema>;


const SuggestUsefulLinksOutputSchema = z.object({
  suggestedLinks: z
    .array(SuggestedLinkSchema)
    .length(5) // Ensure exactly 5 links are expected
    .describe('An array of exactly 5 suggested useful links: 1 project repository, 1 website, 1 book, 1 YouTube video, and 1 YouTube playlist.'),
});
export type SuggestUsefulLinksOutput = z.infer<
  typeof SuggestUsefulLinksOutputSchema
>;

export async function suggestUsefulLinks(
  input: SuggestUsefulLinksInput
): Promise<SuggestUsefulLinksOutput> {
  return suggestUsefulLinksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestUsefulLinksPrompt',
  input: { schema: SuggestUsefulLinksInputSchema },
  output: { schema: SuggestUsefulLinksOutputSchema },
  prompt: `You are an expert curator of online resources. Your task is to find and suggest exactly 5 new useful links, one from each of the following specific types:
1.  An open-source project repository (e.g., from GitHub, GitLab). Category: 'project_repository'. iconKeywords: 'code repository'.
2.  A useful website (this can be a tool, general resource, or informative site). Category: 'website'. iconKeywords: 'website tool' or 'website resource'.
3.  A book (provide title, author, and if possible, a link to a reputable source like Project Gutenberg, an official publisher page, or an Amazon page). Category: 'book'. iconKeywords: 'book reference'.
4.  A YouTube video (educational, tutorial, or insightful content). Category: 'youtube'. iconKeywords: 'youtube video'.
5.  A YouTube playlist (educational, tutorial, or insightful content series). Category: 'youtube'. iconKeywords: 'youtube playlist'.

For each link, you MUST provide the following information in the exact specified format:
-   title: A clear and concise title for the link.
-   url: The direct and valid URL to the resource. Ensure this is a functional HTTP/HTTPS URL.
-   author: The author, creator, or organization primarily responsible for the content. If not applicable or easily identifiable, you may omit this.
-   description: A brief, informative description (1-2 sentences) summarizing the link's content or purpose.
-   category: Assign one of the specified categories: 'project_repository', 'website', 'book', 'youtube'.
-   iconKeywords: One or two keywords as specified above for each type (e.g., 'youtube video', 'youtube playlist', 'code repository', 'website tool', 'book reference').

IMPORTANT: Avoid suggesting links that are similar in title or URL to the following existing links. Do your best to find truly new and diverse resources.
Existing Links to avoid:
{{#if existingLinks.length}}
{{#each existingLinks}}
-   Title: {{this.title}}, URL: {{this.url}}
{{/each}}
{{else}}
(No existing links provided, suggest any high-quality resources.)
{{/if}}

Please ensure your 5 suggestions are diverse, high-quality, and genuinely useful, matching the 5 types requested. Structure your entire response as a single JSON object matching the output schema. You must provide exactly 5 links.
`,
});

const suggestUsefulLinksFlow = ai.defineFlow(
  {
    name: 'suggestUsefulLinksFlow',
    inputSchema: SuggestUsefulLinksInputSchema,
    outputSchema: SuggestUsefulLinksOutputSchema,
  },
  async (input) => {
    console.log("Calling suggestUsefulLinksFlow with input:", input);
    try {
        const { output } = await prompt(input);
        console.log("Received output from prompt:", output);

        if (!output || !Array.isArray(output.suggestedLinks) || output.suggestedLinks.length !== 5) {
          console.error("LLM did not return exactly 5 links. Output:", output);
          throw new Error('Failed to get exactly 5 suggestions from the LLM.');
        }
        // Additional validation can be added here if needed, e.g., checking categories/keywords
        return output;
    } catch (error) {
        console.error("Error within suggestUsefulLinksFlow during prompt call:", error);
        // Re-throw the error to be caught by the caller or Next.js error handling
        throw error;
    }
  }
);

// Ensure only the wrapper function is exported if needed elsewhere,
// but the flow itself is registered via defineFlow.
// No other exports from this file are strictly necessary unless types are used externally
// beyond the calling page.
