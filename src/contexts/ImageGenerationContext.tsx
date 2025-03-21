import React, { createContext, useContext, useState, useCallback } from 'react';
import { deepAiService } from '../services/deepai';
import type { ImageGenerationOptions, BackgroundMood } from '../services/deepai/types';

interface ImageGenerationContextType {
  currentImage: string | null;
  loading: boolean;
  error: string | null;
  generateImage: (text: string, options: ImageGenerationOptions) => Promise<void>;
  clearImage: () => void;
}

const ImageGenerationContext = createContext<ImageGenerationContextType | undefined>(undefined);

export function ImageGenerationProvider({ children }: { children: React.ReactNode }) {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = useCallback(async (text: string, options: ImageGenerationOptions) => {
    try {
      setLoading(true);
      setError(null);

      // Adjust generation options based on dark mode
      const isDarkMode = document.documentElement.classList.contains('dark');
      const adjustedOptions = {
        ...options,
        mood: isDarkMode ? 'dark' as BackgroundMood : 'light' as BackgroundMood,
        ...options.mood && { mood: options.mood }, // Allow override if specifically set
      };

      const result = await deepAiService.generateImage(text, adjustedOptions);
      setCurrentImage(result.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      console.error('Image generation error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setCurrentImage(null);
    setError(null);
  }, []);

  const value = {
    currentImage,
    loading,
    error,
    generateImage,
    clearImage,
  };

  return (
    <ImageGenerationContext.Provider value={value}>
      {children}
    </ImageGenerationContext.Provider>
  );
}

export function useImageGeneration() {
  const context = useContext(ImageGenerationContext);
  if (context === undefined) {
    throw new Error('useImageGeneration must be used within an ImageGenerationProvider');
  }
  return context;
}