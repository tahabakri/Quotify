4export interface ImageGenerationOptions {
  backgroundType: 'nature' | 'abstract' | 'cityscape' | 'vintage' | 'fantasy' | 'minimalist';
  prompt?: string;
  resolution?: string;
}

export interface GeneratedImage {
  url: string;
  metadata: {
    backgroundType: string;
    timestamp: string;
    quoteId: string;
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