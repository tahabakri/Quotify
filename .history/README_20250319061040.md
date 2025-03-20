# Book Search & Selection System

A modern book search interface with multiple API integrations and rich features.

## Features

### Search Interface
- Dynamic search bar with real-time search
- Quick filter buttons (Trending, Latest, By Genre)
- Visual genre selector with icons
- Multiple API support:
  - Google Books API (with reviews and ratings)
  - Open Library API (extensive catalog)
  - Easy switching between APIs

### Results Display
- Responsive book cards with hover animations
- Rich book information:
  - Cover images
  - Title and author
  - Publication year
  - Ratings and review counts
  - Page count
  - Book description preview
- Quick-access buttons for:
  - Save to reading list
  - View quotes
  - Preview book

### Technical Features
- TypeScript for type safety
- React with Context API for state management
- Tailwind CSS for styling
- Dark mode support
- Mobile-first responsive design
- Accessible UI components

## API Integration

### Google Books API
- Comprehensive book metadata
- High-quality cover images
- User ratings and reviews
- 10,000 requests/day quota
- Requires API key (set in .env)

### Open Library API
- Extensive book catalog
- No API key required
- Community-contributed data
- Cover images via dedicated API

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   VITE_GOOGLE_BOOKS_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### API Services
- `src/services/googleBooks.ts` - Google Books API integration
- `src/services/openLibrary.ts` - Open Library API integration

### Components
- SearchSection
  - SearchBar
  - QuickFilters
  - GenreSelector
  - ApiSourceSelector
- ResultsSection
  - BookCard
  - ResultsGrid

### State Management
- SearchContext for managing:
  - Search queries
  - Filter states
  - API source selection
  - Results caching

## Future Enhancements
- Advanced filtering options
- User book lists
- Offline support
- Social sharing
- Reading progress tracking