import React, { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import './Header.css';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchSlot?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  searchSlot,
}) => {
  const [activeModal, setActiveModal] = useState<'about' | 'resources' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <div className="app-brand">
            <div className="app-logo-wrapper" aria-hidden="true">
              <svg className="app-logo-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoBorderGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient id="ptTextGrad" x1="12" y1="18" x2="36" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>

                {/* Outer Periodic Element Card */}
                <rect x="3" y="3" width="42" height="42" rx="9" fill="var(--surface-secondary)" stroke="url(#logoBorderGrad)" strokeWidth="2.2" />

                {/* Atomic Number 118 */}
                <text x="8.5" y="14" fill="var(--text-tertiary)" fontSize="7" fontFamily="'JetBrains Mono', monospace" fontWeight="700">118</text>

                {/* 4 Category Blocks (Top Right) */}
                <g transform="translate(30, 7.5)">
                  <rect x="0" y="0" width="3.5" height="3.5" rx="1" fill="#0ea5e9" />
                  <rect x="4.5" y="0" width="3.5" height="3.5" rx="1" fill="#10b981" />
                  <rect x="0" y="4.5" width="3.5" height="3.5" rx="1" fill="#f59e0b" />
                  <rect x="4.5" y="4.5" width="3.5" height="3.5" rx="1" fill="#8b5cf6" />
                </g>

                {/* Central Bold Symbol Pt */}
                <text x="24" y="31.5" textAnchor="middle" fill="url(#ptTextGrad)" fontSize="19" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" letterSpacing="-0.04em">Pt</text>

                {/* Mini Periodic Table Silhouette at Bottom */}
                <g transform="translate(7.5, 35)">
                  {/* s-block */}
                  <rect x="0" y="0" width="4.5" height="5.5" rx="1" fill="#0ea5e9" />
                  <rect x="5.5" y="1.2" width="4" height="4.3" rx="1" fill="#0ea5e9" opacity="0.8" />
                  {/* d-block */}
                  <rect x="11" y="2.2" width="11" height="3.3" rx="1" fill="#f59e0b" />
                  {/* p-block */}
                  <rect x="23.5" y="0" width="4" height="5.5" rx="1" fill="#10b981" />
                  <rect x="28.5" y="0" width="4.5" height="5.5" rx="1" fill="#8b5cf6" />
                </g>
              </svg>
            </div>
            <div className="app-title-group">
              <h1 className="app-title">Periodic Table</h1>
              <p className="app-subtitle">Explore all 118 chemical elements</p>
            </div>
          </div>

          <nav className="desktop-nav" aria-label="Main navigation">
            <button
              type="button"
              className="nav-link is-active"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Home
            </button>
            <button
              type="button"
              className="nav-link"
              onClick={() => setActiveModal('about')}
            >
              About
            </button>
            <button
              type="button"
              className="nav-link"
              onClick={() => setActiveModal('resources')}
            >
              Resources
            </button>
          </nav>
        </div>

        <div className="header-center">
          {searchSlot}
        </div>

        <div className="header-right">
          <div className="theme-toggle-container">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Home
          </button>
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveModal('about');
            }}
          >
            About This Project
          </button>
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveModal('resources');
            }}
          >
            Educational Resources
          </button>
        </div>
      )}

      {/* About Modal */}
      {activeModal === 'about' && (
        <div className="simple-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="simple-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="simple-modal-header">
              <h2>About Periodic Table</h2>
              <button
                type="button"
                className="simple-modal-close"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="simple-modal-content">
              <p>
                This interactive periodic table provides a modern, scientifically rigorous explorer
                for all <strong>118 confirmed chemical elements</strong> as recognized by IUPAC.
              </p>
              <h3>Key Features</h3>
              <ul>
                <li>Accurate standard 18-column long-form grid layout</li>
                <li>Lanthanide and Actinide series segregated into the conventional f-block rows</li>
                <li>Comprehensive physical, chemical, and nuclear properties for each element</li>
                <li>Real-time search across atomic numbers, symbols, and element names</li>
                <li>Category filtering with color-coded scientific distinctions</li>
                <li>Full keyboard accessibility (WCAG 2.1) and Light/Dark themes</li>
              </ul>
              <p className="modal-version-tag">Version 1.0.0 • Interactive Chemistry Periodic Table Explorer</p>
            </div>
            <div className="simple-modal-footer">
              <button
                type="button"
                className="simple-modal-btn"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resources Modal */}
      {activeModal === 'resources' && (
        <div className="simple-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="simple-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="simple-modal-header">
              <h2>Scientific Resources</h2>
              <button
                type="button"
                className="simple-modal-close"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="simple-modal-content">
              <p>Useful references and authoritative chemical data sources:</p>
              <ul className="resources-list">
                <li>
                  <a href="https://iupac.org/what-we-do/periodic-table-of-elements/" target="_blank" rel="noopener noreferrer">
                    <strong>IUPAC Periodic Table of the Elements</strong> → Official standard periodic table and atomic weights
                  </a>
                </li>
                <li>
                  <a href="https://physics.nist.gov/PhysRefData/ASD/levels_form.html" target="_blank" rel="noopener noreferrer">
                    <strong>NIST Atomic Spectra Database</strong> → Precise electron configurations and energy levels
                  </a>
                </li>
                <li>
                  <a href="https://pubchem.ncbi.nlm.nih.gov/periodic-table/" target="_blank" rel="noopener noreferrer">
                    <strong>PubChem Periodic Table</strong> → National Center for Biotechnology Information element database
                  </a>
                </li>
                <li>
                  <a href="https://webelements.com/" target="_blank" rel="noopener noreferrer">
                    <strong>WebElements Periodic Table</strong> → Comprehensive online chemistry reference
                  </a>
                </li>
              </ul>
            </div>
            <div className="simple-modal-footer">
              <button
                type="button"
                className="simple-modal-btn"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
