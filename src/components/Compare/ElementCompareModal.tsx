import React, { useState, useEffect } from 'react';
import type { ElementData } from '../../types/element';
import { CATEGORIES } from '../../data/categories';
import { CustomElementSelect } from './CustomElementSelect';
import './ElementCompareModal.css';

interface ElementCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: ElementData[];
  initialElementA?: ElementData | null;
  initialElementB?: ElementData | null;
  theme?: 'light' | 'dark';
  onOpenReactionLab?: (elemA: ElementData, elemB: ElementData) => void;
}

export const ElementCompareModal: React.FC<ElementCompareModalProps> = ({
  isOpen,
  onClose,
  elements,
  initialElementA,
  initialElementB,
  theme = 'light',
  onOpenReactionLab,
}) => {
  const [userSelectedA, setUserSelectedA] = useState<number | null>(null);
  const [userSelectedB, setUserSelectedB] = useState<number | null>(null);
  const [prevInitA, setPrevInitA] = useState<number | undefined>(initialElementA?.atomicNumber);
  const [prevInitB, setPrevInitB] = useState<number | undefined>(initialElementB?.atomicNumber);

  if (initialElementA?.atomicNumber !== prevInitA) {
    setPrevInitA(initialElementA?.atomicNumber);
    setUserSelectedA(null);
  }
  if (initialElementB?.atomicNumber !== prevInitB) {
    setPrevInitB(initialElementB?.atomicNumber);
    setUserSelectedB(null);
  }

  const elementAId = userSelectedA ?? initialElementA?.atomicNumber ?? 1;
  const elementBId = userSelectedB ?? initialElementB?.atomicNumber ?? (elementAId === 2 ? 1 : 2);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const elementA = elements.find((el) => el.atomicNumber === elementAId) || elements[0];
  const elementB = elements.find((el) => el.atomicNumber === elementBId) || elements[1];

  const catA = CATEGORIES[elementA.category] || CATEGORIES['unknown'];
  const catB = CATEGORIES[elementB.category] || CATEGORIES['unknown'];

  const colorsA = theme === 'dark' ? catA.colorDark : catA.colorLight;
  const colorsB = theme === 'dark' ? catB.colorDark : catB.colorLight;

  const enA = parseFloat(elementA.electronegativity);
  const enB = parseFloat(elementB.electronegativity);


  return (
    <div
      className="compare-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div className="compare-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="compare-modal-title">
        {/* Header */}
        <div className="compare-modal-header">
          <div className="compare-title-group">
            <span className="compare-icon">⚖️</span>
            <h2 id="compare-modal-title" className="compare-modal-title">
              Side-by-Side Element Comparison
            </h2>
          </div>

          <button
            type="button"
            className="compare-close-btn"
            onClick={onClose}
            aria-label="Close comparison modal"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Element Selection Row */}
        <div className="compare-selectors-row">
          <div className="selector-col">
            <span className="selector-label">
              Element 1:
            </span>
            <CustomElementSelect
              id="elem-a-select"
              selectedElementId={elementAId}
              onSelect={setUserSelectedA}
              elements={elements}
              theme={theme}
            />
          </div>

          <div className="vs-badge">VS</div>

          <div className="selector-col">
            <span className="selector-label">
              Element 2:
            </span>
            <CustomElementSelect
              id="elem-b-select"
              selectedElementId={elementBId}
              onSelect={setUserSelectedB}
              elements={elements}
              theme={theme}
            />
          </div>
        </div>

        {/* Comparative Preview Cards */}
        <div className="compare-preview-grid">
          <div
            className="compare-elem-hero"
            style={{
              '--elem-bg': colorsA.bg,
              '--elem-border': colorsA.border,
              '--elem-text': colorsA.text,
              '--elem-accent': colorsA.accent,
            } as React.CSSProperties}
          >
            <span className="hero-atom-num">{elementA.atomicNumber}</span>
            <span className="hero-sym">{elementA.symbol}</span>
            <span className="hero-name">{elementA.name}</span>
            <span className="hero-category-chip">{catA.name}</span>
          </div>

          <div
            className="compare-elem-hero"
            style={{
              '--elem-bg': colorsB.bg,
              '--elem-border': colorsB.border,
              '--elem-text': colorsB.text,
              '--elem-accent': colorsB.accent,
            } as React.CSSProperties}
          >
            <span className="hero-atom-num">{elementB.atomicNumber}</span>
            <span className="hero-sym">{elementB.symbol}</span>
            <span className="hero-name">{elementB.name}</span>
            <span className="hero-category-chip">{catB.name}</span>
          </div>
        </div>

        {/* Comparison Metrics Table */}
        <div className="compare-table-container">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="prop-name-col">Property</th>
                <th className="elem-val-col">{elementA.symbol} ({elementA.name})</th>
                <th className="elem-val-col">{elementB.symbol} ({elementB.name})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="prop-name">Atomic Mass</td>
                <td className="elem-val mono">{elementA.atomicMass} u</td>
                <td className="elem-val mono">{elementB.atomicMass} u</td>
              </tr>
              <tr>
                <td className="prop-name">Period / Group / Block</td>
                <td className="elem-val">
                  P{elementA.period}, G{elementA.group ?? 'f'}, {elementA.block}-block
                </td>
                <td className="elem-val">
                  P{elementB.period}, G{elementB.group ?? 'f'}, {elementB.block}-block
                </td>
              </tr>
              <tr>
                <td className="prop-name">Standard Phase</td>
                <td className="elem-val">
                  <span className={`phase-badge phase-${elementA.phaseAtRoomTemperature.toLowerCase()}`}>
                    {elementA.phaseAtRoomTemperature}
                  </span>
                </td>
                <td className="elem-val">
                  <span className={`phase-badge phase-${elementB.phaseAtRoomTemperature.toLowerCase()}`}>
                    {elementB.phaseAtRoomTemperature}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="prop-name">Electron Configuration</td>
                <td className="elem-val mono">{elementA.electronConfiguration}</td>
                <td className="elem-val mono">{elementB.electronConfiguration}</td>
              </tr>
              <tr>
                <td className="prop-name">Electronegativity</td>
                <td className="elem-val">
                  <div className="compare-meter-wrapper">
                    <span>{elementA.electronegativity}</span>
                    {!isNaN(enA) && (
                      <div className="compare-bar-track">
                        <div className="compare-bar-fill" style={{ width: `${(enA / 4.0) * 100}%` }} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="elem-val">
                  <div className="compare-meter-wrapper">
                    <span>{elementB.electronegativity}</span>
                    {!isNaN(enB) && (
                      <div className="compare-bar-track">
                        <div className="compare-bar-fill" style={{ width: `${(enB / 4.0) * 100}%` }} />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="prop-name">Melting Point</td>
                <td className="elem-val">{elementA.meltingPoint}</td>
                <td className="elem-val">{elementB.meltingPoint}</td>
              </tr>
              <tr>
                <td className="prop-name">Boiling Point</td>
                <td className="elem-val">{elementA.boilingPoint}</td>
                <td className="elem-val">{elementB.boilingPoint}</td>
              </tr>
              <tr>
                <td className="prop-name">Density</td>
                <td className="elem-val">{elementA.density}</td>
                <td className="elem-val">{elementB.density}</td>
              </tr>
              <tr>
                <td className="prop-name">Oxidation States</td>
                <td className="elem-val">{elementA.oxidationStates.join(', ')}</td>
                <td className="elem-val">{elementB.oxidationStates.join(', ')}</td>
              </tr>
              <tr>
                <td className="prop-name">Discovered By</td>
                <td className="elem-val">{elementA.discoveredBy} ({elementA.discoveryYear})</td>
                <td className="elem-val">{elementB.discoveredBy} ({elementB.discoveryYear})</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="compare-modal-footer">
          {onOpenReactionLab && (
            <button
              type="button"
              className="compare-test-reaction-btn"
              onClick={() => onOpenReactionLab(elementA, elementB)}
              title={`Simulate chemical reaction between ${elementA.name} and ${elementB.name}`}
            >
              <span>⚗️ Test Reaction in Lab</span>
            </button>
          )}
          <button type="button" className="compare-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
