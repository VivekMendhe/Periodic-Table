import { useState, useEffect } from 'react';
import { ELEMENTS, validateElements } from './data/elements';
import { useElementSearch } from './hooks/useElementSearch';
import { Header } from './components/Header/Header';
import { ElementSearch } from './components/Search/ElementSearch';
import { StatsBar } from './components/Stats/StatsBar';
import { PeriodicTable } from './components/PeriodicTable/PeriodicTable';
import { CategoryLegend } from './components/PeriodicTable/CategoryLegend';
import { KeyFeatures } from './components/Features/KeyFeatures';
import { ElementModal } from './components/ElementDetails/ElementModal';
import './App.css';

// Run development validation once
if (import.meta.env.DEV) {
  const validation = validateElements(ELEMENTS);
  if (!validation.isValid) {
    console.error('Periodic Table Dataset Validation Errors:', validation.errors);
  } else {
    console.log('Periodic Table Dataset: 118 elements successfully verified.');
  }
}

export function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('pt-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pt-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Search and filter state hook
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedElement,
    setSelectedElement,
    filteredElements,
    activeElementIds,
    isFilteringActive,
    resetFilters,
  } = useElementSearch({ elements: ELEMENTS });

  return (
    <div className="app-layout">
      <div className="app-container">
        {/* Top Header */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          searchSlot={
            <ElementSearch
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              matchCount={filteredElements.length}
              totalCount={ELEMENTS.length}
              isFilteringActive={isFilteringActive}
            />
          }
        />

        <main className="app-main-content">
          {/* Stats Bar & Category Dropdown Filter */}
          <StatsBar
            totalElements={ELEMENTS.length}
            totalPeriods={7}
            totalGroups={18}
            totalCategories={10}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Periodic Table View */}
          <PeriodicTable
            elements={ELEMENTS}
            activeElementIds={activeElementIds}
            isFilteringActive={isFilteringActive}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onSelectCategory={setSelectedCategory}
            theme={theme}
          />

          {/* Bottom Row: Category Legend & Key Features */}
          <div className="app-bottom-grid">
            <div className="bottom-left-col">
              <CategoryLegend
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onResetFilters={resetFilters}
                isFilteringActive={isFilteringActive}
                theme={theme}
              />
            </div>
            <div className="bottom-right-col">
              <KeyFeatures />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p className="footer-credit">
              <strong>Periodic Table of Elements</strong> • Built with React, TypeScript & CSS Grid • Scientifically accurate data based on IUPAC & NIST standards.
            </p>
            <p className="footer-subtext">
              Designed for chemistry students, researchers, educators, and curious minds worldwide.
            </p>
          </div>
        </footer>
      </div>

      {/* Detail Modal */}
      <ElementModal
        element={selectedElement}
        onClose={() => setSelectedElement(null)}
        theme={theme}
      />
    </div>
  );
}

export default App;
