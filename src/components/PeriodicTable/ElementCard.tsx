import React from 'react';
import type { ElementData } from '../../types/element';
import { CATEGORIES } from '../../data/categories';
import './ElementCard.css';

interface ElementCardProps {
  element: ElementData;
  isDimmed: boolean;
  isSelected: boolean;
  onClick: (element: ElementData) => void;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark';
}

export const ElementCard: React.FC<ElementCardProps> = ({
  element,
  isDimmed,
  isSelected,
  onClick,
  style,
  theme = 'light',
}) => {
  const categoryConfig = CATEGORIES[element.category] || CATEGORIES['unknown'];
  const colors = theme === 'dark' ? categoryConfig.colorDark : categoryConfig.colorLight;

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
      aria-label={`${element.name}, symbol ${element.symbol}, atomic number ${element.atomicNumber}, atomic mass ${element.atomicMass}, category ${categoryConfig.name}`}
      aria-selected={isSelected}
    >
      <span className="element-atomic-number">{element.atomicNumber}</span>
      <span className="element-symbol">{element.symbol}</span>
      <span className="element-name" title={element.name}>{element.name}</span>
      <span className="element-atomic-mass">{element.atomicMass}</span>
    </button>
  );
};
