import { DeepAIConfig, DeepAIError, DeepAIResponse, GeneratedImage, ImageGenerationOptions, RateLimitConfig } from './types';

class RateLimiter {
  private requests: number[] = [];
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async checkLimit(): Promise<boolean> {
    const now = Date.now();
    // Remove expired timestamps
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.config.timeWindow
    );

    if (this.requests.length >= this.config.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  getTimeUntilNextSlot(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.config.timeWindow - (Date.now() - oldestRequest));
  }
}

export class DeepAIService {
  private config: DeepAIConfig;
  private rateLimiter: RateLimiter;
  private baseUrl: string;

  constructor(config: DeepAIConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.deepai.org/api';
    this.rateLimiter = new RateLimiter(
      config.rateLimit || { maxRequests: 10, timeWindow: 60000 } // Default: 10 requests per minute
    );
  }

  private async handleResponse(response: Response): Promise<DeepAIResponse> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new DeepAIError(
        errorData.message || 'API request failed',
        errorData.code || 'UNKNOWN_ERROR',
        response.status
      );
    }

    return response.json();
  }

  private buildPrompt(options: ImageGenerationOptions): string {
    return `Generate a high-quality background image that complements a book quote. 
    The image should match the theme of the book and the mood of the quote. 
    Style: Artistic, visually appealing, and suitable for text overlay. 
    Theme: ${options.backgroundType}. 
    Ensure the background has soft lighting, a balanced composition, and enough empty space for adding text without obstruction. 
    Do not include any existing text in the image. 
    Resolution: High-quality (suitable for social media and sharing).
    ${options.prompt ? `Additional details: ${options.prompt}` : ''}`.trim();
  }

  async generateImage(options: ImageGenerationOptions): Promise<GeneratedImage> {
    const canProceed = await this.rateLimiter.checkLimit();
    if (!canProceed) {
      const waitTime = this.rateLimiter.getTimeUntilNextSlot();
      throw new DeepAIError(
        `Rate limit exceeded. Please try again in ${Math.ceil(waitTime / 1000)} seconds.`,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}/text2img`, {
        method: 'POST',
        headers: {
          'Api-Key': this.config.apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: this.buildPrompt(options),
        }),
      });

      const data = await this.handleResponse(response);

      return {
        url: data.output_url,
        metadata: {
          backgroundType: options.backgroundType,
          timestamp: new Date().toISOString(),
          quoteId: '',  // To be set by the caller
        },
      };
    } catch (error) {
      if (error instanceof DeepAIError) {
        throw error;
      }
      throw new DeepAIError(
        'Failed to generate image',
        'GENERATION_FAILED',
        500
      );
    }
  }

  // Helper method to validate API key
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        headers: {
          'Api-Key': this.config.apiKey,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}