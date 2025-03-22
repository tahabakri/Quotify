# Database Migrations

This directory contains SQL migrations for setting up the Supabase database schema.

## Migration Files

1. `01_initial_schema.sql` - Creates the base tables and indexes
2. `02_stored_procedures.sql` - Adds helper functions and stored procedures
3. `03_policies_and_seeds.sql` - Sets up RLS policies and adds sample data

## How to Apply Migrations

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order (01, 02, 03)
4. Run each script separately

### Important Notes

- Run migrations in order (01 → 02 → 03)
- Modify the sample data in `03_policies_and_seeds.sql` as needed
- Replace the placeholder user ID in the collections seed data with your admin user ID
- These migrations assume you have the `uuid-ossp` extension enabled

## Schema Details

### Tables
- `authors` - Author information
- `books` - Book details from both local and Google Books
- `quotes` - Quotes with references to books and authors
- `collections` - User-created quote collections
- `collection_quotes` - Junction table for quotes in collections

### Stored Procedures
- `increment_quote_likes(quote_id)` - Increment likes on a quote
- `increment_quote_views(quote_id)` - Increment view count on a quote
- `sync_google_book(...)` - Sync a book from Google Books API
- `get_collection_quote_counts(collection_ids)` - Get quote counts for collections

### Row Level Security

All tables have RLS enabled with appropriate policies:
- Public read access for most tables
- Authenticated user access for creating/updating own content
- Users can only modify their own collections and quotes

## After Migration

After running the migrations:

1. Test the stored procedures:
```sql
SELECT increment_quote_likes('quote-id-here');
```

2. Verify RLS policies:
```sql
SELECT * FROM quotes;  -- Should work for everyone
INSERT INTO quotes ...  -- Should only work for authenticated users
```

3. Check sample data:
```sql
SELECT * FROM authors;
SELECT * FROM books;
SELECT * FROM quotes;