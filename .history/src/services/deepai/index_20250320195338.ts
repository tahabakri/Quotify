export * from './types';
export * from './client';

// Create and export a singleton instance
import { DeepAIService } from './client';

const DEEPAI_API_KEY = import.meta.env.VITE_DEEPAI_API_KEY;

if (!DEEPAI_API_KEY) {
  console.warn('DeepAI API key not found in environment variables (VITE_DEEPAI_API_KEY). Image generation will not work.');
}

// Create singleton instance with default configuration
export const deepai = new DeepAIService({
  apiKey: DEEPAI_API_KEY || '',
  rateLimit: {
    maxRequests: 10,
    timeWindow: 60000, // 1 minute
  },
  baseUrl: 'https://api.deepai.org/api',
});

// Validate API key on app initialization
deepai.validateApiKey().catch(() => {
  console.error('Failed to validate DeepAI API key. Please check your configuration.');
});