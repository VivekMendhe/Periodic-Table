import React from 'react';
import type { ColorMode } from '../../types/element';
import './ColorModeSelector.css';

interface ColorModeSelectorProps {
  colorMode: ColorMode;
  onSelectColorMode: (mode: ColorMode) => void;
}

const MODES: { id: ColorMode; label: string; icon: string; description: string }[] = [
  { id: 'category', label: 'Category', icon: '🎨', description: 'Standard 10 chemical families' },
  { id: 'block', label: 'Block', icon: '🧱', description: 'Orbital blocks (s, p, d, f)' },
  { id: 'phase', label: 'Phase', icon: '💧', description: 'State of matter at temperature' },
  { id: 'electronegativity', label: 'Electronegativity', icon: '⚡', description: 'Pauling scale heatmap gradient' },
];

export const ColorModeSelector: React.FC<ColorModeSelectorProps> = ({
  colorMode,
  onSelectColorMode,
}) => {
  return (
    <div className="color-mode-selector-wrapper" role="group" aria-label="Color visualization mode">
      <span className="color-mode-label">Color by:</span>
      <div className="color-mode-btn-group">
        {MODES.map((mode) => {
          const isActive = colorMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              className={`color-mode-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectColorMode(mode.id)}
              title={mode.description}
              aria-pressed={isActive}
            >
              <span className="mode-btn-icon" aria-hidden="true">{mode.icon}</span>
              <span className="mode-btn-label">{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
