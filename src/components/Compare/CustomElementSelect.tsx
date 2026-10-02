import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { ElementData } from '../../types/element';
import { CATEGORIES, CATEGORY_LIST } from '../../data/categories';

interface CustomElementSelectProps {
  id: string;
  selectedElementId: number;
  onSelect: (atomicNumber: number) => void;
  elements: ElementData[];
  theme?: 'light' | 'dark';
}

export const CustomElementSelect: React.FC<CustomElementSelectProps> = ({
  id,
  selectedElementId,
  onSelect,
  elements,
  theme = 'light',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedElement = useMemo(
    () => elements.find((el) => el.atomicNumber === selectedElementId) || elements[0],
    [elements, selectedElementId]
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    }
  };

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CATEGORY_LIST.map((cat) => {
      const catElements = elements.filter(
        (el) =>
          el.category === cat.id &&
          (query === '' ||
            el.name.toLowerCase().includes(query) ||
            el.symbol.toLowerCase().includes(query) ||
            el.atomicNumber.toString() === query)
      );
      return {
        ...cat,
        elements: catElements,
      };
    }).filter((cat) => cat.elements.length > 0);
  }, [elements, search]);

  const selCat = CATEGORIES[selectedElement.category] || CATEGORIES['unknown'];
  const selColor = theme === 'dark' ? selCat.colorDark : selCat.colorLight;

  return (
    <div className="custom-element-select-container" ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        id={id}
        type="button"
        className={`custom-select-trigger ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="trigger-left">
          <span
            className="trigger-sym-pill"
            style={{
              backgroundColor: selColor.bg,
              borderColor: selColor.border,
              color: selColor.text,
            }}
          >
            {selectedElement.symbol}
          </span>
          <span className="trigger-num-badge">#{selectedElement.atomicNumber}</span>
          <span className="trigger-name">{selectedElement.name}</span>
        </div>
        <span className={`trigger-chevron ${isOpen ? 'open' : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="custom-select-dropdown-menu" role="listbox">
          {/* Search Bar */}
          <div className="custom-select-search-bar">
            <span className="search-bar-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              ref={searchInputRef}
              type="text"
              className="custom-select-search-input"
              placeholder="Search by name, symbol, #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="custom-select-search-clear"
                onClick={() => setSearch('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Scrollable Elements List with controlled max-height */}
          <div className="custom-select-options-list">
            {filteredCategories.length === 0 ? (
              <div className="custom-select-no-results">No elements found</div>
            ) : (
              filteredCategories.map((cat) => (
                <div key={cat.id} className="custom-select-optgroup">
                  <div className="custom-select-optgroup-header">
                    <span>{cat.name}</span>
                  </div>
                  {cat.elements.map((el) => {
                    const isSelected = el.atomicNumber === selectedElementId;
                    const catObj = CATEGORIES[el.category] || CATEGORIES['unknown'];
                    const colorObj = theme === 'dark' ? catObj.colorDark : catObj.colorLight;

                    return (
                      <button
                        key={el.atomicNumber}
                        type="button"
                        className={`custom-select-option ${isSelected ? 'is-selected' : ''}`}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onSelect(el.atomicNumber);
                          setIsOpen(false);
                          setSearch('');
                        }}
                      >
                        <span
                          className="opt-sym-badge"
                          style={{
                            backgroundColor: colorObj.bg,
                            borderColor: colorObj.border,
                            color: colorObj.text,
                          }}
                        >
                          {el.symbol}
                        </span>
                        <span className="opt-num">#{el.atomicNumber}</span>
                        <span className="opt-name">{el.name}</span>
                        {isSelected && <span className="opt-check">✓</span>}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
