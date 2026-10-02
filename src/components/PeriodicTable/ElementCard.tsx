import React from 'react';
import type { ElementData, ColorMode } from '../../types/element';
import { CATEGORIES } from '../../data/categories';
import {
  BLOCK_COLORS,
  PHASE_COLORS,
  getElementStateAtTemp,
  getElectronegativityColor,
} from '../../data/elementExtensions';
import './ElementCard.css';

interface ElementCardProps {
  element: ElementData;
  isDimmed: boolean;
  isSelected: boolean;
  onClick: (element: ElementData) => void;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark';
  colorMode?: ColorMode;
  currentTempK?: number;
}

export const ElementCard: React.FC<ElementCardProps> = React.memo(
  ({
    element,
    isDimmed,
    isSelected,
    onClick,
    style,
    theme = 'light',
    colorMode = 'category',
    currentTempK = 293.15,
  }) => {
    // Determine colors based on active colorMode
    let colors: {
      bg: string;
      border: string;
      text: string;
      accent: string;
    };
    let badgeText = '';

    const currentState = getElementStateAtTemp(element, currentTempK);

    switch (colorMode) {
      case 'block': {
        const blockConfig = BLOCK_COLORS[element.block] || BLOCK_COLORS.s;
        colors = theme === 'dark' ? blockConfig.dark : blockConfig.light;
        badgeText = `${element.block}`;
        break;
      }
      case 'phase': {
        const phaseConfig = PHASE_COLORS[currentState] || PHASE_COLORS.Solid;
        colors = theme === 'dark' ? phaseConfig.dark : phaseConfig.light;
        badgeText = currentState === 'Solid' ? 'S' : currentState === 'Liquid' ? 'L' : currentState === 'Gas' ? 'G' : '?';
        break;
      }
      case 'electronegativity': {
        colors = getElectronegativityColor(element.electronegativity, theme);
        badgeText = element.electronegativity !== 'Not available' ? element.electronegativity : '-';
        break;
      }
      case 'category':
      default: {
        const categoryConfig = CATEGORIES[element.category] || CATEGORIES['unknown'];
        colors = theme === 'dark' ? categoryConfig.colorDark : categoryConfig.colorLight;
        break;
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(element);
      }
    };

    return (
      <button
        type="button"
        className={`element-card ${isDimmed ? 'is-dimmed' : ''} ${isSelected ? 'is-selected' : ''}`}
        onClick={() => onClick(element)}
        onKeyDown={handleKeyDown}
        style={{
          ...style,
          '--element-bg': colors.bg,
          '--element-border': colors.border,
          '--element-text': colors.text,
          '--element-accent': colors.accent,
        } as React.CSSProperties}
        aria-label={`${element.name}, symbol ${element.symbol}, atomic number ${element.atomicNumber}, mass ${element.atomicMass}, state ${currentState}`}
        aria-selected={isSelected}
      >
        <div className="element-card-top-row">
          <span className="element-atomic-number">{element.atomicNumber}</span>
          {badgeText && <span className="element-mode-badge">{badgeText}</span>}
        </div>
        <span className="element-symbol">{element.symbol}</span>
        <span className="element-name" title={element.name}>{element.name}</span>
        <span className="element-atomic-mass">
          {colorMode === 'electronegativity' && element.electronegativity !== 'Not available'
            ? `EN: ${element.electronegativity}`
            : element.atomicMass}
        </span>
      </button>
    );
  },
  (prev, next) => {
    return (
      prev.isDimmed === next.isDimmed &&
      prev.isSelected === next.isSelected &&
      prev.theme === next.theme &&
      prev.colorMode === next.colorMode &&
      prev.currentTempK === next.currentTempK &&
      prev.element.atomicNumber === next.element.atomicNumber
    );
  }
);
