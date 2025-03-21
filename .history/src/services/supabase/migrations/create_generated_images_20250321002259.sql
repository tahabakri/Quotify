-- Create enum for theme type
CREATE TYPE theme_type AS ENUM ('light', 'dark');

-- Create enum for background type
CREATE TYPE background_type AS ENUM ('ai', 'gradient', 'solid');

-- Create enum for style type
CREATE TYPE style_type AS ENUM ('modern', 'classic', 'minimal');

-- Create the generated_images table
create or replace function create_schema_generated_images()
returns void
language plpgsql
as $$
begin
  -- Create the table if it doesn't exist
  create table if not exists generated_images (
    id uuid default uuid_generate_v4() primary key,
    quote_id uuid references quotes(id) on delete cascade,
    storage_path text not null,
    url text not null,
    prompt text,
    theme theme_type not null default 'light',
    background_type background_type not null,
    style style_type not null default 'modern',
    metadata jsonb default '{}',
    user_id uuid references auth.users(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Create index for faster lookups
  create index if not exists idx_generated_images_quote_id 
    on generated_images(quote_id);

  -- Create index for faster theme-based queries
  create index if not exists idx_generated_images_theme 
    on generated_images(theme);

  -- Create index for user queries
  create index if not exists idx_generated_images_user 
    on generated_images(user_id);

  -- Create function to check if table exists
  create or replace function create_generated_images_if_not_exists()
  returns void
  language plpgsql
  as $func$
  begin
    if not exists (
      select from pg_tables
      where schemaname = 'public'
      and tablename = 'generated_images'
    ) then
      perform create_schema_generated_images();
    end if;
  end;
  $func$;

  -- Create function to update updated_at timestamp
  create or replace function update_updated_at_column()
  returns trigger as $$
  begin
    new.updated_at = now();
    return new;
  end;
  $$ language 'plpgsql';

  -- Create trigger for updating timestamp
  create trigger update_generated_images_updated_at
    before update on generated_images
    for each row
    execute function update_updated_at_column();

  -- Create trigger to automatically clean up storage when record is deleted
  create or replace function cleanup_generated_image()
  returns trigger
  language plpgsql
  as $func$
  declare
    filename text;
  begin
    -- Extract filename from URL
    filename := substring(old.url from '/([^/]+)$');
    
    -- Delete file from storage
    perform delete_storage_object('quote-images', filename);
    
    return old;
  end;
  $func$;

  -- Create the trigger
  drop trigger if exists generated_images_cleanup_trigger on generated_images;
  create trigger generated_images_cleanup_trigger
    before delete on generated_images
    for each row
    execute function cleanup_generated_image();
end;
$$;