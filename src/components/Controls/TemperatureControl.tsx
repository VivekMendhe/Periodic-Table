import React, { useMemo } from 'react';
import type { ElementData } from '../../types/element';
import { getElementStateAtTemp } from '../../data/elementExtensions';
import './TemperatureControl.css';

interface TemperatureControlProps {
  temperatureK: number;
  onTemperatureChange: (tempK: number) => void;
  unit: 'K' | 'C';
  onToggleUnit: () => void;
  elements: ElementData[];
}

const PRESETS = [
  { label: '0 K', name: 'Absolute Zero', kelvin: 0 },
  { label: '273 K', name: 'Ice (0°C)', kelvin: 273.15 },
  { label: '293 K', name: 'Room (20°C)', kelvin: 293.15 },
  { label: '373 K', name: 'Boiling (100°C)', kelvin: 373.15 },
  { label: '1811 K', name: 'Iron Melts', kelvin: 1811 },
  { label: '5778 K', name: 'Sun Surface', kelvin: 5778 },
];

export const TemperatureControl: React.FC<TemperatureControlProps> = ({
  temperatureK,
  onTemperatureChange,
  unit,
  onToggleUnit,
  elements,
}) => {
  // Convert temperature to display string based on active unit
  const displayTemp = useMemo(() => {
    if (unit === 'C') {
      const celsius = (temperatureK - 273.15).toFixed(1);
      return `${celsius} °C`;
    }
    return `${Math.round(temperatureK)} K`;
  }, [temperatureK, unit]);

  const secondaryTemp = useMemo(() => {
    if (unit === 'C') {
      return `${Math.round(temperatureK)} K`;
    }
    const celsius = (temperatureK - 273.15).toFixed(1);
    return `${celsius} °C`;
  }, [temperatureK, unit]);

  // Compute live phase counts across all 118 elements at current temperature
  const phaseCounts = useMemo(() => {
    let solids = 0;
    let liquids = 0;
    let gases = 0;
    let unknowns = 0;

    elements.forEach((el) => {
      const state = getElementStateAtTemp(el, temperatureK);
      if (state === 'Solid') solids++;
      else if (state === 'Liquid') liquids++;
      else if (state === 'Gas') gases++;
      else unknowns++;
    });

    return { solids, liquids, gases, unknowns };
  }, [elements, temperatureK]);

  return (
    <div className="temperature-control-card">
      <div className="temp-header-row">
        <div className="temp-title-group">
          <span className="temp-icon">🌡️</span>
          <span className="temp-title">Temperature Simulator</span>
        </div>

        <div className="temp-value-badge-group">
          <span className="temp-primary-value">{displayTemp}</span>
          <span className="temp-secondary-value">({secondaryTemp})</span>
          <button
            type="button"
            className="temp-unit-toggle-btn"
            onClick={onToggleUnit}
            title="Toggle between Kelvin and Celsius"
          >
            Switch to {unit === 'K' ? '°C' : 'K'}
          </button>
        </div>
      </div>

      {/* Range Slider */}
      <div className="temp-slider-wrapper">
        <input
          type="range"
          min={0}
          max={6000}
          step={5}
          value={temperatureK}
          onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
          className="temp-slider"
          aria-label="Temperature in Kelvin"
        />
        <div className="temp-slider-ticks">
          <span>0 K</span>
          <span>1000 K</span>
          <span>2000 K</span>
          <span>3000 K</span>
          <span>4000 K</span>
          <span>5000 K</span>
          <span>6000 K</span>
        </div>
      </div>

      {/* Preset Chips & Live Phase Counts */}
      <div className="temp-bottom-row">
        <div className="temp-presets-list">
          {PRESETS.map((p) => {
            const isActive = Math.abs(temperatureK - p.kelvin) < 2;
            return (
              <button
                key={p.label}
                type="button"
                className={`temp-preset-chip ${isActive ? 'is-active' : ''}`}
                onClick={() => onTemperatureChange(p.kelvin)}
                title={`${p.name} (${p.label})`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        <div className="temp-phase-summary">
          <span className="phase-count-tag phase-solid">
            <span className="phase-dot dot-solid" /> Solid: <strong>{phaseCounts.solids}</strong>
          </span>
          <span className="phase-count-tag phase-liquid">
            <span className="phase-dot dot-liquid" /> Liquid: <strong>{phaseCounts.liquids}</strong>
          </span>
          <span className="phase-count-tag phase-gas">
            <span className="phase-dot dot-gas" /> Gas: <strong>{phaseCounts.gases}</strong>
          </span>
          {phaseCounts.unknowns > 0 && (
            <span className="phase-count-tag phase-unknown">
              <span className="phase-dot dot-unknown" /> Unknown: <strong>{phaseCounts.unknowns}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
