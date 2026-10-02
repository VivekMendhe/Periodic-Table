import React from 'react';
import type { ElementCategory } from '../../types/element';
import { CATEGORY_LIST } from '../../data/categories';
import './StatsBar.css';

interface StatsBarProps {
  totalElements?: number;
  totalPeriods?: number;
  totalGroups?: number;
  totalCategories?: number;
  selectedCategory: ElementCategory | 'all';
  onSelectCategory: (cat: ElementCategory | 'all') => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalElements = 118,
  totalPeriods = 7,
  totalGroups = 18,
  totalCategories = 10,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="stats-bar-container" aria-label="Periodic Table Statistics and Category Filter">
      <div className="stats-cards-row">
        {/* Stat 1: Elements */}
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-elements" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 3h15" />
              <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
              <path d="M6 14h12" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalElements}</span>
            <span className="stat-label">Elements</span>
          </div>
        </div>

        {/* Stat 2: Periods */}
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-periods" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalPeriods}</span>
            <span className="stat-label">Periods</span>
          </div>
        </div>

        {/* Stat 3: Groups */}
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-groups" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalGroups}</span>
            <span className="stat-label">Groups</span>
          </div>
        </div>

        {/* Stat 4: Categories */}
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-categories" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalCategories}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </div>

      <div className="category-filter-select-wrapper">
        <label htmlFor="category-select" className="category-filter-label">
          Filter by category:
        </label>
        <div className="select-container">
          <select
            id="category-select"
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value as ElementCategory | 'all')}
          >
            <option value="all">All Categories</option>
            {CATEGORY_LIST.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <span className="select-chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
};
