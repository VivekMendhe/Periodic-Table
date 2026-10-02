import React from 'react';
import type { ElementData } from '../../types/element';
import './FallingExcessAtom.css';

interface FallingExcessAtomProps {
  element: ElementData;
  count: number;
  side: 'left' | 'right';
  theme: 'dark' | 'light';
  delayMs?: number;
}

export const FallingExcessAtom: React.FC<FallingExcessAtomProps> = ({
  element,
  count,
  side,
  theme,
  delayMs = 0,
}) => {
  return (
    <div
      className={`falling-excess-wrapper ${side}`}
      style={{
        animationDelay: `${delayMs}ms`,
      }}
    >
      {/* Ground Impact Shockwave Pulse */}
      <div className="ground-impact-ripple" />

      {/* Falling Atom Body with Gravity Drop */}
      <div className={`falling-atom-body ${theme}`}>
        {/* Mini Bohr Ring Shell around excess atom */}
        <div className="falling-mini-shell" />

        {/* Core Sphere */}
        <div className="falling-nucleus-sphere">
          <span className="falling-atom-count">{count}×</span>
          <strong className="falling-atom-symbol">{element.symbol}</strong>
        </div>

        {/* Gravity Trail Sparks */}
        <div className="gravity-trail-spark spark-1" />
        <div className="gravity-trail-spark spark-2" />
      </div>

      {/* Fallen / Unreacted Atom Notification Card */}
      <div className="fallen-atom-label-box">
        <div className="fallen-status-chip">
          <span className="fallen-icon">⚠️</span>
          <span className="fallen-title">Bache hue Atom: {count}× {element.symbol}</span>
        </div>
        <span className="fallen-desc">Unreacted Surplus (Niche Gir Gaya)</span>
      </div>
    </div>
  );
};
