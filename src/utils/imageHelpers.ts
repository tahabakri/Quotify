// Centralized image URL handling for consistent avatar generation using DiceBear API
const DICEBEAR_API_URL = 'https://api.dicebear.com/7.x';

// Get a placeholder image URL based on a seed value
function getPlaceholderImage(style: string, seed: string): string {
  return `${DICEBEAR_API_URL}/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

export function getImageUrl(type: 'author' | 'book' | 'curator' | 'collection', name: string): string {
  const styles = {
    author: 'avataaars',    // For author profile pictures
    book: 'identicon',      // For book covers
    curator: 'bottts',      // For curator avatars
    collection: 'rings'     // For collection covers
  };
  
  const style = styles[type];
  return getPlaceholderImage(style, name);
}

// Utility function to ensure image URLs always use the placeholder system
export function ensurePlaceholderImage(url: string | undefined, type: 'author' | 'book' | 'curator' | 'collection', name: string): string {
  if (!url || url.startsWith('/')) {
    // If no URL is provided or it's a local path, generate a placeholder
    return getImageUrl(type, name);
  }
  return url;
}