import React from 'react';
import type { ElementCategory } from '../../types/element';
import { CATEGORY_LIST } from '../../data/categories';
import './CategoryLegend.css';

interface CategoryLegendProps {
  selectedCategory: ElementCategory | 'all';
  onSelectCategory: (category: ElementCategory | 'all') => void;
  onResetFilters: () => void;
  isFilteringActive: boolean;
  theme?: 'light' | 'dark';
}

export const CategoryLegend: React.FC<CategoryLegendProps> = ({
  selectedCategory,
  onSelectCategory,
  onResetFilters,
  isFilteringActive,
  theme = 'light',
}) => {
  return (
    <section className="category-legend-section" aria-label="Element Category Legend and Filter">
      <div className="legend-header">
        <h2 className="legend-title">Category Legend</h2>
        {isFilteringActive && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={onResetFilters}
            aria-label="Reset active filters and search"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="legend-pills-grid" role="group" aria-label="Filter elements by category">
        {CATEGORY_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const colors = theme === 'dark' ? cat.colorDark : cat.colorLight;

          return (
            <button
              key={cat.id}
              type="button"
              className={`legend-pill ${isSelected ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              style={{
                '--pill-swatch-bg': colors.bg,
                '--pill-swatch-border': colors.border,
                '--pill-swatch-accent': colors.accent,
              } as React.CSSProperties}
              aria-pressed={isSelected}
              title={`Filter by ${cat.name}`}
            >
              <span className="legend-swatch" aria-hidden="true" />
              <span className="legend-name">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
