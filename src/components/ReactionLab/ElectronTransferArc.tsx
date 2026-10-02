import React from 'react';
import './ElectronTransferArc.css';

export interface ElectronStreamItem {
  id: string;
  startX: number; // percentage (0-100)
  startY: number; // percentage (0-100)
  endX: number;   // percentage (0-100)
  endY: number;   // percentage (0-100)
  donorSymbol: string;
  acceptorSymbol: string;
  delayMs?: number;
  label?: string;
}

export interface ElectronTransferArcProps {
  phase: 'phase1_prep' | 'phase2_detach' | 'phase3_transfer' | 'phase4_accept' | 'phase5_bond' | 'rejected' | 'idle';
  streams: ElectronStreamItem[];
}

export const ElectronTransferArc: React.FC<ElectronTransferArcProps> = ({
  phase,
  streams,
}) => {
  const isTransferring =
    phase === 'phase2_detach' ||
    phase === 'phase3_transfer' ||
    phase === 'phase4_accept';

  const isAttracting = phase === 'phase5_bond';

  if (streams.length === 0) return null;

  return (
    <div className="transfer-arc-container" aria-hidden="true">
      <svg
        className="transfer-arc-svg"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="arcTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
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

        {/* Trajectory Guide Paths during transfer phases */}
        {isTransferring &&
          streams.map((s, index) => {
            const svgStartX = (s.startX / 100) * 1000 + (s.startX < s.endX ? 35 : -35);
            const svgStartY = (s.startY / 100) * 500;
            const svgEndX = (s.endX / 100) * 1000 + (s.startX < s.endX ? -35 : 35);
            const svgEndY = (s.endY / 100) * 500;

            const midX = (svgStartX + svgEndX) / 2;
            const arcOffset = s.startY === s.endY ? (index % 2 === 0 ? -110 : 80) : -60;
            const midY = Math.min(svgStartY, svgEndY) + arcOffset;

            const arcPathD = `M ${svgStartX} ${svgStartY} Q ${midX} ${midY} ${svgEndX} ${svgEndY}`;

            return (
              <g key={`track-${s.id}`} className="arc-path-group">
                <path
                  d={arcPathD}
                  fill="none"
                  stroke="url(#arcTrailGrad)"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                  className="curved-trajectory-track"
                />
              </g>
            );
          })}

        {/* Electrostatic Coulomb Field Lines during Bonded Phase */}
        {isAttracting &&
          streams.map((s) => {
            const svgStartX = (s.startX / 100) * 1000 + 40;
            const svgStartY = (s.startY / 100) * 500;
            const svgEndX = (s.endX / 100) * 1000 - 40;
            const svgEndY = (s.endY / 100) * 500;
            const midX = (svgStartX + svgEndX) / 2;
            const midY = Math.min(svgStartY, svgEndY) - 90;

            return (
              <g key={`field-${s.id}`} className="electrostatic-field-group">
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
                <path
                  d={`M ${svgStartX + 50} ${svgStartY - 15} Q ${midX} ${midY + 40} ${svgEndX - 50} ${svgEndY - 15}`}
                  fill="none"
                  stroke="url(#fieldLineGrad)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="field-line-top"
                  opacity="0.75"
                />
              </g>
            );
          })}
      </svg>

      {/* The Continuous Traveling Electron Particles (one per stream with staggered timing) */}
      {isTransferring &&
        streams.map((s, index) => {
          const svgStartX = (s.startX / 100) * 1000 + (s.startX < s.endX ? 35 : -35);
          const svgStartY = (s.startY / 100) * 500;
          const svgEndX = (s.endX / 100) * 1000 + (s.startX < s.endX ? -35 : 35);
          const svgEndY = (s.endY / 100) * 500;

          const midX = (svgStartX + svgEndX) / 2;
          const arcOffset = s.startY === s.endY ? (index % 2 === 0 ? -110 : 80) : -60;
          const midY = Math.min(svgStartY, svgEndY) + arcOffset;

          const startXPercent = s.startX;
          const startYPercent = s.startY;
          const endXPercent = s.endX;
          const endYPercent = s.endY;
          const midXPercent = midX / 10;
          const midYPercent = midY / 5;

          return (
            <div
              key={`particle-${s.id}`}
              className={`traveling-electron-particle ${phase}`}
              style={{
                '--start-x': `${startXPercent}%`,
                '--start-y': `${startYPercent}%`,
                '--mid-x': `${midXPercent}%`,
                '--mid-y': `${midYPercent}%`,
                '--end-x': `${endXPercent}%`,
                '--end-y': `${endYPercent}%`,
                animationDelay: `${s.delayMs || 0}ms`,
              } as React.CSSProperties}
            >
              <div className="particle-core">
                <span className="particle-symbol">e⁻</span>
                <span className="particle-trail-blur" />
                <span className="particle-trail-spark" />
              </div>
              <span className="particle-tooltip">
                {s.label ||
                  (phase === 'phase2_detach' && `${s.donorSymbol} 1s/2s e⁻ detaching`) ||
                  (phase === 'phase3_transfer' && `Transferring e⁻ → ${s.acceptorSymbol}`) ||
                  (phase === 'phase4_accept' && `Joining ${s.acceptorSymbol} octet`)}
              </span>
            </div>
          );
        })}
    </div>
  );
};
