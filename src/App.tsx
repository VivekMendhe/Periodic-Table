import { useState, useEffect, useCallback } from 'react';
import type { ElementData, ColorMode, ElementCategory } from './types/element';
import { ELEMENTS, validateElements } from './data/elements';
import { useElementSearch } from './hooks/useElementSearch';
import { Header } from './components/Header/Header';
import { ElementSearch } from './components/Search/ElementSearch';
import { StatsBar } from './components/Stats/StatsBar';
import { PeriodicTable } from './components/PeriodicTable/PeriodicTable';
import { CategoryLegend } from './components/PeriodicTable/CategoryLegend';
import { KeyFeatures } from './components/Features/KeyFeatures';
import { ElementModal } from './components/ElementDetails/ElementModal';
import { PeriodicTableControls } from './components/Controls/PeriodicTableControls';
import { TemperatureControl } from './components/Controls/TemperatureControl';
import { ElementCompareModal } from './components/Compare/ElementCompareModal';
import { ReactionLabModal } from './components/ReactionLab/ReactionLabModal';
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

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

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

  // Interactive controls states
  const [colorMode, setColorMode] = useState<ColorMode>('category');
  const [temperatureK, setTemperatureK] = useState<number>(293.15); // 20 °C room temp
  const [tempUnit, setTempUnit] = useState<'K' | 'C'>('K');
  const [isTempOpen, setIsTempOpen] = useState<boolean>(false);

  // Compare modal states
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareElemA, setCompareElemA] = useState<ElementData | null>(null);
  const [compareElemB, setCompareElemB] = useState<ElementData | null>(null);

  // Reaction Lab modal states
  const [isReactionLabOpen, setIsReactionLabOpen] = useState<boolean>(false);
  const [reactionLabElemA, setReactionLabElemA] = useState<ElementData | null>(null);
  const [reactionLabElemB, setReactionLabElemB] = useState<ElementData | null>(null);

  // Stable event handlers for performance
  const handleSelectElement = useCallback((element: ElementData) => {
    setSelectedElement(element);
  }, [setSelectedElement]);

  const handleCloseModal = useCallback(() => {
    setSelectedElement(null);
  }, [setSelectedElement]);

  const handleSelectCategory = useCallback((cat: ElementCategory | 'all') => {
    setSelectedCategory(cat);
  }, [setSelectedCategory]);

  const handleSelectColorMode = useCallback((mode: ColorMode) => {
    setColorMode(mode);
    if (mode === 'phase') {
      setIsTempOpen(true);
    }
  }, []);

  const handleToggleTemp = useCallback(() => {
    setIsTempOpen((prev) => !prev);
  }, []);

  const handleToggleTempUnit = useCallback(() => {
    setTempUnit((prev) => (prev === 'K' ? 'C' : 'K'));
  }, []);

  const handleOpenCompareGlobal = useCallback(() => {
    setCompareElemA(null);
    setCompareElemB(null);
    setIsCompareOpen(true);
  }, []);

  const handleOpenCompareFromModal = useCallback((elem: ElementData) => {
    setSelectedElement(null);
    setCompareElemA(elem);
    // Suggest next element or noble gas
    const nextElem = ELEMENTS.find((e) => e.atomicNumber === (elem.atomicNumber === 118 ? 1 : elem.atomicNumber + 1)) || null;
    setCompareElemB(nextElem);
    setIsCompareOpen(true);
  }, [setSelectedElement]);

  const handleCloseCompare = useCallback(() => {
    setIsCompareOpen(false);
  }, []);

  const handleOpenReactionLabGlobal = useCallback(() => {
    setReactionLabElemA(null);
    setReactionLabElemB(null);
    setIsReactionLabOpen(true);
  }, []);

  const handleOpenReactionLabFromCompare = useCallback((elemA: ElementData, elemB: ElementData) => {
    setIsCompareOpen(false);
    setReactionLabElemA(elemA);
    setReactionLabElemB(elemB);
    setIsReactionLabOpen(true);
  }, []);

  const handleCloseReactionLab = useCallback(() => {
    setIsReactionLabOpen(false);
  }, []);

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
            onSelectCategory={handleSelectCategory}
          />

          {/* Interactive Controls: Color Mode, Temperature Toggle, Compare Elements, Reaction Lab */}
          <PeriodicTableControls
            colorMode={colorMode}
            onSelectColorMode={handleSelectColorMode}
            isTempOpen={isTempOpen}
            onToggleTemp={handleToggleTemp}
            onOpenCompare={handleOpenCompareGlobal}
            onOpenReactionLab={handleOpenReactionLabGlobal}
          />

          {/* Collapsible Temperature Simulator */}
          {isTempOpen && (
            <TemperatureControl
              temperatureK={temperatureK}
              onTemperatureChange={setTemperatureK}
              unit={tempUnit}
              onToggleUnit={handleToggleTempUnit}
              elements={ELEMENTS}
            />
          )}

          {/* Periodic Table View */}
          <PeriodicTable
            elements={ELEMENTS}
            activeElementIds={activeElementIds}
            isFilteringActive={isFilteringActive}
            selectedElement={selectedElement}
            onSelectElement={handleSelectElement}
            onSelectCategory={handleSelectCategory}
            theme={theme}
            colorMode={colorMode}
            currentTempK={temperatureK}
          />

          {/* Bottom Row: Category Legend & Key Features */}
          <div className="app-bottom-grid">
            <div className="bottom-left-col">
              <CategoryLegend
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
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
              <strong>Periodic Table of Elements</strong> • Interactive Chemical Explorer • Scientifically accurate data based on IUPAC & NIST standards.
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
        onClose={handleCloseModal}
        theme={theme}
        onOpenCompare={handleOpenCompareFromModal}
      />

      {/* Side-by-Side Compare Modal */}
      <ElementCompareModal
        isOpen={isCompareOpen}
        onClose={handleCloseCompare}
        elements={ELEMENTS}
        initialElementA={compareElemA}
        initialElementB={compareElemB}
        theme={theme}
        onOpenReactionLab={handleOpenReactionLabFromCompare}
      />

      {/* Chemical Reaction & Bonding Lab Modal */}
      <ReactionLabModal
        isOpen={isReactionLabOpen}
        onClose={handleCloseReactionLab}
        elements={ELEMENTS}
        initialElementA={reactionLabElemA}
        initialElementB={reactionLabElemB}
        theme={theme}
      />
    </div>
  );
}

export default App;
