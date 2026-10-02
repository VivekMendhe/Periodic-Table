import React, { useMemo } from 'react';
import type { ElementData, ElementCategory } from '../../types/element';
import { ElementCard } from './ElementCard';
import './PeriodicTable.css';

interface ElementGridProps {
  elements: ElementData[];
  activeElementIds: Set<number>;
  isFilteringActive: boolean;
  selectedElement: ElementData | null;
  onSelectElement: (element: ElementData) => void;
  onSelectCategory: (category: ElementCategory | 'all') => void;
  theme?: 'light' | 'dark';
}

export const ElementGrid: React.FC<ElementGridProps> = ({
  elements,
  activeElementIds,
  isFilteringActive,
  selectedElement,
  onSelectElement,
  onSelectCategory,
  theme = 'light',
}) => {
  // Separate elements into main table (periods 1-7, excluding lanthanides & actinides)
  // and f-block (lanthanides 57-71, actinides 89-103)
  const { mainElements, lanthanides, actinides } = useMemo(() => {
    const main: ElementData[] = [];
    const lanth: ElementData[] = [];
    const act: ElementData[] = [];

    elements.forEach((el) => {
      if (el.atomicNumber >= 57 && el.atomicNumber <= 71) {
        lanth.push(el);
      } else if (el.atomicNumber >= 89 && el.atomicNumber <= 103) {
        act.push(el);
      } else {
        main.push(el);
      }
    });

    return {
      mainElements: main,
      lanthanides: lanth.sort((a, b) => a.atomicNumber - b.atomicNumber),
      actinides: act.sort((a, b) => a.atomicNumber - b.atomicNumber),
    };
  }, [elements]);

  return (
    <div className="periodic-table-scroll-container" tabIndex={0} aria-label="Periodic Table grid, scroll horizontally for all groups">
      <div className="periodic-table-grid" role="region" aria-label="118 Elements Periodic Table">
        {/* Top Header: Group Indicator Corner */}
        <div className="pt-corner-label" style={{ gridRow: 1, gridColumn: 1 }}>
          <span className="corner-group-text">Group →</span>
        </div>

        {/* Group Numbers 1 - 18 */}
        {Array.from({ length: 18 }, (_, i) => i + 1).map((groupNum) => (
          <div
            key={`group-${groupNum}`}
            className="pt-group-header"
            style={{ gridRow: 1, gridColumn: groupNum + 1 }}
          >
            {groupNum}
          </div>
        ))}

        {/* Period Numbers 1 - 7 */}
        {Array.from({ length: 7 }, (_, i) => i + 1).map((periodNum) => (
          <div
            key={`period-${periodNum}`}
            className="pt-period-header"
            style={{ gridRow: periodNum + 1, gridColumn: 1 }}
          >
            Period {periodNum}
          </div>
        ))}

        {/* Main Periodic Table Elements */}
        {mainElements.map((element) => {
          const row = element.period + 1;
          const col = (element.group || 1) + 1;
          const isDimmed = isFilteringActive && !activeElementIds.has(element.atomicNumber);
          const isSelected = selectedElement?.atomicNumber === element.atomicNumber;

          return (
            <div
              key={element.atomicNumber}
              className="pt-grid-cell"
              style={{ gridRow: row, gridColumn: col }}
            >
              <ElementCard
                element={element}
                isDimmed={isDimmed}
                isSelected={isSelected}
                onClick={onSelectElement}
                theme={theme}
              />
            </div>
          );
        })}

        {/* Placeholder for Lanthanides (Period 6, Group 3) */}
        <div
          className="pt-grid-cell"
          style={{ gridRow: 7, gridColumn: 4 }}
        >
          <button
            type="button"
            className="f-block-placeholder-tile lanthanide-tile"
            onClick={() => onSelectCategory('lanthanide')}
            title="Filter Lanthanides (57-71)"
            aria-label="Lanthanides 57 through 71 series"
          >
            <span className="placeholder-range">57–71</span>
            <span className="placeholder-name">La–Lu</span>
          </button>
        </div>

        {/* Placeholder for Actinides (Period 7, Group 3) */}
        <div
          className="pt-grid-cell"
          style={{ gridRow: 8, gridColumn: 4 }}
        >
          <button
            type="button"
            className="f-block-placeholder-tile actinide-tile"
            onClick={() => onSelectCategory('actinide')}
            title="Filter Actinides (89-103)"
            aria-label="Actinides 89 through 103 series"
          >
            <span className="placeholder-range">89–103</span>
            <span className="placeholder-name">Ac–Lr</span>
          </button>
        </div>

        {/* Spacer Row Between Main Table and F-Block */}
        <div className="pt-fblock-spacer" style={{ gridRow: 9, gridColumn: '1 / -1' }} />

        {/* Lanthanides Row (Row 10) */}
        <div
          className="fblock-series-label-cell"
          style={{ gridRow: 10, gridColumn: '1 / 4' }}
        >
          <div className="fblock-series-label">
            <span className="series-title">Lanthanides</span>
            <span className="series-numbers">57 – 71</span>
          </div>
        </div>

        {lanthanides.map((element, idx) => {
          const col = idx + 4; // Starts at group 3/column 4 to 18 (15 elements)
          const isDimmed = isFilteringActive && !activeElementIds.has(element.atomicNumber);
          const isSelected = selectedElement?.atomicNumber === element.atomicNumber;

          return (
            <div
              key={element.atomicNumber}
              className="pt-grid-cell"
              style={{ gridRow: 10, gridColumn: col }}
            >
              <ElementCard
                element={element}
                isDimmed={isDimmed}
                isSelected={isSelected}
                onClick={onSelectElement}
                theme={theme}
              />
            </div>
          );
        })}

        {/* Actinides Row (Row 11) */}
        <div
          className="fblock-series-label-cell"
          style={{ gridRow: 11, gridColumn: '1 / 4' }}
        >
          <div className="fblock-series-label">
            <span className="series-title">Actinides</span>
            <span className="series-numbers">89 – 103</span>
          </div>
        </div>

        {actinides.map((element, idx) => {
          const col = idx + 4; // Starts at group 3/column 4 to 18 (15 elements)
          const isDimmed = isFilteringActive && !activeElementIds.has(element.atomicNumber);
          const isSelected = selectedElement?.atomicNumber === element.atomicNumber;

          return (
            <div
              key={element.atomicNumber}
              className="pt-grid-cell"
              style={{ gridRow: 11, gridColumn: col }}
            >
              <ElementCard
                element={element}
                isDimmed={isDimmed}
                isSelected={isSelected}
                onClick={onSelectElement}
                theme={theme}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
