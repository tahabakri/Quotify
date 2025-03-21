export type BackgroundType = 
  | 'nature' 
  | 'abstract' 
  | 'cityscape' 
  | 'vintage' 
  | 'fantasy' 
  | 'minimalist'
  | 'dramatic'
  | 'romantic'
  | 'mysterious'
  | 'spiritual'
  | 'futuristic'
  | 'nostalgic'
  | 'literary'
  | 'historical'
  | 'artistic';

export type BackgroundMood =
  | 'light'
  | 'dark'
  | 'vibrant'
  | 'muted'
  | 'ethereal'
  | 'intense';

export type BackgroundStyle =
  | 'watercolor'
  | 'photography'
  | 'digital'
  | 'sketch'
  | 'oil-painting'
  | 'geometric';

export interface ImageGenerationOptions {
  backgroundType: BackgroundType;
  mood?: BackgroundMood;
  style?: BackgroundStyle;
  prompt?: string;
  resolution?: string;
  bookGenre?: string;
  customPrompt?: string;
}

export interface GeneratedImage {
  url: string;
  metadata: {
    backgroundType: string;
    timestamp: string;
    quoteId: string;
    mood?: string;
    style?: string;
    bookGenre?: string;
    customPrompt?: string;
  };
}

export interface DeepAIResponse {
  id: string;
  output_url: string;
  status: string;
}

export class DeepAIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'DeepAIError';
  }
}

export interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number; // in milliseconds
}

export interface DeepAIConfig {
  apiKey: string;
  rateLimit?: RateLimitConfig;
  baseUrl?: string;
}