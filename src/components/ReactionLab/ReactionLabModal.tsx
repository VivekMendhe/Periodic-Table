import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { ElementData, ElementCategory } from '../../types/element';
import { CATEGORIES } from '../../data/categories';
import { ELEMENT_SHELLS } from '../../data/elementExtensions';
import { CustomElementSelect } from '../Compare/CustomElementSelect';
import { BohrAtomModel } from './BohrAtomModel';
import { ElectronTransferArc } from './ElectronTransferArc';
import { FusedCompoundElement } from './FusedCompoundElement';
import { FallingExcessAtom } from './FallingExcessAtom';
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

export type ReactionAnimationPhase =
  | 'idle'
  | 'phase1_prep'     // 0 - 1.2s: Zoom & highlight valence shells & electrons
  | 'phase2_detach'   // 1.2 - 2.5s: Electron detaches from donor, donor config updates, Na+ forms
  | 'phase3_transfer' // 2.5 - 4.0s: Electron travels along curved trajectory with glowing trail
  | 'phase4_accept'   // 4.0 - 5.2s: Electron enters acceptor shell, octet completes (e.g. 7->8), Cl- forms
  | 'phase5_bond'     // 5.2s+: Oppositely charged ions attract, bond formed, dossier shown
  | 'rejected';       // For inert/repulsion collisions

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
  const [animPhase, setAnimPhase] = useState<ReactionAnimationPhase>('idle');
  const timerRef = useRef<number | null>(null);

  if (initialElementA?.atomicNumber !== prevInitA) {
    setPrevInitA(initialElementA?.atomicNumber);
    setUserSelectedA(null);
    setAnimPhase('idle');
  }
  if (initialElementB?.atomicNumber !== prevInitB) {
    setPrevInitB(initialElementB?.atomicNumber);
    setUserSelectedB(null);
    setAnimPhase('idle');
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

  // Identify donor & acceptor for ionic transfer
  const isIonic = reaction.outcome === 'IONIC_BOND';
  const isCovalent = reaction.outcome === 'COVALENT_POLAR' || reaction.outcome === 'COVALENT_NONPOLAR';

  const enA = parseFloat(elemA.electronegativity) || 2.0;
  const enB = parseFloat(elemB.electronegativity) || 2.0;

  const donorSymbol = reaction.donorSymbol || (enA <= enB ? elemA.symbol : elemB.symbol);
  const acceptorSymbol = reaction.acceptorSymbol || (enA > enB ? elemA.symbol : elemB.symbol);

  const donorNode = assemblyPlan.atoms.find((a) => a.symbol === donorSymbol) || assemblyPlan.atoms[0];
  const acceptorNode =
    assemblyPlan.atoms.find((a) => a.symbol === acceptorSymbol) ||
    assemblyPlan.atoms[assemblyPlan.atoms.length - 1];

  // Excess / unreacted atoms that will fall down to the floor in Phase 5
  const excessACount = Math.max(0, reaction.reactantACount - 1);
  const excessBCount = Math.max(0, reaction.reactantBCount - 1);

  // Reset animation when elements change
  const handleSelectA = useCallback((id: number) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setUserSelectedA(id);
    setAnimPhase('idle');
  }, []);

  const handleSelectB = useCallback((id: number) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setUserSelectedB(id);
    setAnimPhase('idle');
  }, []);

  const handleSwap = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setUserSelectedA(elemBId);
    setUserSelectedB(elemAId);
    setAnimPhase('idle');
  }, [elemAId, elemBId]);

  const handlePresetClick = useCallback((atomA: number, atomB: number) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setUserSelectedA(atomA);
    setUserSelectedB(atomB);
    setAnimPhase('idle');
  }, []);

  // Execute 5-Phase sequential reaction animation (5-7 seconds)
  const startReaction = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    if (!reaction.isReactive) {
      // Repulsion / Inert Sequence
      setAnimPhase('phase1_prep');
      timerRef.current = window.setTimeout(() => {
        setAnimPhase('phase2_detach'); // atoms approach
        timerRef.current = window.setTimeout(() => {
          setAnimPhase('phase3_transfer'); // clash with barrier
          timerRef.current = window.setTimeout(() => {
            setAnimPhase('rejected'); // recoil bounce & forcefield
          }, 1200);
        }, 1200);
      }, 1000);
      return;
    }

    // Phase 1: Reaction Preparation (0 - 1.2s)
    setAnimPhase('phase1_prep');

    // Phase 2: Electron Leaves Donor / Valence shift (1.2s)
    timerRef.current = window.setTimeout(() => {
      setAnimPhase('phase2_detach');

      // Phase 3: Electron Travels along Curved Trajectory (2.5s)
      timerRef.current = window.setTimeout(() => {
        setAnimPhase('phase3_transfer');

        // Phase 4: Acceptor Accepts Electron & Completes Octet (4.0s)
        timerRef.current = window.setTimeout(() => {
          setAnimPhase('phase4_accept');

          // Phase 5: Ionic / Covalent Bond Formation (5.3s)
          timerRef.current = window.setTimeout(() => {
            setAnimPhase('phase5_bond');
          }, 1300);
        }, 1500);
      }, 1300);
    }, 1200);
  }, [reaction.isReactive]);

  const resetArena = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setAnimPhase('idle');
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

  // Coordinates of an atom node across animation phases
  const getAtomCoords = (atom: AtomVisualNode) => {
    switch (animPhase) {
      case 'idle':
      case 'phase1_prep':
        return { x: atom.startX, y: atom.startY };
      case 'phase2_detach':
        return {
          x: atom.startX + (atom.bondedX - atom.startX) * 0.18,
          y: atom.startY + (atom.bondedY - atom.startY) * 0.18,
        };
      case 'phase3_transfer':
        return {
          x: atom.startX + (atom.bondedX - atom.startX) * 0.45,
          y: atom.startY + (atom.bondedY - atom.startY) * 0.45,
        };
      case 'phase4_accept':
        return {
          x: atom.startX + (atom.bondedX - atom.startX) * 0.75,
          y: atom.startY + (atom.bondedY - atom.startY) * 0.75,
        };
      case 'phase5_bond':
        if (reaction.isReactive) {
          // Atoms collide directly into center (50%, 50%) to fuse together!
          return { x: 50, y: 50 };
        }
        return { x: atom.bondedX, y: atom.bondedY };
      case 'rejected':
        return { x: atom.bondedX, y: atom.bondedY };
    }
  };

  // Live narrative message for students
  const getNarrativeMessage = () => {
    switch (animPhase) {
      case 'idle':
        return 'Select reactants and click "⚡ Initiate Reaction" to watch atoms break off from reactant element rings and synthesize into a new compound molecule!';
      case 'phase1_prep':
        if (isIonic) {
          return `Phase 1 (Preparation): Reactant sources prepare. ${donorNode.name} outer shell highlights 1 valence e⁻; ${acceptorNode.name} outer shell highlights 7 valence e⁻.`;
        }
        if (isCovalent) {
          return `Phase 1 (Preparation): Both nonmetal reactant sources align their valence electron shells.`;
        }
        return `Phase 1 (Preparation): Evaluating atomic electron shells... Stable closed shells detected.`;
      case 'phase2_detach':
        if (isIonic) {
          return `Phase 2 (Atom Break-Off): Atoms break off ('tut ke nikalte hain') from reactant element rings! Valence electron detaches as ${donorNode.symbol} ionizes to ${donorNode.symbol}⁺.`;
        }
        if (isCovalent) {
          return `Phase 2 (Atom Break-Off): Atoms break off from reactant element sources and enter the reaction chamber.`;
        }
        return `Phase 2 (Approach): Atoms break off and approach each other.`;
      case 'phase3_transfer':
        if (isIonic) {
          return `Phase 3 (Convergence & Electron Leap): Detached atoms converge in the center. The electron travels along a radiant curved trajectory toward ${acceptorNode.name}.`;
        }
        if (isCovalent) {
          return `Phase 3 (Convergence & Cloud Overlap): Detached atoms meet in the center, overlapping their valence electron clouds.`;
        }
        return `Phase 3 (Coulomb Repulsion): Mutual electron cloud repulsion creates a strong electrostatic forcefield.`;
      case 'phase4_accept':
        if (isIonic) {
          return `Phase 4 (Octet Completion): ${acceptorNode.name} captures the incoming electron, completing a stable octet (8 electrons) as ${acceptorNode.symbol}⁻ ion!`;
        }
        if (isCovalent) {
          return `Phase 4 (Synchronized Sharing): Shared electron pairs orbit across both nuclei simultaneously.`;
        }
        return `Phase 4 (Forcefield Shockwave): Electrostatic repulsion wave deflects collision energy!`;
      case 'phase5_bond':
        if (isIonic) {
          const excessText = excessACount > 0 ? ` Excess unreacted ${excessACount}× ${elemA.symbol} atoms fall to the floor!` : '';
          return `Phase 5 (Atomic Fusion): Reactant atoms collide and fuse into 1 single new compound: ${reaction.compoundFormula} (${reaction.compoundName})!${excessText}`;
        }
        if (isCovalent) {
          const excessText = excessBCount > 0 ? ` Excess unreacted ${excessBCount}× ${elemB.symbol} atoms fall to the floor!` : '';
          return `Phase 5 (Molecular Fusion): Reactant atoms collide and fuse into 1 single new molecule: ${reaction.compoundFormula} (${reaction.compoundName})!${excessText}`;
        }
        return `Phase 5 (Elastic Recoil): Atoms bounce off each other without chemical bond formation.`;
      case 'rejected':
        return `Collision repelled! Atoms bounce apart without forming a chemical bond.`;
    }
  };

  const getStepState = (step: number) => {
    const phaseOrder: Record<ReactionAnimationPhase, number> = {
      idle: 0,
      phase1_prep: 1,
      phase2_detach: 2,
      phase3_transfer: 3,
      phase4_accept: 4,
      phase5_bond: 5,
      rejected: 5,
    };
    const currentStep = phaseOrder[animPhase];
    if (currentStep === step) return 'active';
    if (currentStep > step) return 'completed';
    return '';
  };

  const isAnimating =
    animPhase === 'phase1_prep' ||
    animPhase === 'phase2_detach' ||
    animPhase === 'phase3_transfer' ||
    animPhase === 'phase4_accept';

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
                Scientifically accurate atomic electron shells, real-time electron transfer, and chemical bond formation
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

        {/* Scrollable Modal Body Container */}
        <div className="reaction-modal-scroll-body">
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
              disabled={isAnimating}
            >
              ⇄
            </button>
            <button
              type="button"
              className={`initiate-btn ${isAnimating ? 'is-running' : ''}`}
              onClick={startReaction}
              disabled={isAnimating}
            >
              <span className="btn-sparkle">⚡</span>
              <span>{isAnimating ? 'Simulating...' : 'Initiate Reaction'}</span>
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

        {/* 5-Phase Sequential Stepper */}
        <div className="reaction-phase-stepper" aria-label="Reaction animation progress stepper">
          <div className={`stepper-step ${getStepState(1)}`}>
            <span className="step-num">1</span>
            <span className="step-text">Prepare</span>
          </div>
          <div className="stepper-connector" />
          <div className={`stepper-step ${getStepState(2)}`}>
            <span className="step-num">2</span>
            <span className="step-text">Break Off</span>
          </div>
          <div className="stepper-connector" />
          <div className={`stepper-step ${getStepState(3)}`}>
            <span className="step-num">3</span>
            <span className="step-text">Transfer</span>
          </div>
          <div className="stepper-connector" />
          <div className={`stepper-step ${getStepState(4)}`}>
            <span className="step-num">4</span>
            <span className="step-text">Octet</span>
          </div>
          <div className="stepper-connector" />
          <div className={`stepper-step ${getStepState(5)}`}>
            <span className="step-num">5</span>
            <span className="step-text">{reaction.isReactive ? 'Fuse & Form' : 'Repelled'}</span>
          </div>
        </div>

        {/* Live Narrative Mechanism Banner */}
        <div className={`phase-narrative-banner ${animPhase}`}>
          <span className="narrative-badge">
            {animPhase === 'idle' && '🔬 Standby'}
            {animPhase === 'phase1_prep' && '🔍 1. Preparation'}
            {animPhase === 'phase2_detach' && '⚡ 2. Atom Break-Off'}
            {animPhase === 'phase3_transfer' && '🚀 3. Trajectory'}
            {animPhase === 'phase4_accept' && '✨ 4. Octet Complete'}
            {animPhase === 'phase5_bond' && (reaction.isReactive ? '💎 5. Fused & Formed' : '🛑 Repulsion')}
            {animPhase === 'rejected' && '🛑 Repulsion'}
          </span>
          <span className="narrative-message">{getNarrativeMessage()}</span>
        </div>

        {/* Stoichiometric Particle Ratio Bar */}
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
        <div className={`reaction-arena ${animPhase}`}>
          <div className="arena-grid-overlay" aria-hidden="true" />

          {/* Celebratory Synthesized Compound Badge (Positioned at Top of Arena) */}
          {animPhase === 'phase5_bond' && reaction.isReactive && (
            <div className="arena-result-stamp stamp-bonded">
              <span className="stamp-icon">✨</span>
              <span className="stamp-title">ATOMS FUSED INTO 1 NEW ELEMENT:</span>
              <strong className="stamp-formula">{reaction.compoundFormula}</strong>
              <span className="stamp-sub">({reaction.compoundName})</span>
            </div>
          )}

          {animPhase === 'rejected' && (
            <div className="arena-result-stamp stamp-rejected">
              <span className="stamp-icon">🛑</span>
              <span className="stamp-formula">REPELLED: NO MOLECULE FORMED</span>
              <span className="stamp-sub">Atoms Bounced Off Elastically</span>
            </div>
          )}

          {/* Reactant Element A Reservoir (Left Source) */}
          <div className={`reactant-source-depot depot-left ${animPhase}`} title={`${elemA.name} Element Source Reservoir`}>
            <div className="depot-halo" />
            <div className="depot-core">
              <span className="depot-count">
                {animPhase === 'phase5_bond' && reaction.isReactive
                  ? (excessACount > 0 ? `${excessACount}× (Fallen)` : '0× (Fused)')
                  : `${reaction.reactantACount}×`}
              </span>
              <span className="depot-sym">{elemA.symbol}</span>
              <span className="depot-name">{elemA.name}</span>
            </div>
            <span className="depot-role-tag">Element Source</span>
            {animPhase === 'phase2_detach' && <div className="depot-fission-wave" />}
          </div>

          {/* Reactant Element B Reservoir (Right Source) */}
          <div className={`reactant-source-depot depot-right ${animPhase}`} title={`${elemB.name} Element Source Reservoir`}>
            <div className="depot-halo" />
            <div className="depot-core">
              <span className="depot-count">
                {animPhase === 'phase5_bond' && reaction.isReactive
                  ? (excessBCount > 0 ? `${excessBCount}× (Fallen)` : '0× (Fused)')
                  : `${reaction.reactantBCount}×`}
              </span>
              <span className="depot-sym">{elemB.symbol}</span>
              <span className="depot-name">{elemB.name}</span>
            </div>
            <span className="depot-role-tag">Element Source</span>
            {animPhase === 'phase2_detach' && <div className="depot-fission-wave" />}
          </div>

          {/* Connected Chemical Bond Lines (Visible when bonded) */}
          {animPhase === 'phase5_bond' && isCovalent && assemblyPlan.bonds.length > 0 && (
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

          {/* Continuous Electron Transfer Trajectory Arc & Coulomb Field Lines */}
          {isIonic && (
            <ElectronTransferArc
              phase={animPhase}
              startX={donorNode.startX}
              startY={donorNode.startY}
              endX={acceptorNode.startX}
              endY={acceptorNode.startY}
              donorSymbol={donorNode.symbol}
              acceptorSymbol={acceptorNode.symbol}
            />
          )}

          {/* Synthesized Ionic Bond Bridge in Phase 5 */}
          {animPhase === 'phase5_bond' && isIonic && (
            <div className="synthesized-bond-bridge">
              <div className="bridge-glow-beam" />
              <span className="bridge-tag">⚡ Ionic Coulomb Bond</span>
            </div>
          )}

          {/* Constituent Moving Atoms with full Bohr Concentric Shells */}
          {assemblyPlan.atoms.map((atom) => {
            const coords = getAtomCoords(atom);
            const catInfo = CATEGORIES[atom.category as ElementCategory] || CATEGORIES['unknown'];
            const atomColors = theme === 'dark' ? catInfo.colorDark : catInfo.colorLight;
            const originalShells = ELEMENT_SHELLS[atom.atomicNumber] || getBohrShells(atom.atomicNumber);

            const isNodeDonor = isIonic && atom.symbol === donorSymbol;
            const isNodeAcceptor = isIonic && atom.symbol === acceptorSymbol;

            // Phase 1: Outermost shell highlight
            const isHighlighted = animPhase === 'phase1_prep';

            // Phase 2: Atom breaks away from source
            const isBreakingAway = animPhase === 'phase2_detach';

            // Phase 2+: Donor valence electron detaches
            const hideDetachedValenceElectron =
              isNodeDonor &&
              (animPhase === 'phase2_detach' ||
                animPhase === 'phase3_transfer' ||
                animPhase === 'phase4_accept' ||
                animPhase === 'phase5_bond');

            // Phase 3+: Donor empty 3rd shell is hidden
            const hideOutermostShell =
              isNodeDonor &&
              (animPhase === 'phase3_transfer' ||
                animPhase === 'phase4_accept' ||
                animPhase === 'phase5_bond');

            // Phase 4+: Acceptor outer shell octet complete glow
            const octetCompleteGlow =
              isNodeAcceptor &&
              (animPhase === 'phase4_accept' || animPhase === 'phase5_bond');

            // Dynamic Shell Configuration per phase
            const effectiveShells = [...originalShells];
            if (isNodeAcceptor && (animPhase === 'phase4_accept' || animPhase === 'phase5_bond')) {
              const lastIdx = effectiveShells.length - 1;
              effectiveShells[lastIdx] = Math.min(8, effectiveShells[lastIdx] + 1);
            }

            // Charge badge timing
            let chargeBadge: string | null = null;
            if (isNodeDonor && hideDetachedValenceElectron) {
              chargeBadge = atom.chargeSign || '+';
            } else if (isNodeAcceptor && (animPhase === 'phase4_accept' || animPhase === 'phase5_bond')) {
              chargeBadge = atom.chargeSign || '−';
            }

            // Live config note
            let configNote: string | null = null;
            if (isNodeDonor) {
              if (animPhase === 'phase1_prep') {
                configNote = 'Valence shell (1 e⁻) ready';
              } else if (animPhase === 'phase2_detach') {
                configNote = 'e⁻ detaching → +1 ion';
              } else if (hideOutermostShell) {
                configNote = `${atom.symbol}⁺ Ion: Stable Octet`;
              }
            } else if (isNodeAcceptor) {
              if (animPhase === 'phase1_prep') {
                configNote = 'Needs 1 e⁻ for octet';
              } else if (octetCompleteGlow) {
                configNote = `${atom.symbol}⁻ Ion: Complete Octet!`;
              }
            }

            return (
              <div
                key={atom.id}
                className={`assembly-atom-node ${atom.role} ${animPhase} ${
                  animPhase === 'rejected' ? 'atom-rejected-bounce' : ''
                } ${
                  animPhase === 'phase5_bond' && reaction.isReactive ? 'fusing-into-product' : ''
                }`}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
              >
                <BohrAtomModel
                  symbol={atom.symbol}
                  name={atom.name}
                  atomicNumber={atom.atomicNumber}
                  shells={effectiveShells}
                  themeColors={{
                    bg: atomColors.bg,
                    border: atomColors.border,
                    accent: atomColors.accent,
                    text: atomColors.text,
                  }}
                  isHighlighted={isHighlighted}
                  isBreakingAway={isBreakingAway}
                  hideOutermostShell={hideOutermostShell}
                  hideDetachedValenceElectron={hideDetachedValenceElectron}
                  octetCompleteGlow={octetCompleteGlow}
                  chargeBadge={chargeBadge}
                  size={175}
                  role={isNodeDonor ? 'donor' : isNodeAcceptor ? 'acceptor' : 'neutral'}
                  configNote={configNote}
                />
              </div>
            );
          })}

          {/* Fused Single Product Compound Element in Center (Ek Hi Element) */}
          {animPhase === 'phase5_bond' && reaction.isReactive && (
            <FusedCompoundElement
              reaction={reaction}
              elemA={elemA}
              elemB={elemB}
              isIonic={isIonic}
              size={230}
            />
          )}

          {/* Falling Unreacted Surplus Atoms (Bache hue atoms niche girte hain) */}
          {animPhase === 'phase5_bond' && reaction.isReactive && excessACount > 0 && (
            <FallingExcessAtom
              element={elemA}
              count={excessACount}
              side="left"
              theme={theme}
              delayMs={120}
            />
          )}
          {animPhase === 'phase5_bond' && reaction.isReactive && excessBCount > 0 && (
            <FallingExcessAtom
              element={elemB}
              count={excessBCount}
              side="right"
              theme={theme}
              delayMs={220}
            />
          )}

          {/* Center Interaction Zone (Repulsion Barrier, Exothermic Flash) */}
          <div className="arena-center-zone">
            {/* Repulsion Forcefield Barrier */}
            {(animPhase === 'phase3_transfer' || animPhase === 'phase4_accept' || animPhase === 'rejected') &&
              !reaction.isReactive && (
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
            {animPhase === 'phase5_bond' && reaction.isReactive && (
              <div className="exothermic-flash-ring" />
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
                  ⚡ <strong>Electrostatic Coulomb Transfer:</strong> {reaction.valenceDetails.donorShellFrom} detaches and transfers to{' '}
                  <strong>{reaction.valenceDetails.acceptorShellTo}</strong>, creating oppositely charged ions bound into an ionic crystal!
                </>
              )}
              {reaction.valenceDetails.transferType === 'share' && (
                <>
                  🤝 <strong>Molecular Orbital Sharing:</strong> Valence shells overlap sharing {reaction.valenceDetails.electronCount} electron pairs between nuclei without ionization!
                </>
              )}
              {reaction.valenceDetails.transferType === 'repel' && (
                <>
                  🛑 <strong>Collision Repelled:</strong> Stable valence octets/electron clouds repel each other ({reaction.valenceDetails.acceptorShellTo})!
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
