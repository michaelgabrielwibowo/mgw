import type { LucideIcon } from 'lucide-react';

export interface SiteProfile {
  siteTitle: string; // e.g., "My Personal Page" to be used in <title>
  metaDescriptionName: string; // e.g., "Your Name" for "A ... website by [Your Name]"
  profileName: string;
  tagline: string;
  profilePictureUrl: string;
  footerName: string;
}

export interface PersonalContact {
  id: string;
  title: string;
  url: string;
  value: string; // e.g., email address, username
  iconName: string; // Lucide icon name as string
}

export interface UsefulLink {
  id: string;
  title: string;
  author?: string;
  url: string;
  description?: string;
  iconName?: string; // Lucide icon name as string
  category?: 'web' | 'project_repository' | 'learning' | 'book' | 'youtube';
  createdAt: Date;
  popularity: number; // A simple score, e.g., 0-100 or view count
  isNew?: boolean; // Optional flag for recently added links
}

export interface CommentFeedback {
  id?: string;
  type: 'c' | 'f'; // c = comment, f = feedback
  author_email: string;
  commented_at?: Date;
  place?: string;
  content: string;
}

export type FeedbackFormData = Omit<CommentFeedback, 'id' | 'commented_at'>;

