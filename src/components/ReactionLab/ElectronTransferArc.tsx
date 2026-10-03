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

  if (!isTransferring || streams.length === 0) return null;

  return (
    <div className="transfer-arc-container" aria-hidden="true">
      {streams.map((s, index) => {
        // Calculate outer shell edge position (~6.8% radius of Bohr atom container)
        const isDonorOnLeft = s.startX < s.endX;
        const donorShellEdgeX = s.startX + (isDonorOnLeft ? 6.8 : -6.8);
        const acceptorShellEdgeX = s.endX + (isDonorOnLeft ? -6.8 : 6.8);

        // Natural subtle curve midpoint
        const midX = (donorShellEdgeX + acceptorShellEdgeX) / 2;
        const curveOffset = s.startY === s.endY ? (index % 2 === 0 ? -6 : 5) : -4;
        const midY = Math.min(s.startY, s.endY) + curveOffset;

        return (
          <div
            key={`shell-electron-${s.id}`}
            className={`shell-transfer-electron ${phase}`}
            style={{
              '--start-x': `${donorShellEdgeX}%`,
              '--start-y': `${s.startY}%`,
              '--mid-x': `${midX}%`,
              '--mid-y': `${midY}%`,
              '--end-x': `${acceptorShellEdgeX}%`,
              '--end-y': `${s.endY}%`,
              animationDelay: `${s.delayMs || 0}ms`,
            } as React.CSSProperties}
            title={`${s.donorSymbol} valence electron transferring to ${s.acceptorSymbol}`}
          />
        );
      })}
    </div>
  );
};
