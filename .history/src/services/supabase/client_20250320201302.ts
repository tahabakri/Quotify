import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize the database schema for generated images
const initGeneratedImagesSchema = async () => {
  const { error } = await supabase.rpc('create_generated_images_if_not_exists', {}, {
    head: true // Just check if the function exists
  });

  if (error?.message.includes('does not exist')) {
    // Create the function and table if they don't exist
    await supabase.rpc('create_schema_generated_images', undefined, {
      head: true
    });
  }
};

// Initialize schema
initGeneratedImagesSchema().catch(console.error);