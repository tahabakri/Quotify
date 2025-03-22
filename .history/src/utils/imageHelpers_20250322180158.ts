// Centralized image URL handling for consistent avatar generation
import { getPlaceholderImages } from '../services/ai/imageUtils';

export function getImageUrl(type: 'author' | 'book' | 'curator' | 'collection', name: string): string {
  const images = getPlaceholderImages(name);
  
  switch (type) {
    case 'author':
      return images.authorImage;
    case 'book':
      return images.bookCover;
    case 'curator':
      return images.curatorAvatar;
    case 'collection':
      return images.collectionCover;
    default:
      return images.authorImage; // Default fallback
  }
}

// Utility function to ensure image URLs always use the placeholder system
export function ensurePlaceholderImage(url: string | undefined, type: 'author' | 'book' | 'curator' | 'collection', name: string): string {
  if (!url || url.startsWith('/')) {
    // If no URL is provided or it's a local path, generate a placeholder
    return getImageUrl(type, name);
  }
  return url;
}