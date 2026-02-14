export enum ContentType {
  WELCOME = 'WELCOME',
  OVERVIEW = 'OVERVIEW',
  ACADEMICS = 'ACADEMICS',
  LIFE = 'LIFE',
}

export interface Chapter {
  id: string;
  title: string;
  content: string; // Markdown supported
  imageUrl?: string;
  createdAt: number;
}

export interface SectionContent {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  imageUrl: string;
  lastUpdated: number;
  chapters: Chapter[];
}

export interface Question {
  id: string;
  studentName: string;
  content: string;
  timestamp: number;
  answer?: string;
  isFeatured: boolean; // "精选"
  isAnswered: boolean;
}

export interface GlobalSettings {
  backgroundImageUrl: string;
  siteTitle: string;
  recruitmentUrl: string; // Link for "Join Us"
  welcomeMessage: string; // New: Welcome dynamic/notification
}

export interface AppState {
  sections: SectionContent[];
  questions: Question[];
  settings: GlobalSettings;
  isAdmin: boolean;
}

// Navigation View State
export enum ViewState {
  HOME = 'HOME',
  SECTION_DETAIL = 'SECTION_DETAIL',
  QA = 'QA',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}