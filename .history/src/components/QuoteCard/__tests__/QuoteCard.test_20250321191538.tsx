/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuoteCard } from '../QuoteCard';
import type { Quote } from '../../../types';

const mockQuote: Required<Quote> = {
  id: 'test-1',
  content: 'Test quote content',
  authorId: 'author-1',
  author: {
    id: 'author-1',
    name: 'Test Author',
    imageUrl: 'https://example.com/author.jpg',
    followers: 100,
    quotesCount: 10,
    worksCount: 5,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    notableWorks: [],
    genres: [],
  },
  book: {
    id: 'book-1',
    title: 'Test Book',
    imageUrl: 'https://example.com/book.jpg',
  },
  tags: ['test', 'mock'],
  likes: 42,
  shares: 21,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
};

describe('QuoteCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders quote content correctly', () => {
    render(<QuoteCard quote={mockQuote} />);
    
    expect(screen.getByText(`"${mockQuote.content}"`)).toBeInTheDocument();
    expect(screen.getByText(mockQuote.author.name)).toBeInTheDocument();
    expect(screen.getByText(mockQuote.book.title)).toBeInTheDocument();
  });

  it('handles interactions correctly', () => {
    const onLike = jest.fn();
    const onShare = jest.fn();
    const onSave = jest.fn();

    render(
      <QuoteCard
        quote={mockQuote}
        onLike={onLike}
        onShare={onShare}
        onSave={onSave}
      />
    );

    fireEvent.click(screen.getByLabelText('Like quote'));
    expect(onLike).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Share quote'));
    expect(onShare).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Save quote'));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('displays correct styles for different variants', () => {
    const { rerender } = render(
      <QuoteCard quote={mockQuote} variant="default" />
    );
    expect(screen.getByRole('blockquote').parentElement).toHaveClass('p-6');

    rerender(<QuoteCard quote={mockQuote} variant="compact" />);
    expect(screen.getByRole('blockquote').parentElement).toHaveClass('p-4');

    rerender(<QuoteCard quote={mockQuote} variant="featured" />);
    expect(screen.getByRole('blockquote').parentElement).toHaveClass('p-8');
  });

  it('applies custom theme correctly', () => {
    const theme = {
      backgroundColor: '#f0f9ff',
      textColor: '#0c4a6e',
      accentColor: '#0ea5e9',
    };

    render(<QuoteCard quote={mockQuote} theme={theme} />);
    
    const card = screen.getByRole('blockquote').parentElement;
    expect(card).toHaveStyle({
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
    });
  });

  it('disables interactions when not interactive', () => {
    const onLike = jest.fn();
    const onShare = jest.fn();
    const onSave = jest.fn();

    render(
      <QuoteCard
        quote={mockQuote}
        interactive={false}
        onLike={onLike}
        onShare={onShare}
        onSave={onSave}
      />
    );

    const likeButton = screen.getByLabelText('Like quote');
    const shareButton = screen.getByLabelText('Share quote');
    const saveButton = screen.getByLabelText('Save quote');

    expect(likeButton).toBeDisabled();
    expect(shareButton).toBeDisabled();
    expect(saveButton).toBeDisabled();

    fireEvent.click(likeButton);
    fireEvent.click(shareButton);
    fireEvent.click(saveButton);

    expect(onLike).not.toHaveBeenCalled();
    expect(onShare).not.toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows liked and saved states correctly', () => {
    render(
      <QuoteCard
        quote={mockQuote}
        liked={true}
        saved={true}
      />
    );

    const likeButton = screen.getByLabelText('Unlike quote');
    const saveButton = screen.getByLabelText('Remove from saved');

    expect(likeButton).toHaveClass('text-red-500');
    expect(saveButton).toHaveClass('text-blue-500');
  });
});