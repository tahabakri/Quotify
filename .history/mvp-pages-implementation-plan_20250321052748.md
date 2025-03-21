# MVP Pages Implementation Plan

## Component Architecture

```mermaid
graph TD
    A[App] --> B[Landing Page]
    A --> C[Search Results]
    A --> D[Quote Details]
    A --> E[Author Page]
    A --> F[Collections]

    B --> B1[SearchBar]
    B --> B2[TrendingQuotes]
    B --> B3[QuickFilters]

    C --> C1[ResultsGrid]
    C1 --> C2[QuoteCard]
    C --> C3[FilterPanel]

    D --> D1[QuoteView]
    D --> D2[BookInfo]
    D --> D3[AIImageGen]
    D --> D4[RelatedQuotes]

    E --> E1[AuthorInfo]
    E --> E2[QuotesList]
    E --> E3[FollowButton]

    F --> F1[CollectionsList]
    F --> F2[FilteredQuotes]
```

## 1. Landing Page Implementation

### Components
- Reuse existing `SearchSection` components:
  - SearchBar (✅ already implemented)
  - QuickFilters (✅ already implemented)
  - GenreSelector (✅ already implemented)
- New Components:
  - TrendingQuotes grid
  - Featured Collections preview

### Data Integration
- Connect to Supabase for trending quotes
- Implement caching for frequently accessed data
- Add pagination for trending quotes

## 2. Search Results Page

### Components
- Reuse existing components:
  - BookGrid/ResultsGrid (✅ already implemented)
  - FilterSection (✅ already implemented)
- New Components:
  - QuoteCard (modify existing BookCard)
  - SortingControls
  - ResultsCounter

### Features
- Combined search for books and quotes
- Advanced filtering:
  - By author
  - By genre
  - By popularity/trending
  - By date
- Sorting options
- Infinite scroll (✅ already implemented)

## 3. Quote Detail Page

### Components
- QuoteView
  - Quote display with typography options
  - Share buttons
  - Copy functionality
- BookInfo panel (reuse from BookDetailsSection)
- AIImageGeneration (✅ already implemented)
- RelatedQuotes section
- ActionPanel
  - Save to collection
  - Follow author
  - Report inappropriate content

### Integration
- Connect with DeepAI service (✅ already implemented)
- Implement social sharing
- Add quote analytics

## 4. Author Page

### Components
- AuthorHeader
  - Bio
  - Stats
  - Follow button
- QuotesList
  - Filter by book
  - Sort options
- NotableWorks section

### Features
- Author following system
- Quote filtering by book
- Biographical information from external APIs

## 5. Collections Page

### Components
- CollectionGrid
  - Collection cards
  - Preview images
- FilteredQuotesList
- CollectionHeader
  - Title
  - Description
  - Stats

### Features
- Curated collections
- User-created collections (future)
- Filtering and sorting
- Share collections

## Technical Considerations

### State Management
- Utilize existing React Context (✅ already implemented)
- Add new contexts for:
  - Author following
  - Collections
  - User preferences

### Data Layer
```typescript
// New Types
interface Author {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  notableWorks: string[];
  followers: number;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  quotes: string[];
  coverImage?: string;
  curator: string;
}
```

### Database Schema Updates
```sql
-- Authors table
create table authors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  bio text,
  image_url text,
  notable_works jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Collections table
create table collections (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  quotes jsonb,
  cover_image text,
  curator_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### Accessibility
- Maintain existing accessibility features (✅ already implemented)
- Add new considerations for:
  - Share dialogs
  - Collection navigation
  - Author page interactions

### Performance
- Implement lazy loading for:
  - Collection images
  - Author photos
  - Related quotes
- Use pagination for large datasets
- Cache frequently accessed data

### Security
- Rate limiting for:
  - Quote generation
  - Author following
  - Collection creation
- Input sanitization
- User authorization for protected actions

## Implementation Phases

1. Landing Page Enhancement (1 week)
   - Add trending quotes section
   - Implement featured collections
   - Optimize search experience

2. Quote Detail Page (1 week)
   - Build quote view component
   - Integrate AI image generation
   - Add sharing functionality

3. Author Pages (1 week)
   - Create author profile views
   - Implement following system
   - Add quote filtering

4. Collections System (1 week)
   - Build collection components
   - Implement filtering
   - Add sharing features

5. Testing & Optimization (1 week)
   - Performance testing
   - Accessibility audit
   - Security review
   - Cross-browser testing