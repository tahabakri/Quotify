import { useState, useCallback } from 'react';
import { generateContent, GeneratedContent } from '../services/ai';
import { AsyncState } from '../types';

interface AIGenerationConfig {
  authorCount?: number;
  quotesPerAuthor?: number;
  collectionsCount?: number;
}

export function useAIGeneration() {
  const [generationState, setGenerationState] = useState<AsyncState<GeneratedContent>>({
    data: null,
    error: null,
    status: 'idle'
  });

  const generate = useCallback(async (config?: AIGenerationConfig) => {
    try {
      setGenerationState(prev => ({ ...prev, status: 'loading' }));

      const content = await generateContent(
        config?.authorCount,
        config?.quotesPerAuthor,
        config?.collectionsCount
      );

      setGenerationState({
        data: content,
        error: null,
        status: 'success'
      });

      return content;
    } catch (error) {
      setGenerationState({
        data: null,
        error: {
          code: 'AI_GENERATION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to generate content'
        },
        status: 'error'
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setGenerationState({
      data: null,
      error: null,
      status: 'idle'
    });
  }, []);

  return {
    ...generationState,
    generate,
    reset,
    isLoading: generationState.status === 'loading',
    isError: generationState.status === 'error',
    isSuccess: generationState.status === 'success'
  };
}