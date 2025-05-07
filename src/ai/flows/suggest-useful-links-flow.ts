
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
  url: z.string().url().describe('The URL of an existing link.'),
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
  url: z.string().url().describe('The direct URL to the resource.'),
  author: z.string().optional().describe('The author, creator, or organization, if applicable.'),
  description: z.string().describe('A brief, informative description (1-2 sentences).'),
  category: z
    .enum([
      'project_repository',
      'website',
      'book',
      'youtube',
    ])
    .describe(
      "The category of the link. Must be one of 'project_repository', 'website', 'book', 'youtube'."
    ),
  iconKeywords: z
    .string()
    .describe(
      'One or two keywords that describe the link type or content (e.g., "code repository", "learning platform", "video content", "book series", "online tool").'
    ),
});
export type SuggestedLink = z.infer<typeof SuggestedLinkSchema>;


const SuggestUsefulLinksOutputSchema = z.object({
  suggestedLinks: z
    .array(SuggestedLinkSchema)
    .describe('An array of 4 suggested useful links, one from each specified category.'),
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
  prompt: `You are an expert curator of online resources. Your task is to find and suggest 4 new useful links, one from each of the following categories:
1.  An open-source project repository (e.g., from GitHub, GitLab). Category: 'project_repository'.
2.  A useful website (this can be a tool, general resource, or informative site). Category: 'website'.
3.  A book (provide title, author, and if possible, a link to a reputable source like Project Gutenberg, an official publisher page, or an Amazon page). Category: 'book'.
4.  A YouTube video or playlist (educational, tutorial, or insightful content). Category: 'youtube'.

For each link, you MUST provide the following information in the exact specified format:
-   title: A clear and concise title for the link.
-   url: The direct and valid URL to the resource.
-   author: The author, creator, or organization primarily responsible for the content. If not applicable or easily identifiable, you may omit this.
-   description: A brief, informative description (1-2 sentences) summarizing the link's content or purpose.
-   category: Assign one of the specified categories: 'project_repository', 'website', 'book', 'youtube'.
-   iconKeywords: One or two keywords that describe the link type or content, which can be used to select an appropriate icon. Examples: "code repository", "learning platform", "video content", "book series", "utility tool", "reference material".

IMPORTANT: Avoid suggesting links that are similar in title or URL to the following existing links. Do your best to find truly new and diverse resources.
Existing Links to avoid:
{{#if existingLinks.length}}
{{#each existingLinks}}
-   Title: {{this.title}}, URL: {{this.url}}
{{/each}}
{{else}}
(No existing links provided, suggest any high-quality resources.)
{{/if}}

Please ensure your 4 suggestions are diverse, high-quality, and genuinely useful. Structure your entire response as a single JSON object matching the output schema.
`,
});

const suggestUsefulLinksFlow = ai.defineFlow(
  {
    name: 'suggestUsefulLinksFlow',
    inputSchema: SuggestUsefulLinksInputSchema,
    outputSchema: SuggestUsefulLinksOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get suggestions from the LLM.');
    }
    // The prompt requests 4 links.
    // Add a check here if strict adherence to 4 links is critical.
    // For example: if(output.suggestedLinks.length !== 4) throw new Error("Expected 4 links");
    return output;
  }
);

