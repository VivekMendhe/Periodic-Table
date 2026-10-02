import React, { useRef, useEffect } from 'react';
import './ElementSearch.css';

interface ElementSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  matchCount: number;
  totalCount: number;
  isFilteringActive: boolean;
}

export const ElementSearch: React.FC<ElementSearchProps> = ({
  query,
  onQueryChange,
  onClear,
  matchCount,
  totalCount,
  isFilteringActive,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Press '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="element-search-wrapper" role="search">
      <div className="search-input-container">
        <span className="search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search by name, symbol or atomic number..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search elements by name, symbol, or atomic number"
          autoComplete="off"
          spellCheck="false"
        />

        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            aria-label="Clear search input"
            title="Clear search"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}

        <div className="search-shortcut" title="Press / to search" aria-hidden="true">
          <span>/</span>
        </div>
      </div>

      {isFilteringActive && (
        <div className="search-matches-badge" aria-live="polite">
          <span className="match-num">{matchCount}</span> / {totalCount}
        </div>
      )}
    </div>
  );
};
