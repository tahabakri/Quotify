-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public quotes are viewable by everyone"
ON quotes FOR SELECT
USING (true);

CREATE POLICY "Users can create quotes"
ON quotes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes"
ON quotes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes"
ON quotes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Collection policies
CREATE POLICY "Public collections are viewable by everyone"
ON collections FOR SELECT
USING (true);

CREATE POLICY "Users can create collections"
ON collections FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
ON collections FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
ON collections FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Collection quotes policies
CREATE POLICY "Collection quotes are viewable by everyone"
ON collection_quotes FOR SELECT
USING (true);

CREATE POLICY "Users can add quotes to their collections"
ON collection_quotes FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM collections
        WHERE id = collection_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can remove quotes from their collections"
ON collection_quotes FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM collections
        WHERE id = collection_id
        AND user_id = auth.uid()
    )
);

-- Insert sample data
INSERT INTO authors (id, name, image_url) VALUES
(uuid_generate_v4(), 'Jane Austen', 'https://example.com/jane-austen.jpg'),
(uuid_generate_v4(), 'F. Scott Fitzgerald', 'https://example.com/fitzgerald.jpg'),
(uuid_generate_v4(), 'George Orwell', 'https://example.com/orwell.jpg'),
(uuid_generate_v4(), 'Virginia Woolf', 'https://example.com/woolf.jpg');

INSERT INTO books (id, title, author, description, categories) VALUES
(uuid_generate_v4(), 'Pride and Prejudice', 'Jane Austen', 'A classic novel about...',  ARRAY['Classic', 'Romance']),
(uuid_generate_v4(), 'The Great Gatsby', 'F. Scott Fitzgerald', 'A story of decadence...', ARRAY['Classic', 'Literary Fiction']),
(uuid_generate_v4(), '1984', 'George Orwell', 'A dystopian novel...', ARRAY['Science Fiction', 'Dystopian']),
(uuid_generate_v4(), 'Mrs Dalloway', 'Virginia Woolf', 'A day in the life...', ARRAY['Classic', 'Literary Fiction']);

-- Insert some test quotes (user_id will need to be set when running)
INSERT INTO quotes (id, content, book_id, author_id, genre) 
SELECT 
    uuid_generate_v4(),
    'Sample quote text...',
    b.id,
    a.id,
    b.categories[1]
FROM 
    books b
    JOIN authors a ON b.author = a.name
LIMIT 5;

-- Create a featured collection
INSERT INTO collections (id, name, description, user_id, featured)
VALUES (
    uuid_generate_v4(),
    'Classic Literature Quotes',
    'A curated collection of timeless quotes from classic literature',
    '00000000-0000-0000-0000-000000000000', -- Replace with admin user ID
    true
);