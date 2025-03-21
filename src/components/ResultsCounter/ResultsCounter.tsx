interface ResultsCounterProps {
  total: number;
  searchTerm?: string;
}

export function ResultsCounter({ total, searchTerm }: ResultsCounterProps) {
  if (total === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        {searchTerm ? (
          <>
            No results found for <span className="font-medium">"{searchTerm}"</span>
          </>
        ) : (
          'No results found'
        )}
      </p>
    );
  }

  return (
    <p className="text-gray-600 dark:text-gray-400">
      {searchTerm ? (
        <>
          Found <span className="font-medium">{total}</span> {total === 1 ? 'result' : 'results'} 
          for <span className="font-medium">"{searchTerm}"</span>
        </>
      ) : (
        <>
          Showing <span className="font-medium">{total}</span> {total === 1 ? 'quote' : 'quotes'}
        </>
      )}
    </p>
  );
}