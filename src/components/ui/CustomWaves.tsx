import React from 'react';

interface CustomWavesProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function CustomWaves({ size = 24, className = '', style }: CustomWavesProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Quatre vagues avec espacement régulier */}
      <path d="M2 4c.6.5 1.2 1 2.5 1C7 5 7 3 9.5 3c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" className="text-cyan-400" />
      <path 
        d="M2 9c.6.5 1.2 1 2.5 1C7 10 7 8 9.5 8c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" 
        className="text-white"
        style={{ stroke: 'white' }}
      />
      <path d="M2 14c.6.5 1.2 1 2.5 1C7 15 7 13 9.5 13c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" className="text-cyan-400" />
      <path d="M2 19c.6.5 1.2 1 2.5 1C7 20 7 18 9.5 18c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" className="text-cyan-400" />
    </svg>
  );
}
