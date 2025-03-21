import { GeneratedImage } from '../deepai/types';
import { supabase, getImageUrl } from './client';
import { PostgrestError } from '@supabase/supabase-js';

export interface ImageMetadata {
  id: string;
  quote_id: string;
  image_url: string;
  background_type: string;
  created_at: string;
  metadata: {
    backgroundType: string;
    timestamp: string;
    quoteId: string;
    resolution?: string;
    prompt?: string;
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
      const { error: uploadError } = await supabase
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

interface StoredImage {
  id: string;
  url: string;
  prompt: string;
  theme: 'light' | 'dark';
  style: string;
  metadata: Record<string, any>;
  created_at: string;
}

export async function storeGeneratedImage(
  result: GenerationResult,
  userId?: string
): Promise<StoredImage> {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const timestamp = new Date().toISOString();
  const path = `${userId || 'anonymous'}/${timestamp}-${Math.random().toString(36).slice(2)}.png`;

  // Download the image from the DeepAI URL
  const imageResponse = await fetch(result.imageUrl);
  const imageBlob = await imageResponse.blob();

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('generated-images')
    .upload(path, imageBlob, {
      contentType: 'image/png',
      cacheControl: '3600',
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  // Store metadata in the database
  const { data, error: insertError } = await supabase
    .from('generated_images')
    .insert({
      storage_path: path,
      url: getImageUrl(path),
      prompt: result.prompt,
      theme,
      style: result.metadata?.style || 'default',
      metadata: {
        ...result.metadata,
        userPreferences: {
          theme,
          timestamp
        }
      },
      user_id: userId
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to store image metadata: ${insertError.message}`);
  }

  return data as StoredImage;
}

export async function getGeneratedImages(
  userId?: string,
  options: {
    theme?: 'light' | 'dark';
    limit?: number;
    offset?: number;
  } = {}
): Promise<StoredImage[]> {
  const { theme, limit = 20, offset = 0 } = options;

  let query = supabase
    .from('generated_images')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (theme) {
    query = query.eq('theme', theme);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch generated images: ${error.message}`);
  }

  return data as StoredImage[];
}

export async function deleteGeneratedImage(id: string, userId?: string): Promise<void> {
  // First get the image to check ownership and get storage path
  const { data: image, error: fetchError } = await supabase
    .from('generated_images')
    .select('storage_path, user_id')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch image: ${fetchError.message}`);
  }

  // Check ownership if userId provided
  if (userId && image.user_id !== userId) {
    throw new Error('Unauthorized to delete this image');
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('generated-images')
    .remove([image.storage_path]);

  if (storageError) {
    throw new Error(`Failed to delete image file: ${storageError.message}`);
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from('generated_images')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(`Failed to delete image record: ${deleteError.message}`);
  }
}