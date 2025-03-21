import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { GeneratedImage } from '../services/deepai/types';
import { deepai } from '../services/deepai';

interface ImageGenerationState {
  images: Record<string, GeneratedImage>;
  loading: boolean;
  error: Error | null;
}

type ImageGenerationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'ADD_IMAGE'; payload: { quoteId: string; image: GeneratedImage } }
  | { type: 'CLEAR_IMAGES' };

interface ImageGenerationContextValue extends ImageGenerationState {
  generateImage: (quoteId: string, prompt: string) => Promise<GeneratedImage>;
  clearImages: () => void;
  getImageForQuote: (quoteId: string) => GeneratedImage | undefined;
}

const initialState: ImageGenerationState = {
  images: {},
  loading: false,
  error: null,
};

const ImageGenerationContext = createContext<ImageGenerationContextValue | undefined>(undefined);

function imageGenerationReducer(
  state: ImageGenerationState,
  action: ImageGenerationAction
): ImageGenerationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_IMAGE':
      return {
        ...state,
        images: {
          ...state.images,
          [action.payload.quoteId]: action.payload.image,
        },
      };
    case 'CLEAR_IMAGES':
      return { ...state, images: {} };
    default:
      return state;
  }
}

export function ImageGenerationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(imageGenerationReducer, initialState);

  const generateImage = useCallback(async (quoteId: string, prompt: string): Promise<GeneratedImage> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Check cache first
      const cachedImage = state.images[quoteId];
      if (cachedImage) {
        return cachedImage;
      }

      // Generate image using DeepAI service
      const generatedImage = await deepai.generateImage({
        prompt,
        backgroundType: 'nature', // You might want to make this configurable
        resolution: '1024x1024'
      });

      // Add metadata
      const imageWithMetadata: GeneratedImage = {
        ...generatedImage,
        metadata: {
          ...generatedImage.metadata,
          quoteId,
          prompt
        }
      };

      dispatch({
        type: 'ADD_IMAGE',
        payload: { quoteId, image: imageWithMetadata },
      });

      return imageWithMetadata;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate image');
      dispatch({ type: 'SET_ERROR', payload: err });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.images]);

  const clearImages = useCallback(() => {
    dispatch({ type: 'CLEAR_IMAGES' });
  }, []);

  const getImageForQuote = useCallback((quoteId: string) => {
    return state.images[quoteId];
  }, [state.images]);

  const value = {
    ...state,
    generateImage,
    clearImages,
    getImageForQuote,
  };

  return (
    <ImageGenerationContext.Provider value={value}>
      {children}
    </ImageGenerationContext.Provider>
  );
}

export function useImageGeneration() {
  const context = useContext(ImageGenerationContext);
  if (!context) {
    throw new Error('useImageGeneration must be used within an ImageGenerationProvider');
  }
  return context;
}

// Hook for managing image generation for a specific quote
export function useQuoteImage(quoteId: string) {
  const { generateImage, getImageForQuote, loading, error } = useImageGeneration();

  const image = getImageForQuote(quoteId);

  const generateQuoteImage = useCallback(async (prompt: string) => {
    return generateImage(quoteId, prompt);
  }, [generateImage, quoteId]);

  return {
    image,
    loading,
    error,
    generateQuoteImage,
  };
}

export default ImageGenerationContext;