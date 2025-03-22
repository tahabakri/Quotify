// Default placeholder images using DiceBear API for consistent, deterministic avatars
export const getPlaceholderImages = (seed: string) => {
  const styles = {
    author: 'avataaars', // For author profile pictures
    book: 'identicon',   // For book covers
    curator: 'bottts',   // For curator avatars
    collection: 'rings'  // For collection covers
  };

  return {
    authorImage: `https://api.dicebear.com/7.x/${styles.author}/svg?seed=${encodeURIComponent(seed)}`,
    bookCover: `https://api.dicebear.com/7.x/${styles.book}/svg?seed=${encodeURIComponent(seed)}`,
    curatorAvatar: `https://api.dicebear.com/7.x/${styles.curator}/svg?seed=${encodeURIComponent(seed)}`,
    collectionCover: `https://api.dicebear.com/7.x/${styles.collection}/svg?seed=${encodeURIComponent(seed)}`
  };
};