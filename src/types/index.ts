import type { LucideIcon } from 'lucide-react';

export interface PersonalContact {
  id: string;
  title: string;
  url: string;
  value: string; // e.g., email address, username
  icon: LucideIcon;
}

export interface UsefulLink {
  id: string;
  title: string;
  author?: string;
  url: string;
  description?: string;
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
