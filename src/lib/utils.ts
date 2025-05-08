import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Moved from useful-links page
const filterOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newly_added', label: 'Recently Suggested'},
  { value: 'learning', label: 'Learning & Education' },
  { value: 'website', label: 'Websites & Tools' },
  { value: 'project_repository', label: 'Project Repositories' },
  { value: 'book', label: 'Books' },
  { value: 'youtube', label: 'YouTube Content' },
];


// Helper to get category label
export const getCategoryLabel = (categoryValue?: string, iconNameValue?: string) => {
  if (categoryValue === 'youtube') {
    // Distinguish between playlist and video based on conventional icon names
    if (iconNameValue === 'Youtube') return 'YouTube Playlist'; // 'Youtube' icon implies playlist
    if (iconNameValue === 'Video') return 'YouTube Video'; // 'Video' icon implies single video
    return 'YouTube Content'; // Fallback for general YouTube category or unknown icon
  }
   // Corrected category value check for websites/tools
  if (categoryValue === 'website') return 'Websites & Tools';
  if (categoryValue === 'web') return 'Websites & Tools'; // Handle legacy 'web' category if present

  const option = filterOptions.find(opt => opt.value === categoryValue);
  // Capitalize the category value if no specific label found
  return option ? option.label : (categoryValue ? categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1).replace(/_/g, ' ') : "Link");
};
