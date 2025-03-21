import { GeneratedImage } from '../deepai/types';
import { supabase } from './client';
import { PostgrestError } from '@supabase/supabase-js';

export interface ImageMetadata {
  id: string;
  quote_id: string;
  image_url: string;
  background_type: string;
  created_at: string;
  metadata: {
    [key: string]: any;
  };
}

export class ImageStorageError extends Error {
  constructor(
    message: string,
    public originalError: Error | PostgrestError | null = null
  ) {
    super(message);
    this.name = 'ImageStorageError';
  }
}

class ImageStorageService {
  private readonly BUCKET_NAME = 'quote-images';
  private readonly TABLE_NAME = 'generated_images';

  async initializeStorage() {
    try {
      // Create bucket if it doesn't exist
      const { data: existingBucket, error: bucketError } = await supabase
        .storage
        .getBucket(this.BUCKET_NAME);

      if (!existingBucket && !bucketError) {
        const { error } = await supabase
          .storage
          .createBucket(this.BUCKET_NAME, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
          });

        if (error) throw error;
      }

      // Create table if it doesn't exist
      const { error: tableError } = await supabase
        .rpc('create_generated_images_if_not_exists');

      if (tableError) throw tableError;

    } catch (error) {
      throw new ImageStorageError(
        'Failed to initialize image storage',
        error as Error
      );
    }
  }

  async saveImage(generatedImage: GeneratedImage, quoteId: string): Promise<ImageMetadata> {
    try {
      // Convert image URL to blob
      const response = await fetch(generatedImage.url);
      const imageBlob = await response.blob();

      // Generate unique filename
      const filename = `${quoteId}-${Date.now()}.webp`;

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(this.BUCKET_NAME)
        .upload(filename, imageBlob, {
          contentType: 'image/webp',
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filename);

      // Save metadata to database
      const { data: metadata, error: dbError } = await supabase
        .from(this.TABLE_NAME)
        .insert({
          quote_id: quoteId,
          image_url: publicUrl,
          background_type: generatedImage.metadata.backgroundType,
          metadata: generatedImage.metadata
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return metadata as ImageMetadata;

    } catch (error) {
      throw new ImageStorageError(
        'Failed to save generated image',
        error as Error
      );
    }
  }

  async getImagesByQuoteId(quoteId: string): Promise<ImageMetadata[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as ImageMetadata[];

    } catch (error) {
      throw new ImageStorageError(
        'Failed to fetch images for quote',
        error as Error
      );
    }
  }

  async deleteImage(imageId: string): Promise<void> {
    try {
      // Get image metadata
      const { data: metadata, error: fetchError } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', imageId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const filename = new URL(metadata.image_url).pathname.split('/').pop();
      if (filename) {
        const { error: storageError } = await supabase
          .storage
          .from(this.BUCKET_NAME)
          .remove([filename]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

    } catch (error) {
      throw new ImageStorageError(
        'Failed to delete image',
        error as Error
      );
    }
  }
}

export const imageStorage = new ImageStorageService();