export interface Feedback {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Character {
  id: string;
  name: string;
  shortDescription: string;
  avatar: string;
  tags: string[];
  detailDescription: string;
  backstory: string;
  firstMessage: string;
  linkUrl: string;
  linkButtonLabel?: string;
  isPrivate: boolean;
  hint?: string;
  question?: string;
  password?: string;
  hasPassword?: boolean;
  clickCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt?: string;
  feedbacks: Feedback[];
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  storage_url?: string;
  duration?: string;
}

export interface ForumComment {
  id: string;
  authorName: string;
  authorRole: 'admin' | 'user';
  content: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorRole: 'admin' | 'user';
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  likes: number;
  comments: ForumComment[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'event' | 'update';
  active: boolean;
  createdAt: string;
}

export interface SiteStats {
  totalCharacters: number;
  totalClicks: number;
  totalFavorites: number;
  totalFeedbacks: number;
  totalForumPosts: number;
  visitCount: number;
}
