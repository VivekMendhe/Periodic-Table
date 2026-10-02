import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { ElementData } from '../../types/element';
import { CATEGORIES } from '../../data/categories';
import { CustomElementSelect } from '../Compare/CustomElementSelect';
import {
  calculateReaction,
  generateAtomAssemblyLayout,
  getBohrShells,
  REACTION_PRESETS,
  type ReactionOutcomeType,
  type AtomVisualNode,
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

  // Generate constituent atoms arrangement and assembly plan
  const assemblyPlan = useMemo(
    () => generateAtomAssemblyLayout(elemA, elemB, reaction),
    [elemA, elemB, reaction]
  );

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

      // Stage 2: Interaction climax & Ring electron transfer (1000ms)
      timerRef.current = window.setTimeout(() => {
        if (reaction.isReactive) {
          setAnimStage('bonded');
        } else {
          setAnimStage('rejected');
        }
      }, 1000);
    }, 800);
  }, [reaction.isReactive]);

  const resetArena = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setAnimStage('idle');
  }, []);

  if (!isOpen) return null;

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

  // Helper to get current coordinates of an atom node
  const getAtomCoords = (atom: AtomVisualNode) => {
    switch (animStage) {
      case 'idle':
        return { x: atom.startX, y: atom.startY };
      case 'approaching':
        return {
          x: atom.startX + (atom.bondedX - atom.startX) * 0.45,
          y: atom.startY + (atom.bondedY - atom.startY) * 0.45,
        };
      case 'interacting':
        return {
          x: atom.startX + (atom.bondedX - atom.startX) * 0.82,
          y: atom.startY + (atom.bondedY - atom.startY) * 0.82,
        };
      case 'bonded':
      case 'rejected':
        return { x: atom.bondedX, y: atom.bondedY };
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
                Visualizing how individual atoms move, transfer electrons, and assemble into molecular bonds
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

        {/* Dynamic Multi-Atom Molecular Assembly Arena */}
        <div className={`reaction-arena ${animStage}`}>
          <div className="arena-grid-overlay" aria-hidden="true" />

          {/* Connected Chemical Bond Lines (Visible when bonded) */}
          {animStage === 'bonded' && assemblyPlan.bonds.length > 0 && (
            <svg className="arena-bonds-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="bondGlowGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              {assemblyPlan.bonds.map((bond) => {
                const fromNode = assemblyPlan.atoms.find((a) => a.id === bond.fromAtomId);
                const toNode = assemblyPlan.atoms.find((a) => a.id === bond.toAtomId);
                if (!fromNode || !toNode) return null;

                if (bond.isDouble) {
                  return (
                    <g key={bond.id} className="double-bond-line-group">
                      <line
                        x1={`${fromNode.bondedX}%`}
                        y1={`${fromNode.bondedY - 2.5}%`}
                        x2={`${toNode.bondedX}%`}
                        y2={`${toNode.bondedY - 2.5}%`}
                        stroke="url(#bondGlowGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="bond-line"
                      />
                      <line
                        x1={`${fromNode.bondedX}%`}
                        y1={`${fromNode.bondedY + 2.5}%`}
                        x2={`${toNode.bondedX}%`}
                        y2={`${toNode.bondedY + 2.5}%`}
                        stroke="url(#bondGlowGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="bond-line"
                      />
                    </g>
                  );
                }

                return (
                  <line
                    key={bond.id}
                    x1={`${fromNode.bondedX}%`}
                    y1={`${fromNode.bondedY}%`}
                    x2={`${toNode.bondedX}%`}
                    y2={`${toNode.bondedY}%`}
                    stroke="url(#bondGlowGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="bond-line"
                  />
                );
              })}
            </svg>
          )}

          {/* Constituent Moving Atoms */}
          {assemblyPlan.atoms.map((atom) => {
            const coords = getAtomCoords(atom);
            const catInfo = CATEGORIES[atom.category] || CATEGORIES['unknown'];
            const atomColors = theme === 'dark' ? catInfo.colorDark : catInfo.colorLight;
            const shells = getBohrShells(atom.atomicNumber);

            return (
              <div
                key={atom.id}
                className={`assembly-atom-node ${atom.role} ${animStage} ${animStage === 'rejected' ? 'atom-rejected-bounce' : ''}`}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  '--atom-theme-border': atomColors.border,
                  '--atom-theme-bg': atomColors.bg,
                } as React.CSSProperties}
              >
                {/* Bohr Orbital Rings */}
                <div className="atom-orbital-rings-wrap" aria-hidden="true">
                  {shells.map((_count, idx) => {
                    const isOuter = idx === shells.length - 1;
                    const ringSize = atom.radius * 2 + idx * 16;
                    return (
                      <div
                        key={idx}
                        className={`orbital-orbit-ring ${isOuter ? 'outer-valence-orbit' : ''}`}
                        style={{
                          width: `${ringSize}px`,
                          height: `${ringSize}px`,
                          borderColor: atomColors.border,
                        }}
                      >
                        {/* Dot on valence ring */}
                        {isOuter && (
                          <span
                            className="orbiting-valence-dot"
                            style={{ backgroundColor: atomColors.border }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Nucleus Core */}
                <div
                  className="atom-nucleus-core"
                  style={{
                    width: `${atom.radius * 1.5}px`,
                    height: `${atom.radius * 1.5}px`,
                    backgroundColor: atomColors.bg,
                    borderColor: atomColors.border,
                  }}
                >
                  <span className="node-atom-num">#{atom.atomicNumber}</span>
                  <span className="node-atom-sym">{atom.symbol}</span>
                  <span className="node-atom-name">{atom.name}</span>
                </div>

                {/* Charge badge on bonded ionic atom */}
                {animStage === 'bonded' && atom.chargeSign && (
                  <span className={`node-charge-pill ${atom.chargeSign === '+' ? 'pos' : 'neg'}`}>
                    {atom.chargeSign}
                  </span>
                )}
              </div>
            );
          })}

          {/* Center Interaction Zone (Electron Leap, Repulsion, or Molecular Form) */}
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

            {/* Repulsion Forcefield Barrier */}
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

            {/* Assembled Compound Badge */}
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
                <span className="stamp-formula">NO MOLECULE FORMED</span>
                <span className="stamp-sub">Atoms Bounced Off Elastically</span>
              </div>
            )}
          </div>
        </div>

        {/* Valence Transfer Mechanism Ledger Strip */}
        <div className="valence-transfer-strip">
          <div className="valence-ledger-item">
            <span className="ledger-tag">Atomic Movement & Ring Mechanism:</span>
            <span className="ledger-text">
              {reaction.valenceDetails.transferType === 'leap' && (
                <>
                  ⚡ <strong>Atoms move together:</strong> {reaction.valenceDetails.donorShellFrom} leaps into{' '}
                  <strong>{reaction.valenceDetails.acceptorShellTo}</strong>, creating ionic lattice units!
                </>
              )}
              {reaction.valenceDetails.transferType === 'share' && (
                <>
                  🤝 <strong>Atoms assemble & dock:</strong> Rings overlap sharing {reaction.valenceDetails.electronCount} valence electron pairs into a single molecule!
                </>
              )}
              {reaction.valenceDetails.transferType === 'repel' && (
                <>
                  🛑 <strong>Collision Repelled:</strong> Atoms approach but bounce off elastically ({reaction.valenceDetails.acceptorShellTo})!
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
            <span className="legend-chip ionic">● Ionic (Electron Transfer)</span>
            <span className="legend-chip covalent">● Covalent (Shared Pairs)</span>
            <span className="legend-chip noble">● Inert (Complete Octet)</span>
          </div>
          <button type="button" className="reaction-done-btn" onClick={onClose}>
            Done Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
