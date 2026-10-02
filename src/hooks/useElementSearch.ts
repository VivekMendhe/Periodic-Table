import { useState, useMemo } from 'react';
import type { ElementData, ElementCategory } from '../types/element';

interface UseElementSearchProps {
  elements: ElementData[];
}

export function useElementSearch({ elements }: UseElementSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | 'all'>('all');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredElements = useMemo(() => {
    return elements.filter((element) => {
      // Category check
      const matchesCategory =
        selectedCategory === 'all' || element.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      // Query check
      if (!normalizedQuery) {
        return true;
      }

      const matchesName = element.name.toLowerCase().includes(normalizedQuery);
      const matchesSymbol = element.symbol.toLowerCase() === normalizedQuery ||
        element.symbol.toLowerCase().startsWith(normalizedQuery);
      const matchesAtomicNumber = element.atomicNumber.toString() === normalizedQuery ||
        element.atomicNumber.toString().startsWith(normalizedQuery);

      return matchesName || matchesSymbol || matchesAtomicNumber;
    });
  }, [elements, normalizedQuery, selectedCategory]);

  const activeElementIds = useMemo(() => {
    return new Set(filteredElements.map((el) => el.atomicNumber));
  }, [filteredElements]);

  const isFilteringActive = normalizedQuery.length > 0 || selectedCategory !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return {
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
  };
}
