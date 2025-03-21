export type BackgroundType = 'ai' | 'gradient' | 'solid';
export type BackgroundStyle = 'modern' | 'classic' | 'minimal';
export type BackgroundMood = 'light' | 'dark' | 'vibrant' | 'muted' | 'ethereal';

export interface ImageGenerationOptions {
  type: BackgroundType;
  style?: BackgroundStyle;
  mood?: BackgroundMood;
  width?: number;
  height?: number;
}

export interface GenerationResult {
  imageUrl: string;
  prompt: string;
  metadata?: {
    width: number;
    height: number;
    style: BackgroundStyle;
    mood: BackgroundMood;
  };
}

export interface DeepAIResponse {
  id: string;
  output_url: string;
  status: 'success' | 'error';
  error?: string;
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