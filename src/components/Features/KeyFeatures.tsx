import React from 'react';
import './KeyFeatures.css';

export const KeyFeatures: React.FC = () => {
  const features = [
    'Interactive 118-element periodic table',
    'Search by name, symbol or atomic number',
    'Category filtering',
    'Detailed element information modal',
    'Light and dark mode',
    'Responsive design (desktop, tablet, mobile)',
    'Keyboard accessible',
    'Scientifically accurate data',
    'Modern and clean UI',
  ];

  return (
    <div className="key-features-card">
      <h3 className="features-title">Key Features</h3>
      <ul className="features-list">
        {features.map((feature, idx) => (
          <li key={idx} className="feature-item">
            <span className="feature-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </span>
            <span className="feature-text">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="features-signature">
        <span>Science Made Interactive</span>
      </div>
    </div>
  );
};
