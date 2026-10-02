import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { ElementData } from '../../types/element';
import { CATEGORIES } from '../../data/categories';
import { CustomElementSelect } from '../Compare/CustomElementSelect';
import {
  calculateReaction,
  REACTION_PRESETS,
  type ReactionOutcomeType,
} from '../../data/reactionEngine';
import './ReactionLabModal.css';

interface ReactionLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: ElementData[];
  initialElementA?: ElementData | null;
  initialElementB?: ElementData | null;
  theme?: 'light' | 'dark';
}

type AnimationStage = 'idle' | 'approaching' | 'interacting' | 'bonded' | 'rejected';

export const ReactionLabModal: React.FC<ReactionLabModalProps> = ({
  isOpen,
  onClose,
  elements,
  initialElementA,
  initialElementB,
  theme = 'light',
}) => {
  const [userSelectedA, setUserSelectedA] = useState<number | null>(null);
  const [userSelectedB, setUserSelectedB] = useState<number | null>(null);
  const [prevInitA, setPrevInitA] = useState<number | undefined>(initialElementA?.atomicNumber);
  const [prevInitB, setPrevInitB] = useState<number | undefined>(initialElementB?.atomicNumber);
  const [animStage, setAnimStage] = useState<AnimationStage>('idle');
  const timerRef = useRef<number | null>(null);

  if (initialElementA?.atomicNumber !== prevInitA) {
    setPrevInitA(initialElementA?.atomicNumber);
    setUserSelectedA(null);
    setAnimStage('idle');
  }
  if (initialElementB?.atomicNumber !== prevInitB) {
    setPrevInitB(initialElementB?.atomicNumber);
    setUserSelectedB(null);
    setAnimStage('idle');
  }

  const elemAId = userSelectedA ?? initialElementA?.atomicNumber ?? 11; // Default Na
  const elemBId = userSelectedB ?? initialElementB?.atomicNumber ?? 17; // Default Cl

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const elemA = useMemo(
    () => elements.find((e) => e.atomicNumber === elemAId) || elements[10],
    [elements, elemAId]
  );
  const elemB = useMemo(
    () => elements.find((e) => e.atomicNumber === elemBId) || elements[16],
    [elements, elemBId]
  );

  const reaction = useMemo(() => calculateReaction(elemA, elemB), [elemA, elemB]);

  // Reset animation when elements change
  const handleSelectA = useCallback((id: number) => {
    setUserSelectedA(id);
    setAnimStage('idle');
  }, []);

  const handleSelectB = useCallback((id: number) => {
    setUserSelectedB(id);
    setAnimStage('idle');
  }, []);

  const handleSwap = useCallback(() => {
    setUserSelectedA(elemBId);
    setUserSelectedB(elemAId);
    setAnimStage('idle');
  }, [elemAId, elemBId]);

  const handlePresetClick = useCallback((atomA: number, atomB: number) => {
    setUserSelectedA(atomA);
    setUserSelectedB(atomB);
    setAnimStage('idle');
  }, []);

  // Execute reaction animation sequence
  const startReaction = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setAnimStage('approaching');

    // Stage 1: Approach center
    timerRef.current = window.setTimeout(() => {
      setAnimStage('interacting');

      // Stage 2: Interaction climax (Bond vs Reject)
      timerRef.current = window.setTimeout(() => {
        if (reaction.isReactive) {
          setAnimStage('bonded');
        } else {
          setAnimStage('rejected');
        }
      }, 700);
    }, 750);
  }, [reaction.isReactive]);

  const resetArena = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setAnimStage('idle');
  }, []);

  if (!isOpen) return null;

  const catA = CATEGORIES[elemA.category] || CATEGORIES['unknown'];
  const catB = CATEGORIES[elemB.category] || CATEGORIES['unknown'];
  const colorsA = theme === 'dark' ? catA.colorDark : catA.colorLight;
  const colorsB = theme === 'dark' ? catB.colorDark : catB.colorLight;

  const getOutcomeBadgeClass = (outcome: ReactionOutcomeType) => {
    switch (outcome) {
      case 'IONIC_BOND':
        return 'badge-ionic';
      case 'COVALENT_POLAR':
      case 'COVALENT_NONPOLAR':
        return 'badge-covalent';
      default:
        return 'badge-repulsion';
    }
  };

  return (
    <div
      className="reaction-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="reaction-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reaction-modal-title"
      >
        {/* Header */}
        <div className="reaction-modal-header">
          <div className="reaction-title-group">
            <span className="reaction-lab-icon" aria-hidden="true">⚗️</span>
            <div>
              <h2 id="reaction-modal-title" className="reaction-modal-title">
                Chemical Reaction & Bonding Lab
              </h2>
              <p className="reaction-modal-subtitle">
                Simulate atomic collisions, valence electron transfers, covalent clouds, and inert repulsions
              </p>
            </div>
          </div>
          <button
            type="button"
            className="reaction-close-btn"
            onClick={onClose}
            aria-label="Close reaction lab modal"
            title="Close (Esc)"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="reaction-presets-strip">
          <span className="presets-label">⚡ Fast Presets:</span>
          <div className="presets-scroll-pills">
            {REACTION_PRESETS.map((p) => {
              const isActive = elemAId === p.atomANumber && elemBId === p.atomBNumber;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`preset-pill ${p.category} ${isActive ? 'is-active' : ''}`}
                  onClick={() => handlePresetClick(p.atomANumber, p.atomBNumber)}
                  title={p.description}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Element Selectors Row */}
        <div className="reaction-selectors-row">
          <div className="reaction-selector-col">
            <span className="selector-role-label">Element A (Reactant 1)</span>
            <CustomElementSelect
              id="reaction-elem-a"
              selectedElementId={elemAId}
              onSelect={handleSelectA}
              elements={elements}
              theme={theme}
            />
          </div>

          <div className="reaction-actions-center">
            <button
              type="button"
              className="swap-atoms-btn"
              onClick={handleSwap}
              title="Swap Reactant Positions"
              aria-label="Swap atoms"
            >
              ⇄
            </button>
            <button
              type="button"
              className={`initiate-btn ${animStage === 'approaching' || animStage === 'interacting' ? 'is-running' : ''}`}
              onClick={startReaction}
              disabled={animStage === 'approaching' || animStage === 'interacting'}
            >
              <span className="btn-sparkle">⚡</span>
              <span>Initiate Reaction</span>
            </button>
            <button
              type="button"
              className="reset-arena-btn"
              onClick={resetArena}
              title="Reset Simulation"
              aria-label="Reset arena"
            >
              ↺ Reset
            </button>
          </div>

          <div className="reaction-selector-col">
            <span className="selector-role-label">Element B (Reactant 2)</span>
            <CustomElementSelect
              id="reaction-elem-b"
              selectedElementId={elemBId}
              onSelect={handleSelectB}
              elements={elements}
              theme={theme}
            />
          </div>
        </div>

        {/* Animated Reaction Arena Stage */}
        <div className={`reaction-arena ${animStage}`}>
          <div className="arena-grid-overlay" aria-hidden="true" />

          {/* Left Atom A */}
          <div
            className={`arena-atom atom-left ${animStage}`}
            style={{
              '--atom-color': colorsA.border,
              '--atom-bg': colorsA.bg,
            } as React.CSSProperties}
          >
            <div className="atom-halo-ring ring-outer" />
            <div className="atom-halo-ring ring-mid" />
            <div className="atom-nucleus">
              <span className="atom-num-label">#{elemA.atomicNumber}</span>
              <span className="atom-symbol-label">{elemA.symbol}</span>
              <span className="atom-name-label">{elemA.name}</span>
            </div>
            {animStage === 'bonded' && reaction.outcome === 'IONIC_BOND' && (
              <span className="ionic-charge-badge positive">
                {reaction.donorSymbol === elemA.symbol ? '+' : '−'}
              </span>
            )}
          </div>

          {/* Center Interaction Zone */}
          <div className="arena-center-zone">
            {/* Ionic Electron Transfer Particle */}
            {animStage === 'interacting' && reaction.outcome === 'IONIC_BOND' && (
              <div className="electron-leap-particle">
                <span className="leap-glow">e⁻</span>
              </div>
            )}

            {/* Covalent Shared Electron Cloud Overlay */}
            {animStage === 'bonded' && (reaction.outcome === 'COVALENT_POLAR' || reaction.outcome === 'COVALENT_NONPOLAR') && (
              <div className="covalent-merged-cloud">
                <div className="shared-electron e1">e⁻</div>
                <div className="shared-electron e2">e⁻</div>
                <span className="covalent-bond-label">Shared Electron Pair</span>
              </div>
            )}

            {/* Repulsion Forcefield Shield & Ripple */}
            {(animStage === 'interacting' || animStage === 'rejected') && !reaction.isReactive && (
              <div className="repulsion-forcefield-container">
                <div className="forcefield-wave wave-1" />
                <div className="forcefield-wave wave-2" />
                <div className="forcefield-barrier">
                  <span className="barrier-icon">🛡️</span>
                  <span className="barrier-text">REPULSION SHIELD</span>
                </div>
              </div>
            )}

            {/* Exothermic Bond Flash */}
            {animStage === 'bonded' && reaction.isReactive && (
              <div className="exothermic-flash-ring" />
            )}

            {/* Center Status Stamp */}
            {animStage === 'bonded' && (
              <div className="arena-result-stamp stamp-bonded">
                <span className="stamp-icon">✨</span>
                <span className="stamp-formula">{reaction.compoundFormula}</span>
                <span className="stamp-sub">{reaction.bondTypeTitle}</span>
              </div>
            )}

            {animStage === 'rejected' && (
              <div className="arena-result-stamp stamp-rejected">
                <span className="stamp-icon">🛑</span>
                <span className="stamp-formula">NO BOND FORMED</span>
                <span className="stamp-sub">Electrostatic Repulsion</span>
              </div>
            )}
          </div>

          {/* Right Atom B */}
          <div
            className={`arena-atom atom-right ${animStage}`}
            style={{
              '--atom-color': colorsB.border,
              '--atom-bg': colorsB.bg,
            } as React.CSSProperties}
          >
            <div className="atom-halo-ring ring-outer" />
            <div className="atom-halo-ring ring-mid" />
            <div className="atom-nucleus">
              <span className="atom-num-label">#{elemB.atomicNumber}</span>
              <span className="atom-symbol-label">{elemB.symbol}</span>
              <span className="atom-name-label">{elemB.name}</span>
            </div>
            {animStage === 'bonded' && reaction.outcome === 'IONIC_BOND' && (
              <span className="ionic-charge-badge negative">
                {reaction.donorSymbol === elemB.symbol ? '+' : '−'}
              </span>
            )}
          </div>
        </div>

        {/* Reaction Dossier & Chemical Analysis Card */}
        <div className="reaction-dossier">
          <div className="dossier-top-bar">
            <span className={`outcome-status-badge ${getOutcomeBadgeClass(reaction.outcome)}`}>
              {reaction.isReactive ? '✓ Reaction Feasible' : '✕ No Reaction / Inert'}
            </span>
            <div className="dossier-metric-item">
              <span className="metric-label">Electronegativity Difference:</span>
              <strong className="metric-val mono">ΔEN = {reaction.deltaEN.toFixed(2)}</strong>
            </div>
            <div className="dossier-metric-item">
              <span className="metric-label">Energy Profile:</span>
              <strong className={`metric-val energy-${reaction.energyType}`}>
                {reaction.energyType === 'exothermic' ? 'Exothermic (ΔH < 0)' : 'Inert / Non-spontaneous'}
              </strong>
            </div>
          </div>

          <div className="dossier-main-content">
            <div className="dossier-equation-box">
              <span className="eq-label">Stoichiometric Reaction:</span>
              <code className="reaction-equation-text">{reaction.balancedEquation}</code>
            </div>

            <div className="dossier-explanation-box">
              <h4 className="explanation-title">
                {reaction.isReactive ? `Bonding Mechanism: ${reaction.bondTypeTitle}` : 'Reason for Non-Reaction / Rejection:'}
              </h4>
              <p className="explanation-paragraph">{reaction.explanation}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="reaction-modal-footer">
          <div className="footer-legend">
            <span className="legend-chip ionic">● Ionic (ΔEN ≥ 1.8)</span>
            <span className="legend-chip covalent">● Covalent (Shared pairs)</span>
            <span className="legend-chip noble">● Inert / Octet Shield</span>
          </div>
          <button type="button" className="reaction-done-btn" onClick={onClose}>
            Done Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
