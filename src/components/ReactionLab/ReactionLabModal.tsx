import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { ElementData } from '../../types/element';
import { CATEGORIES } from '../../data/categories';
import { CustomElementSelect } from '../Compare/CustomElementSelect';
import {
  calculateReaction,
  getBohrShells,
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

  // Bohr shells calculation for dynamic ring animations
  const shellsA = useMemo(() => getBohrShells(elemA.atomicNumber), [elemA.atomicNumber]);
  const shellsB = useMemo(() => getBohrShells(elemB.atomicNumber), [elemB.atomicNumber]);

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

    // Stage 1: Approach center (800ms)
    timerRef.current = window.setTimeout(() => {
      setAnimStage('interacting');

      // Stage 2: Interaction climax & Ring electron transfer (950ms)
      timerRef.current = window.setTimeout(() => {
        if (reaction.isReactive) {
          setAnimStage('bonded');
        } else {
          setAnimStage('rejected');
        }
      }, 950);
    }, 800);
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

  // Helper to render Bohr Orbital Rings for an atom in SVG
  const renderBohrRings = (
    shells: number[],
    isAtomA: boolean,
    atomColor: string
  ) => {
    const isDonor = isAtomA && reaction.donorSymbol === elemA.symbol;
    const isAcceptor = !isAtomA && reaction.acceptorSymbol === elemB.symbol;
    const isIonic = reaction.outcome === 'IONIC_BOND';

    return (
      <svg className="bohr-atom-svg" viewBox="0 0 160 160" aria-hidden="true">
        {shells.map((count, idx) => {
          const isOuter = idx === shells.length - 1;
          const radius = 28 + idx * 14;

          // If donor in ionic bond, the outermost ring dissolves/vanishes on 'bonded'
          const shouldDissolveOuterRing = isDonor && isOuter && isIonic && animStage === 'bonded';

          // If acceptor in ionic bond, outer ring glows and completes octet
          const shouldOctetGlow = isAcceptor && isOuter && isIonic && animStage === 'bonded';

          // Render electron dots around the ring
          const effectiveCount = isOuter && shouldOctetGlow ? Math.min(count + 1, 8) : count;
          const dots = Array.from({ length: Math.min(effectiveCount, 12) }).map((_, dIdx) => {
            const angle = (dIdx / Math.min(effectiveCount, 12)) * 2 * Math.PI;
            const cx = 80 + radius * Math.cos(angle);
            const cy = 80 + radius * Math.sin(angle);

            // Highlight the leap valence electron on donor's outer ring
            const isLeapDot = isDonor && isOuter && dIdx === 0;

            return (
              <circle
                key={dIdx}
                cx={cx}
                cy={cy}
                r={isLeapDot ? '3.5' : '2.5'}
                className={`bohr-dot ${isLeapDot ? 'leap-source-dot' : ''} ${animStage === 'interacting' && isLeapDot ? 'detaching' : ''}`}
                fill={isLeapDot ? '#fbbf24' : atomColor}
              />
            );
          });

          return (
            <g
              key={idx}
              className={`bohr-ring-group ${shouldDissolveOuterRing ? 'dissolved-ring' : ''} ${shouldOctetGlow ? 'octet-glow-ring' : ''}`}
            >
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="bohr-ring-track"
                stroke={shouldOctetGlow ? '#34d399' : atomColor}
                strokeWidth={isOuter ? '1.8' : '1.2'}
                strokeDasharray={isOuter ? '4 2' : 'none'}
                opacity={shouldDissolveOuterRing ? '0' : isOuter ? '0.85' : '0.5'}
              />
              <g
                className="bohr-dots-orbit"
                style={{
                  animation: `spinOrbit ${12 + idx * 4}s linear infinite ${idx % 2 === 0 ? 'normal' : 'reverse'}`,
                }}
              >
                {dots}
              </g>
            </g>
          );
        })}
      </svg>
    );
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

        {/* Stoichiometric Particle Ratio Bar ("Kitne Element Se Kitne Bante Hain") */}
        <div className="stoichiometry-particle-bar">
          <div className="particle-reactants-side">
            <span className="particle-side-title">Reactant Atoms In:</span>
            <div className="particle-units-row">
              <span className="reactant-pill atom-a-pill">
                <strong>{reaction.reactantACount}×</strong> {elemA.name} ({elemA.symbol})
              </span>
              <span className="particle-plus">+</span>
              <span className="reactant-pill atom-b-pill">
                <strong>{reaction.reactantBCount}×</strong> {elemB.name} ({elemB.symbol})
              </span>
            </div>
          </div>

          <div className="particle-reaction-arrow" aria-hidden="true">
            <span className="arrow-line">───────►</span>
            <span className="arrow-type-tag">
              {reaction.isReactive ? reaction.bondTypeTitle : 'No Bond Formed'}
            </span>
          </div>

          <div className="particle-products-side">
            <span className="particle-side-title">Product Yield Out:</span>
            <div className={`product-yield-badge ${reaction.isReactive ? 'yield-success' : 'yield-none'}`}>
              <strong>{reaction.productUnits}</strong>
            </div>
          </div>
        </div>

        {/* Animated Reaction Arena Stage */}
        <div className={`reaction-arena ${animStage}`}>
          <div className="arena-grid-overlay" aria-hidden="true" />

          {/* Left Atom A with Bohr Orbital Rings */}
          <div
            className={`arena-atom atom-left ${animStage}`}
            style={{
              '--atom-color': colorsA.border,
              '--atom-bg': colorsA.bg,
            } as React.CSSProperties}
          >
            {renderBohrRings(shellsA, true, colorsA.border)}

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
            {/* Parabolic Ring-to-Ring Electron Leap Arc */}
            {animStage === 'interacting' && reaction.outcome === 'IONIC_BOND' && (
              <div className="electron-leap-wrapper" aria-hidden="true">
                <svg className="leap-trajectory-svg" viewBox="0 0 320 120">
                  <path
                    d="M 40 60 Q 160 -10 280 60"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="trajectory-path"
                  />
                </svg>
                <div className="flying-valence-electron">
                  <span className="flying-dot">e⁻</span>
                  <span className="sparkle-spark">✦</span>
                </div>
              </div>
            )}

            {/* Covalent Shared Electron Cloud Overlay */}
            {animStage === 'bonded' && (reaction.outcome === 'COVALENT_POLAR' || reaction.outcome === 'COVALENT_NONPOLAR') && (
              <div className="covalent-merged-cloud">
                <div className="shared-electron e1">e⁻</div>
                <div className="shared-electron e2">e⁻</div>
                <span className="covalent-bond-label">Shared Valence Orbital Pair</span>
              </div>
            )}

            {/* Repulsion Forcefield Shield & Ripple */}
            {(animStage === 'interacting' || animStage === 'rejected') && !reaction.isReactive && (
              <div className="repulsion-forcefield-container">
                <div className="forcefield-wave wave-1" />
                <div className="forcefield-wave wave-2" />
                <div className="forcefield-barrier">
                  <span className="barrier-icon">🛡️</span>
                  <span className="barrier-text">ELECTROSTATIC REPULSION</span>
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
                <span className="stamp-sub">Inert Electron Cloud Repulsion</span>
              </div>
            )}
          </div>

          {/* Right Atom B with Bohr Orbital Rings */}
          <div
            className={`arena-atom atom-right ${animStage}`}
            style={{
              '--atom-color': colorsB.border,
              '--atom-bg': colorsB.bg,
            } as React.CSSProperties}
          >
            {renderBohrRings(shellsB, false, colorsB.border)}

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

        {/* Ring Transfer & Valence Ledger Strip */}
        <div className="valence-transfer-strip">
          <div className="valence-ledger-item">
            <span className="ledger-tag">Electron Ring Mechanism:</span>
            <span className="ledger-text">
              {reaction.valenceDetails.transferType === 'leap' && (
                <>
                  ⚡ <strong>{reaction.valenceDetails.donorShellFrom}</strong> leaps into{' '}
                  <strong>{reaction.valenceDetails.acceptorShellTo}</strong> ({reaction.valenceDetails.electronCount} e⁻)
                </>
              )}
              {reaction.valenceDetails.transferType === 'share' && (
                <>
                  🤝 <strong>Orbital Overlap:</strong> Rings merge sharing {reaction.valenceDetails.electronCount} valence electrons
                </>
              )}
              {reaction.valenceDetails.transferType === 'repel' && (
                <>
                  🛑 <strong>Pauli Exclusion:</strong> {reaction.valenceDetails.acceptorShellTo}
                </>
              )}
            </span>
          </div>

          <div className="stoich-ratio-badge">
            Ratio: <strong>{reaction.stoichiometryRatioText}</strong>
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
