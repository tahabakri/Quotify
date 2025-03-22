# QuoteCard Component

A versatile card component for displaying quotes with various styles and interactive features.

## Basic Usage

```tsx
import { QuoteCard } from './QuoteCard';

function Example() {
  return (
    <QuoteCard
      quote={quote}
      onLike={() => console.log('Liked')}
      onShare={() => console.log('Shared')}
      onSave={() => console.log('Saved')}
    />
  );
}
```

## Components

- `QuoteCard`: Main component for displaying a quote
- `QuoteCardSkeleton`: Loading placeholder
- `QuoteCardGrid`: Grid of loading skeletons
- `QuoteCardExample`: Example implementation with state management
- `QuoteCardDemo`: Component showcasing all variants and features

## Props

### QuoteCardProps

```tsx
interface QuoteCardProps {
  quote: Quote;                // Quote data
  className?: string;         // Additional CSS classes
  variant?: 'default' | 'compact' | 'featured';  // Card style variant
  interactive?: boolean;      // Enable/disable interactions
  theme?: {                  // Custom theming
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
  };
  onLike?: () => void;       // Like callback
  onShare?: () => void;      // Share callback
  onSave?: () => void;       // Save callback
  liked?: boolean;           // Like state
  saved?: boolean;           // Save state
}
```

### QuoteCardSkeletonProps

```tsx
interface QuoteCardSkeletonProps {
  className?: string;
  animated?: boolean;        // Enable/disable animation
}
```

### QuoteCardGridProps

```tsx
interface QuoteCardGridProps {
  className?: string;
  count?: number;            // Number of skeleton cards to show
}
```

## Styling

The component uses Tailwind CSS for styling and supports dark mode out of the box:

```tsx
// Default theme
<QuoteCard quote={quote} />

// Custom theme
<QuoteCard
  quote={quote}
  theme={{
    backgroundColor: '#f0f9ff',
    textColor: '#0c4a6e',
    accentColor: '#0ea5e9',
  }}
/>
```

## Example Usage

### Loading State

```tsx
function QuoteList({ loading, quotes }) {
  if (loading) {
    return <QuoteCardGrid count={6} />;
  }

  return quotes.map(quote => (
    <QuoteCard key={quote.id} quote={quote} />
  ));
}
```

### Interactive Features

```tsx
function InteractiveQuote({ quote }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Quote by ${quote.author.name}`,
        text: quote.content,
        url: window.location.href
      });
    }
  };

  return (
    <QuoteCard
      quote={quote}
      liked={liked}
      saved={saved}
      onLike={() => setLiked(!liked)}
      onSave={() => setSaved(!saved)}
      onShare={handleShare}
    />
  );
}
```

### Different Variants

```tsx
<div className="grid grid-cols-3 gap-4">
  <QuoteCard quote={quote} variant="default" />
  <QuoteCard quote={quote} variant="compact" />
  <QuoteCard quote={quote} variant="featured" />
</div>
```

## Utilities

The component exports several utilities:

```tsx
// Create a custom theme
const theme = createQuoteCardTheme('#ffffff', '#000000', '#3b82f6');

// Available variants
const variants = QUOTE_CARD_VARIANTS; // ['default', 'compact', 'featured']

// Default props
const defaults = QUOTE_CARD_DEFAULTS;