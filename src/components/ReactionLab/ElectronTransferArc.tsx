import React from 'react';
import './ElectronTransferArc.css';

export interface ElectronTransferArcProps {
  phase: 'phase1_prep' | 'phase2_detach' | 'phase3_transfer' | 'phase4_accept' | 'phase5_bond' | 'rejected' | 'idle';
  startX: number; // percentage (e.g. 28)
  startY: number; // percentage (e.g. 50)
  endX: number;   // percentage (e.g. 72)
  endY: number;   // percentage (e.g. 50)
  donorSymbol: string;
  acceptorSymbol: string;
}

export const ElectronTransferArc: React.FC<ElectronTransferArcProps> = ({
  phase,
  startX,
  startY,
  endX,
  endY,
  donorSymbol,
  acceptorSymbol,
}) => {
  const isTransferring =
    phase === 'phase2_detach' ||
    phase === 'phase3_transfer' ||
    phase === 'phase4_accept';

  const isAttracting = phase === 'phase5_bond';

  // SVG viewBox 0 0 1000 500
  const svgStartX = (startX / 100) * 1000 + 40;
  const svgStartY = (startY / 100) * 500;
  const svgEndX = (endX / 100) * 1000 - 40;
  const svgEndY = (endY / 100) * 500;

  const midX = (svgStartX + svgEndX) / 2;
  const midY = Math.min(svgStartY, svgEndY) - 110; // High arc trajectory

  const arcPathD = `M ${svgStartX} ${svgStartY} Q ${midX} ${midY} ${svgEndX} ${svgEndY}`;

  return (
    <div className="transfer-arc-container" aria-hidden="true">
      <svg
        className="transfer-arc-svg"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="arcTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
          </linearGradient>

          <filter id="electronGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="12" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="fieldLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Trajectory Guide Path during transfer phases */}
        {isTransferring && (
          <g className="arc-path-group">
            <path
              d={arcPathD}
              fill="none"
              stroke="url(#arcTrailGrad)"
              strokeWidth="3"
              strokeDasharray="8 6"
              className="curved-trajectory-track"
            />
          </g>
        )}

        {/* Electrostatic Coulomb Field Lines during Bonded Phase */}
        {isAttracting && (
          <g className="electrostatic-field-group">
            {/* Center attraction line */}
            <line
              x1={svgStartX + 50}
              y1={svgStartY}
              x2={svgEndX - 50}
              y2={svgEndY}
              stroke="url(#fieldLineGrad)"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              className="field-line-center"
            />
            {/* Curved top flux line */}
            <path
              d={`M ${svgStartX + 50} ${svgStartY - 20} Q ${midX} ${midY + 40} ${svgEndX - 50} ${svgEndY - 20}`}
              fill="none"
              stroke="url(#fieldLineGrad)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="field-line-top"
              opacity="0.75"
            />
            {/* Curved bottom flux line */}
            <path
              d={`M ${svgStartX + 50} ${svgStartY + 20} Q ${midX} ${svgStartY + 70} ${svgEndX - 50} ${svgEndY + 20}`}
              fill="none"
              stroke="url(#fieldLineGrad)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="field-line-bottom"
              opacity="0.75"
            />
          </g>
        )}
      </svg>

      {/* The Single Continuous Traveling Electron Particle */}
      {isTransferring && (
        <div
          className={`traveling-electron-particle ${phase}`}
          style={{
            '--start-x': `${svgStartX / 10}%`,
            '--start-y': `${svgStartY / 5}%`,
            '--mid-x': `${midX / 10}%`,
            '--mid-y': `${midY / 5}%`,
            '--end-x': `${svgEndX / 10}%`,
            '--end-y': `${svgEndY / 5}%`,
          } as React.CSSProperties}
        >
          <div className="particle-core">
            <span className="particle-symbol">e⁻</span>
            <span className="particle-trail-blur" />
            <span className="particle-trail-spark" />
          </div>
          <span className="particle-tooltip">
            {phase === 'phase2_detach' && `${donorSymbol} 1s/2s/3s detaching`}
            {phase === 'phase3_transfer' && `Transferring 1 e⁻ → ${acceptorSymbol}`}
            {phase === 'phase4_accept' && `Joining ${acceptorSymbol} octet`}
          </span>
        </div>
      )}
    </div>
  );
};
