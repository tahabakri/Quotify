import React from 'react';
import { Quote } from '../../services/supabase/types';
import { Loader2, Image } from 'lucide-react';

interface ImagePreviewProps {
  quote: Quote;
  imageUrl: string | null;
  loading?: boolean;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  quote,
  imageUrl,
  loading = false,
  className = ''
}: ImagePreviewProps) => {
  return (
    <div 
      className={`relative bg-gray-100 dark:bg-gray-800 ${className}`}
      role="img"
      aria-label={imageUrl ? 'Generated quote image' : 'Image preview area'}
    >
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generating your image...
            </p>
          </div>
        </div>
      ) : !imageUrl ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <Image className="w-12 h-12 text-gray-400 dark:text-gray-600" />
          <div className="text-center px-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
              Choose your background style and click generate to create your quote image
            </p>
          </div>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={`Generated image for quote: ${quote.content}`}
          className="w-full h-full object-cover"
        />
      )}

      {imageUrl && !loading && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
          <blockquote className="text-white text-lg font-medium">
            <p className="drop-shadow-md">"{quote.content}"</p>
            {quote.author && (
              <footer className="mt-2 text-sm text-white/90">
                — {quote.author}
              </footer>
            )}
          </blockquote>
        </div>
      )}
    </div>
  );
}

export default ImagePreview;