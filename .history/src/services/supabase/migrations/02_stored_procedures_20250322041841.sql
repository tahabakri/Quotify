-- Function to increment quote likes
CREATE OR REPLACE FUNCTION increment_quote_likes(quote_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE quotes
    SET likes = likes + 1
    WHERE id = quote_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment quote views
CREATE OR REPLACE FUNCTION increment_quote_views(quote_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE quotes
    SET views = views + 1
    WHERE id = quote_id;
END;
$$ LANGUAGE plpgsql;

-- Function to sync book from Google Books
CREATE OR REPLACE FUNCTION sync_google_book(
    p_google_book_id TEXT,
    p_title TEXT,
    p_author TEXT,
    p_description TEXT,
    p_cover_url TEXT,
    p_preview_link TEXT,
    p_info_link TEXT,
    p_published_date TEXT,
    p_average_rating DECIMAL,
    p_categories TEXT[]
)
RETURNS UUID AS $$
DECLARE
    v_book_id UUID;
BEGIN
    -- Insert or update the book
    INSERT INTO books (
        id,
        title,
        author,
        description,
        cover_url,
        preview_link,
        info_link,
        published_date,
        average_rating,
        categories
    )
    VALUES (
        uuid_generate_v4(),
        p_title,
        p_author,
        p_description,
        p_cover_url,
        p_preview_link,
        p_info_link,
        p_published_date,
        p_average_rating,
        p_categories
    )
    ON CONFLICT (title, author)
    DO UPDATE SET
        description = p_description,
        cover_url = p_cover_url,
        preview_link = p_preview_link,
        info_link = p_info_link,
        published_date = p_published_date,
        average_rating = p_average_rating,
        categories = p_categories,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO v_book_id;

    RETURN v_book_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get quote counts for collections
CREATE OR REPLACE FUNCTION get_collection_quote_counts(collection_ids UUID[])
RETURNS TABLE (collection_id UUID, quote_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cq.collection_id,
        COUNT(cq.quote_id)::BIGINT as quote_count
    FROM
        collections c
        LEFT JOIN collection_quotes cq ON c.id = cq.collection_id
    WHERE
        c.id = ANY(collection_ids)
    GROUP BY
        cq.collection_id;
END;
$$ LANGUAGE plpgsql;