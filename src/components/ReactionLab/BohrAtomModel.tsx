import React from 'react';
import './BohrAtomModel.css';

const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

export interface BohrAtomModelProps {
  symbol: string;
  name: string;
  atomicNumber: number;
  shells: number[];
  themeColors: {
    bg: string;
    border: string;
    accent: string;
    text: string;
  };
  isHighlighted?: boolean;
  isBreakingAway?: boolean;
  hideOutermostShell?: boolean;
  hideDetachedValenceElectron?: boolean;
  octetCompleteGlow?: boolean;
  chargeBadge?: string | null;
  size?: number;
  showShellLetters?: boolean;
  role?: 'donor' | 'acceptor' | 'neutral';
  configNote?: string | null;
  className?: string;
}

export const BohrAtomModel: React.FC<BohrAtomModelProps> = ({
  symbol,
  name,
  atomicNumber,
  shells,
  themeColors,
  isHighlighted = false,
  isBreakingAway = false,
  hideOutermostShell = false,
  hideDetachedValenceElectron = false,
  octetCompleteGlow = false,
  chargeBadge = null,
  size = 175,
  showShellLetters = true,
  role = 'neutral',
  configNote = null,
  className = '',
}) => {
  const center = 110;
  const viewBoxSize = 220;

  // Filter shells if the outermost empty shell is hidden (e.g. Na+ has lost shell 3)
  const effectiveShells = hideOutermostShell && shells.length > 1
    ? shells.slice(0, shells.length - 1)
    : shells;

  const shellCount = effectiveShells.length;

  // Radial calculation for concentric shells
  const getShellRadius = (index: number, total: number) => {
    if (total === 1) return 58;
    if (total === 2) return index === 0 ? 44 : 74;
    if (total === 3) return [36, 58, 84][index];
    if (total === 4) return [32, 48, 68, 88][index];
    const minR = 28;
    const maxR = 90;
    return Math.round(minR + (index / (total - 1)) * (maxR - minR));
  };

  return (
    <div
      className={`bohr-atom-container ${role} ${isBreakingAway ? 'is-breaking-away' : ''} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        '--atom-border': themeColors.border,
        '--atom-bg': themeColors.bg,
        '--atom-accent': themeColors.accent,
      } as React.CSSProperties}
    >
      {/* Break-away notification tag when detaching from source */}
      {isBreakingAway && (
        <span className="breakaway-pill" aria-hidden="true">
          ⚡ Detaching...
        </span>
      )}

      <svg
        className="bohr-atom-svg"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`nucleusGrad-${symbol}-${atomicNumber}`} cx="40%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="45%" stopColor={themeColors.accent || '#38bdf8'} />
            <stop offset="100%" stopColor={themeColors.border || '#0284c7'} />
          </radialGradient>
        </defs>

        {/* Break-away shockwave ring */}
        {isBreakingAway && (
          <circle
            cx={center}
            cy={center}
            r="98"
            className="bohr-breakaway-halo"
          />
        )}

        {/* Concentric Shells */}
        {effectiveShells.map((count, idx) => {
          const radius = getShellRadius(idx, shellCount);
          const isOuter = idx === shellCount - 1;
          const shellLetter = SHELL_NAMES[idx] || `S${idx + 1}`;
          const isEven = idx % 2 === 0;
          const animDuration = 12 + idx * 3.5;

          // Cap displayed electron dots for visual clarity if shell has many electrons
          const displayCount = Math.min(count, 18);
          const dots = Array.from({ length: displayCount }).map((_, dotIdx) => {
            // Is this the detached valence electron on the outermost ring?
            const isDetachedTarget = isOuter && dotIdx === 0 && hideDetachedValenceElectron;
            if (isDetachedTarget) return null;

            const isValence = isOuter;
            const angle = (dotIdx / displayCount) * 2 * Math.PI;
            const cx = center + radius * Math.cos(angle);
            const cy = center + radius * Math.sin(angle);

            // Is this the newly entered octet electron on acceptor (e.g. 8th electron on Cl-)?
            const isNewlyEntered = octetCompleteGlow && isOuter && dotIdx === displayCount - 1;

            return (
              <circle
                key={`dot-${idx}-${dotIdx}`}
                cx={cx}
                cy={cy}
                r={isValence ? (isHighlighted ? 4.0 : 3.4) : 2.8}
                className={`bohr-electron-dot ${
                  isValence ? 'valence-electron' : ''
                } ${isHighlighted && isValence ? 'valence-highlight' : ''} ${
                  isNewlyEntered ? 'new-octet-electron' : ''
                }`}
              />
            );
          });

          return (
            <g key={`shell-${idx}`}>
              {/* Stationary circular shell track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                className={`bohr-shell-track ${isOuter ? 'outermost-shell' : ''} ${
                  isHighlighted && isOuter ? 'highlight-outer' : ''
                } ${octetCompleteGlow && isOuter ? 'octet-complete' : ''}`}
                strokeDasharray={idx % 2 === 1 ? '4 3' : 'none'}
              />

              {/* Shell name letter (K, L, M) */}
              {showShellLetters && (
                <text
                  x={center}
                  y={center - radius - 2.5}
                  textAnchor="middle"
                  className="shell-letter-tag"
                >
                  {shellLetter}
                </text>
              )}

              {/* Revolving electron orbit group */}
              <g
                className="bohr-orbit-rotator"
                style={{
                  animation: `spinOrbit ${animDuration}s linear infinite ${
                    isEven ? 'normal' : 'reverse'
                  }`,
                }}
              >
                {dots}
              </g>
            </g>
          );
        })}

        {/* Nucleus Core */}
        <g className="bohr-nucleus-group">
          <circle
            cx={center}
            cy={center}
            r={18}
            fill={`url(#nucleusGrad-${symbol}-${atomicNumber})`}
            className="bohr-nucleus-circle"
            stroke={themeColors.border}
            strokeWidth="1.8"
          />
          <text x={center} y={center - 6} className="bohr-nucleus-num">
            #{atomicNumber}
          </text>
          <text x={center} y={center + 5} className="bohr-nucleus-sym">
            {symbol}
          </text>
          <text x={center} y={center + 13} className="bohr-nucleus-name">
            {name.length > 7 ? name.slice(0, 6) + '.' : name}
          </text>
        </g>

        {/* Ionic Charge Badge (+ or −) */}
        {chargeBadge && (
          <g className="bohr-charge-group" transform={`translate(${center + 15}, ${center - 24})`}>
            <circle
              cx="0"
              cy="0"
              r="9.5"
              className={`bohr-charge-badge ${
                chargeBadge.includes('-') || chargeBadge.includes('−')
                  ? 'charge-neg'
                  : 'charge-pos'
              }`}
            />
            <text x="0" y="0" className="bohr-charge-text">
              {chargeBadge}
            </text>
          </g>
        )}
      </svg>

      {/* Live Configuration Label Below Atom */}
      <div className="bohr-config-pill">
        <span className="bohr-config-numbers">
          {effectiveShells.join(', ')}
        </span>
        <span
          className={`bohr-config-sub ${isHighlighted ? 'highlight-sub' : ''} ${
            octetCompleteGlow ? 'octet-sub' : ''
          }`}
        >
          {configNote || (
            chargeBadge
              ? `${symbol}${chargeBadge} (${effectiveShells.map((n, i) => `${SHELL_NAMES[i]}:${n}`).join(' ')})`
              : effectiveShells.map((n, i) => `${SHELL_NAMES[i]}:${n}`).join(' · ')
          )}
        </span>
      </div>
    </div>
  );
};
