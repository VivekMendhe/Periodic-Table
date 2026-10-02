import React from 'react';
import type { ColorMode } from '../../types/element';
import { ColorModeSelector } from './ColorModeSelector';
import './PeriodicTableControls.css';

interface PeriodicTableControlsProps {
  colorMode: ColorMode;
  onSelectColorMode: (mode: ColorMode) => void;
  isTempOpen: boolean;
  onToggleTemp: () => void;
  onOpenCompare: () => void;
}

export const PeriodicTableControls: React.FC<PeriodicTableControlsProps> = ({
  colorMode,
  onSelectColorMode,
  isTempOpen,
  onToggleTemp,
  onOpenCompare,
}) => {
  return (
    <div className="pt-controls-container">
      <div className="pt-controls-left">
        <ColorModeSelector
          colorMode={colorMode}
          onSelectColorMode={onSelectColorMode}
        />
      </div>

      <div className="pt-controls-right">
        <button
          type="button"
          className={`control-action-btn ${isTempOpen ? 'is-active' : ''}`}
          onClick={onToggleTemp}
          title="Toggle Temperature Simulator"
          aria-expanded={isTempOpen}
        >
          <span className="btn-icon">🌡️</span>
          <span>Temperature Simulator</span>
          <span className="expand-indicator">{isTempOpen ? '▲' : '▼'}</span>
        </button>

        <button
          type="button"
          className="control-action-btn compare-btn"
          onClick={onOpenCompare}
          title="Compare any two elements side-by-side"
        >
          <span className="btn-icon">⚖️</span>
          <span>Compare Elements</span>
        </button>
      </div>
    </div>
  );
};
