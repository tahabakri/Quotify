export * from './client';
export * from './types';

import { deepAiClient } from './client';
export const deepAiService = deepAiClient;

// Re-export common functions for convenience
export const generateImage = deepAiClient.generateImage.bind(deepAiClient);