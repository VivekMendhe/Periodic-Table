import React from 'react';
import type { ElementData } from '../../types/element';
import type { ReactionResult } from '../../data/reactionEngine';
import './FusedCompoundElement.css';

interface FusedCompoundElementProps {
  reaction: ReactionResult;
  elemA: ElementData;
  elemB: ElementData;
  isIonic: boolean;
  size?: number;
}

export const FusedCompoundElement: React.FC<FusedCompoundElementProps> = ({
  reaction,
  elemA,
  elemB,
  isIonic,
  size = 230,
}) => {
  const center = 120;
  const viewBoxSize = 240;

  // Outer molecular valence ring radii
  const innerRingR = 64;
  const outerRingR = 96;

  // 8 stable octet valence electrons positions on the outer shell
  const octetElectrons = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45) * (Math.PI / 180);
    return {
      x: center + outerRingR * Math.cos(angle),
      y: center + outerRingR * Math.sin(angle),
      id: `octet-e-${i}`,
    };
  });

  // 2 inner shell electrons
  const innerElectrons = [
    { x: center - innerRingR, y: center, id: 'inner-e-0' },
    { x: center + innerRingR, y: center, id: 'inner-e-1' },
  ];

  return (
    <div
      className={`fused-compound-container ${isIonic ? 'is-ionic-compound' : 'is-covalent-compound'}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Radiant Ambient Fusion Glow */}
      <div className="compound-fusion-glow" />

      {/* Radial Shockwave Pulse */}
      <div className="compound-shockwave-ring" />

      {/* Unified Molecular Orbitals SVG */}
      <svg
        className="fused-compound-svg"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="compoundNucleusGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor={isIonic ? '#38bdf8' : '#34d399'} />
            <stop offset="75%" stopColor={isIonic ? '#1d4ed8' : '#059669'} />
            <stop offset="100%" stopColor="#030712" />
          </radialGradient>

          <linearGradient id="orbitRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isIonic ? '#38bdf8' : '#34d399'} stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor={isIonic ? '#60a5fa' : '#10b981'} stopOpacity="0.8" />
          </linearGradient>

          <filter id="compoundGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbiting Valence Octet Shell */}
        <g className="fused-orbital-group outer-group">
          <circle
            cx={center}
            cy={center}
            r={outerRingR}
            className="fused-orbit-ring outer-ring"
            stroke="url(#orbitRingGrad)"
            strokeWidth="1.8"
            fill="none"
            strokeDasharray="4 3"
          />
          {octetElectrons.map((e) => (
            <circle
              key={e.id}
              cx={e.x}
              cy={e.y}
              r="4.2"
              className="fused-valence-electron"
              fill="#fbbf24"
              filter="url(#compoundGlow)"
            />
          ))}
        </g>

        {/* Inner Stabilized Shell */}
        <g className="fused-orbital-group inner-group">
          <circle
            cx={center}
            cy={center}
            r={innerRingR}
            className="fused-orbit-ring inner-ring"
            stroke={isIonic ? '#38bdf8' : '#34d399'}
            strokeWidth="1.2"
            strokeOpacity="0.5"
            fill="none"
          />
          {innerElectrons.map((e) => (
            <circle
              key={e.id}
              cx={e.x}
              cy={e.y}
              r="3.5"
              className="fused-inner-electron"
              fill="#67e8f9"
            />
          ))}
        </g>

        {/* Unified Fused Compound Core / Nucleus */}
        <circle
          cx={center}
          cy={center}
          r="42"
          fill="url(#compoundNucleusGrad)"
          className="fused-core-sphere"
          filter="url(#compoundGlow)"
        />

        {/* Chemical Formula Centered Inside Core */}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          dominantBaseline="central"
          className="fused-formula-text"
        >
          {reaction.compoundFormula}
        </text>

        {/* Reactant Constituents Badge under formula */}
        <text
          x={center}
          y={center + 16}
          textAnchor="middle"
          dominantBaseline="central"
          className="fused-constituents-text"
        >
          {elemA.symbol} + {elemB.symbol}
        </text>
      </svg>
    </div>
  );
};
