// Helper function to map keywords to a specific Lucide icon name string
export function mapKeywordsToIcon(keywords?: string): string | undefined {
    if (!keywords) return undefined;
    const lowerKeywords = keywords.toLowerCase();

    // Prioritize more specific keywords
    if (lowerKeywords.includes("playlist")) return "Youtube"; // Youtube icon (brand logo) for playlists
    if (lowerKeywords.includes("video")) return "Video"; // Video icon (camera outline) for single videos
    if (lowerKeywords.includes("code") || lowerKeywords.includes("repository") || lowerKeywords.includes("github")) return "Github";
    if (lowerKeywords.includes("book")) return "BookOpen";
    if (lowerKeywords.includes("learn") || lowerKeywords.includes("education") || lowerKeywords.includes("course")) return "School";
    if (lowerKeywords.includes("tool") || lowerKeywords.includes("utility")) return "Globe"; // Or a specific tool icon if available
    if (lowerKeywords.includes("web") || lowerKeywords.includes("site")) return "Globe";
    if (lowerKeywords.includes("circuit") || lowerKeywords.includes("electronic")) return "Cpu";
    if (lowerKeywords.includes("ai") || lowerKeywords.includes("assistant")) return "Lightbulb";

    // Fallback to general 'Link' icon
    return "Link";
}
