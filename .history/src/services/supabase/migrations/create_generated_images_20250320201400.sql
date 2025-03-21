-- Create the generated_images table
create or replace function create_schema_generated_images()
returns void
language plpgsql
as $$
begin
  -- Create the table if it doesn't exist
  create table if not exists generated_images (
    id uuid default uuid_generate_v4() primary key,
    quote_id uuid references quotes(id),
    image_url text not null,
    background_type text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    metadata jsonb
  );

  -- Create index for faster lookups
  create index if not exists idx_generated_images_quote_id 
    on generated_images(quote_id);

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

  -- Create trigger to automatically clean up storage when record is deleted
  create or replace function cleanup_generated_image()
  returns trigger
  language plpgsql
  as $func$
  declare
    filename text;
  begin
    -- Extract filename from URL
    filename := substring(old.image_url from '/([^/]+)$');
    
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