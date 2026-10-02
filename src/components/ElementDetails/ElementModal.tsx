import React, { useEffect, useRef, useState } from 'react';
import type { ElementData } from '../../types/element';
import { CATEGORIES } from '../../data/categories';
import './ElementModal.css';

interface ElementModalProps {
  element: ElementData | null;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

// Calculate electron shell distribution for SVG Bohr model
function getElectronShells(atomicNumber: number): number[] {
  // Standard maximums per shell: 2, 8, 18, 32, 32, 18, 8
  const maxShells = [2, 8, 18, 32, 32, 18, 8];
  const shells: number[] = [];
  let remaining = atomicNumber;

  for (const max of maxShells) {
    if (remaining <= 0) break;
    const count = Math.min(remaining, max);
    shells.push(count);
    remaining -= count;
  }
  return shells;
}

export const ElementModal: React.FC<ElementModalProps> = ({
  element,
  onClose,
  theme = 'light',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'discovery' | 'more'>('overview');

  // Capture last focused element and restore on unmount
  useEffect(() => {
    if (element) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus close button initially
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      // Prevent document body scrolling while modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        previousFocusRef.current?.focus();
      };
    }
  }, [element]);

  // Handle Escape key and focus trap
  useEffect(() => {
    if (!element) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [element, onClose]);

  if (!element) return null;

  const categoryConfig = CATEGORIES[element.category] || CATEGORIES['unknown'];
  const colors = theme === 'dark' ? categoryConfig.colorDark : categoryConfig.colorLight;
  const shells = getElectronShells(element.atomicNumber);

  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(element.name)}`;

  return (
    <div
      className="element-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="element-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="element-modal-title"
        style={{
          '--modal-accent': colors.accent,
          '--modal-badge-bg': colors.bg,
          '--modal-badge-border': colors.border,
          '--modal-badge-text': colors.text,
        } as React.CSSProperties}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-area">
            <div className="modal-element-badge">
              <span className="badge-num">{element.atomicNumber}</span>
              <span className="badge-sym">{element.symbol}</span>
            </div>

            <div className="modal-heading-text">
              <div className="modal-name-row">
                <h2 id="element-modal-title" className="modal-element-name">
                  {element.name}
                </h2>
                <span className="modal-category-chip">
                  {categoryConfig.name}
                </span>
              </div>
              <span className="modal-atomic-mass-subtitle">
                Standard Atomic Weight: <strong>{element.atomicMass}</strong> u
              </span>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={`Close details for ${element.name}`}
            title="Close (Esc)"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <nav className="modal-tabs" aria-label="Element detail tabs">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'properties' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            Properties
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'discovery' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('discovery')}
          >
            Discovery
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'more' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('more')}
          >
            More Info
          </button>
        </nav>

        {/* Modal Body */}
        <div className="modal-body-scrollable">
          <div className="modal-grid-layout">
            {/* Left Column: Properties Data Grid */}
            <div className="modal-left-col">
              <div className="prop-section">
                <h3 className="section-title">Chemical & Physical Classification</h3>
                <dl className="property-list">
                  <div className="property-row">
                    <dt>Atomic Number</dt>
                    <dd>{element.atomicNumber}</dd>
                  </div>
                  <div className="property-row">
                    <dt>Atomic Mass</dt>
                    <dd>{element.atomicMass} u</dd>
                  </div>
                  <div className="property-row">
                    <dt>Category</dt>
                    <dd>{categoryConfig.name}</dd>
                  </div>
                  <div className="property-row">
                    <dt>Group</dt>
                    <dd>{element.group !== null ? element.group : 'f-block (None)'}</dd>
                  </div>
                  <div className="property-row">
                    <dt>Period</dt>
                    <dd>{element.period}</dd>
                  </div>
                  <div className="property-row">
                    <dt>Block</dt>
                    <dd>{element.block}-block</dd>
                  </div>
                </dl>
              </div>

              <div className="prop-section">
                <h3 className="section-title">Atomic & Quantum Properties</h3>
                <dl className="property-list">
                  <div className="property-row">
                    <dt>Electron Configuration</dt>
                    <dd className="mono-text">{element.electronConfiguration}</dd>
                  </div>
                  <div className="property-row">
                    <dt>Electronegativity</dt>
                    <dd>{element.electronegativity}</dd>
                  </div>
                  <div className="property-row">
                    <dt>Oxidation States</dt>
                    <dd>
                      <div className="ox-states-pills">
                        {element.oxidationStates.map((st) => (
                          <span key={st} className="ox-state-pill">{st}</span>
                        ))}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="prop-section">
                <h3 className="section-title">Thermodynamic & Physical State</h3>
                <dl className="property-list">
                  <div className="property-row">
                    <dt>Phase (Room Temp)</dt>
                    <dd>
                      <span className={`phase-badge phase-${element.phaseAtRoomTemperature.toLowerCase()}`}>
                        {element.phaseAtRoomTemperature}
                      </span>
                    </dd>
                  </div>
                  <div className="property-row">
                    <dt>Melting Point</dt>
                    <dd>{element.meltingPoint}</dd>
                  </div>
                  <div className="property-row">
                    <dt>Boiling Point</dt>
                    <dd>{element.boilingPoint}</dd>
                  </div>
                  <div className="property-row">
                    <dt>Density</dt>
                    <dd>{element.density}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right Column: Visualization, History & Description */}
            <div className="modal-right-col">
              {/* Bohr Shells Visualization */}
              <div className="orbital-diagram-card">
                <div className="orbital-card-header">
                  <span className="orbital-card-title">Bohr Orbital Shells Model</span>
                  <span className="shells-summary">
                    {shells.join(' · ')}
                  </span>
                </div>

                <div className="bohr-model-container" aria-hidden="true">
                  <svg viewBox="0 0 200 200" className="bohr-svg">
                    {/* Nucleus */}
                    <circle cx="100" cy="100" r="14" fill="var(--modal-accent)" opacity="0.9" />
                    <text x="100" y="104" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
                      {element.symbol}
                    </text>

                    {/* Concentric rings for each shell */}
                    {shells.map((count, idx) => {
                      const radius = 24 + idx * 10;
                      // Place electrons evenly on circle
                      const electronDots = Array.from({ length: Math.min(count, 16) }).map((_, eIdx) => {
                        const angle = (eIdx / Math.min(count, 16)) * 2 * Math.PI;
                        const cx = 100 + radius * Math.cos(angle);
                        const cy = 100 + radius * Math.sin(angle);
                        return (
                          <circle
                            key={eIdx}
                            cx={cx}
                            cy={cy}
                            r="2.2"
                            fill="var(--modal-accent)"
                          />
                        );
                      });

                      return (
                        <g key={idx}>
                          <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke="var(--border-color)"
                            strokeWidth="1.2"
                            strokeDasharray={idx % 2 === 1 ? '3 2' : 'none'}
                          />
                          {electronDots}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Description Card */}
              <div className="description-card">
                <h4 className="card-subtitle">Description</h4>
                <p className="element-description-text">{element.description}</p>
              </div>

              {/* Discovery Card */}
              <div className="discovery-card">
                <h4 className="card-subtitle">Historical Discovery</h4>
                <div className="discovery-details">
                  <div className="disc-item">
                    <span className="disc-label">Discovered By</span>
                    <span className="disc-value">{element.discoveredBy}</span>
                  </div>
                  <div className="disc-item">
                    <span className="disc-label">Discovery Year</span>
                    <span className="disc-value">{element.discoveryYear}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <a
            href={wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="wiki-link-btn"
          >
            <span>View on Wikipedia</span>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          <button
            type="button"
            className="modal-action-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
