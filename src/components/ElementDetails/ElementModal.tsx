import React, { useEffect, useRef, useState } from 'react';
import type { ElementData } from '../../types/element';
import { CATEGORIES } from '../../data/categories';
import {
  ELEMENT_SHELLS,
  ELEMENT_APPLICATIONS,
  ELEMENT_FUN_FACTS,
  parseCelsiusToKelvin,
} from '../../data/elementExtensions';
import './ElementModal.css';

interface ElementModalProps {
  element: ElementData | null;
  onClose: () => void;
  theme?: 'light' | 'dark';
  onOpenCompare?: (element: ElementData) => void;
}

export const ElementModal: React.FC<ElementModalProps> = ({
  element,
  onClose,
  theme = 'light',
  onOpenCompare,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'discovery' | 'applications'>('overview');
  const [prevElementNumber, setPrevElementNumber] = useState<number | undefined>(element?.atomicNumber);

  if (element && element.atomicNumber !== prevElementNumber) {
    setPrevElementNumber(element.atomicNumber);
    setActiveTab('overview');
  }

  // Capture last focused element and restore on unmount
  useEffect(() => {
    if (element) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

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

  // Use scientifically accurate electron shell distribution
  const shells = ELEMENT_SHELLS[element.atomicNumber] || [element.atomicNumber];
  const applications = ELEMENT_APPLICATIONS[element.atomicNumber] || [
    `Widely used in scientific research, advanced industrial processes, and modern materials engineering.`,
    `Crucial component in characteristic chemical reactions within the ${categoryConfig.name} family.`,
  ];
  const funFact = ELEMENT_FUN_FACTS[element.atomicNumber] || element.description;

  const meltK = parseCelsiusToKelvin(element.meltingPoint);
  const boilK = parseCelsiusToKelvin(element.boilingPoint);
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
                <span className="modal-block-chip">
                  {element.block}-block
                </span>
              </div>
              <span className="modal-atomic-mass-subtitle">
                Standard Atomic Weight: <strong>{element.atomicMass}</strong> u
              </span>
            </div>
          </div>

          <div className="modal-header-actions">
            {onOpenCompare && (
              <button
                type="button"
                className="modal-compare-btn"
                onClick={() => onOpenCompare(element)}
                title={`Compare ${element.name} with another element`}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3h5v5" />
                  <path d="M4 20L21 3" />
                  <path d="M21 16v5h-5" />
                  <path d="M15 15l6 6" />
                  <path d="M4 4l5 5" />
                </svg>
                <span>Compare</span>
              </button>
            )}

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
        </div>

        {/* Modal Navigation Tabs */}
        <nav className="modal-tabs" aria-label="Element detail tabs">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="tab-btn-text">Overview</span>
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'properties' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <span className="tab-btn-text">Properties</span>
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'discovery' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('discovery')}
          >
            <span className="tab-btn-text">Discovery & History</span>
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'applications' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <span className="tab-btn-text">Applications & Uses</span>
          </button>
        </nav>

        {/* Modal Body - Tab Panels */}
        <div className="modal-body-scrollable">
          {activeTab === 'overview' && (
            <div className="modal-grid-layout">
              {/* Left Column: Quick Classification */}
              <div className="modal-left-col">
                <div className="prop-section">
                  <h3 className="section-title">Key Atomic Classification</h3>
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
                      <dt>Phase at Room Temp</dt>
                      <dd>
                        <span className={`phase-badge phase-${element.phaseAtRoomTemperature.toLowerCase()}`}>
                          {element.phaseAtRoomTemperature}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Description Card */}
                <div className="description-card">
                  <h4 className="card-subtitle">Overview Description</h4>
                  <p className="element-description-text">{element.description}</p>
                </div>
              </div>

              {/* Right Column: Animated Bohr Orbital Model & Chemical Significance */}
              <div className="modal-right-col">
                <div className="orbital-diagram-card">
                  <div className="orbital-card-header">
                    <div className="orbital-header-top">
                      <span className="orbital-card-title">Bohr Orbital Shells Model</span>
                      <span className="shells-summary-badge">
                        <span className="shells-badge-label">Shells:</span> {shells.join(' · ')}
                      </span>
                    </div>
                    <p className="orbital-subtitle">Scientifically accurate electron configuration per shell</p>
                  </div>

                  <div className="bohr-model-container" aria-hidden="true">
                    <svg viewBox="0 0 220 220" className="bohr-svg">
                      {/* Nucleus */}
                      <circle cx="110" cy="110" r="18" fill="var(--modal-accent)" opacity="0.95" />
                      <text x="110" y="116" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800">
                        {element.symbol}
                      </text>

                      {/* Concentric rings for each shell with responsive radial scaling */}
                      {shells.map((count, idx) => {
                        const minRadius = shells.length === 1 ? 58 : 38;
                        const maxRadius = 88;
                        const radius =
                          shells.length === 1
                            ? minRadius
                            : Math.round(minRadius + (idx / (shells.length - 1)) * (maxRadius - minRadius));

                        const maxDots = Math.min(count, 18);
                        const ringDots = Array.from({ length: maxDots }).map((_, eIdx) => {
                          const angle = (eIdx / maxDots) * 2 * Math.PI;
                          const cx = 110 + radius * Math.cos(angle);
                          const cy = 110 + radius * Math.sin(angle);
                          return (
                            <circle
                              key={eIdx}
                              cx={cx}
                              cy={cy}
                              r="2.8"
                              fill="var(--modal-accent)"
                              className="bohr-electron"
                            />
                          );
                        });

                        const animDuration = 14 + idx * 3;
                        const isEven = idx % 2 === 0;

                        return (
                          <g key={idx}>
                            {/* Stationary dashed orbital track */}
                            <circle
                              cx="110"
                              cy="110"
                              r={radius}
                              fill="none"
                              stroke="var(--border-color)"
                              strokeWidth="1.3"
                              strokeDasharray={idx % 2 === 1 ? '3 2' : 'none'}
                              opacity="0.85"
                            />
                            {/* Smoothly revolving electron dots around the nucleus */}
                            <g
                              className="bohr-electron-orbit"
                              style={{
                                animation: `spinOrbit ${animDuration}s linear infinite ${isEven ? 'normal' : 'reverse'}`,
                              }}
                            >
                              {ringDots}
                            </g>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <div className="bohr-shells-footer">
                    <span className="shells-label">Shell Distribution (K, L, M, N...):</span>
                    <div className="shells-pills">
                      {shells.map((c, i) => (
                        <span key={i} className="shell-pill" title={`Shell ${String.fromCharCode(75 + i)}: ${c} electrons`}>
                          <strong>{String.fromCharCode(75 + i)}</strong>: {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="properties-tab-layout">
              {/* Atomic & Quantum */}
              <div className="prop-section full-width">
                <h3 className="section-title">Atomic & Quantum Properties</h3>
                <dl className="property-list-grid">
                  <div className="property-row">
                    <dt>Electron Configuration</dt>
                    <dd className="mono-text">{element.electronConfiguration}</dd>
                  </div>
                  <div className="property-row">
                    <dt>Electronegativity (Pauling)</dt>
                    <dd>
                      {element.electronegativity !== 'Not available' ? (
                        <div className="meter-cell">
                          <span>{element.electronegativity}</span>
                          <div className="visual-meter-bar">
                            <div
                              className="meter-fill"
                              style={{ width: `${(parseFloat(element.electronegativity) / 4.0) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        'Not available'
                      )}
                    </dd>
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
                  <div className="property-row">
                    <dt>Block</dt>
                    <dd>{element.block}-block orbital</dd>
                  </div>
                </dl>
              </div>

              {/* Thermal & Physical */}
              <div className="prop-section full-width">
                <h3 className="section-title">Thermal & Physical Properties</h3>
                <dl className="property-list-grid">
                  <div className="property-row">
                    <dt>Melting Point</dt>
                    <dd>
                      {element.meltingPoint} {meltK !== null && <span className="sub-unit">({meltK} K)</span>}
                    </dd>
                  </div>
                  <div className="property-row">
                    <dt>Boiling Point</dt>
                    <dd>
                      {element.boilingPoint} {boilK !== null && <span className="sub-unit">({boilK} K)</span>}
                    </dd>
                  </div>
                  <div className="property-row">
                    <dt>Density</dt>
                    <dd>{element.density}</dd>
                  </div>
                  <div className="property-row">
                    <dt>Standard State (298 K)</dt>
                    <dd>
                      <span className={`phase-badge phase-${element.phaseAtRoomTemperature.toLowerCase()}`}>
                        {element.phaseAtRoomTemperature}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'discovery' && (
            <div className="discovery-tab-layout">
              <div className="discovery-hero-card">
                <div className="discovery-header-badge">
                  <span className="disc-year-big">{element.discoveryYear}</span>
                  <span className="disc-year-label">Year of Discovery</span>
                </div>
                <div className="discovery-hero-content">
                  <h3 className="disc-hero-title">Discovered by</h3>
                  <p className="disc-hero-name">{element.discoveredBy}</p>
                </div>
              </div>

              <div className="discovery-notes-card">
                <h4 className="card-subtitle">Historical Context & Naming</h4>
                <p className="element-description-text">
                  {element.name} was formally recorded in scientific annals in <strong>{element.discoveryYear}</strong> by <strong>{element.discoveredBy}</strong>.
                  It represents chemical element number {element.atomicNumber} on the modern IUPAC periodic table.
                </p>
                <div className="etymology-box">
                  <strong>Symbol Origin:</strong> Symbol <code>{element.symbol}</code> represents the chemical identity of {element.name}, referenced across worldwide chemical literature and stoichiometric formulas.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="applications-tab-layout">
              <div className="applications-card">
                <h3 className="section-title">Everyday, Industrial & Scientific Applications</h3>
                <ul className="applications-list">
                  {applications.map((app, i) => (
                    <li key={i} className="application-item">
                      <span className="app-bullet">✓</span>
                      <span className="app-text">{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="fun-fact-card">
                <div className="fun-fact-header">
                  <span className="fun-fact-icon">🌟</span>
                  <h4 className="fun-fact-title">Chemical Significance</h4>
                </div>
                <p className="fun-fact-text">{funFact}</p>
              </div>
            </div>
          )}
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

          <div className="modal-footer-right">
            {onOpenCompare && (
              <button
                type="button"
                className="modal-footer-compare-btn"
                onClick={() => onOpenCompare(element)}
              >
                Compare Element
              </button>
            )}

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
    </div>
  );
};
