export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  url: string;
  source: string;
  publishedAt: Date;
  imageUrl?: string;
  category: NewsCategory;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface GeneratedImage {
  id: string;
  articleId: string;
  filePath: string;
  fileName: string;
  template: ImageTemplate;
  createdAt: Date;
  shared: boolean;
}

export interface ImageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  config: TemplateConfig;
}

export interface TemplateConfig {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  padding: number;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export type NewsCategory = 'breaking' | 'technology' | 'business' | 'sports' | 'entertainment' | 'politics' | 'science' | 'health';

export interface ScrapingSettings {
  enabled: boolean;
  interval: number; // minutes
  sources: NewsSource[];
  categories: NewsCategory[];
  maxArticlesPerRun: number;
  autoGenerate: boolean;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  category: NewsCategory;
}

export interface StorageSettings {
  path: string;
  isValid: boolean;
  availableSpace: number;
  totalSpace: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: any;
  scheduled?: Date;
}