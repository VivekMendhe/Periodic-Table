import React from 'react';
import type { ElementData, ElementCategory } from '../../types/element';
import { ElementGrid } from './ElementGrid';
import './PeriodicTable.css';

interface PeriodicTableProps {
  elements: ElementData[];
  activeElementIds: Set<number>;
  isFilteringActive: boolean;
  selectedElement: ElementData | null;
  onSelectElement: (element: ElementData) => void;
  onSelectCategory: (category: ElementCategory | 'all') => void;
  theme?: 'light' | 'dark';
}

export const PeriodicTable: React.FC<PeriodicTableProps> = (props) => {
  return (
    <section className="periodic-table-wrapper" aria-label="Interactive Periodic Table of Elements">
      <div className="mobile-scroll-hint" aria-hidden="true">
        <span>⇄ Scroll horizontally to explore all 18 groups</span>
      </div>

      <ElementGrid {...props} />
    </section>
  );
};
