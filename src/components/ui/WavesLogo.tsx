import React from 'react';

interface WavesLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function WavesLogo({ className = '', width = 96, height = 120 }: WavesLogoProps) {
  return (
    <div className={`flex flex-col items-center text-white ${className}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'translateX(-8%)' }}
      >
        <g>
          <path d="M5 60 Q20 50, 30 60 T55 60 T80 60 T105 60 T130 60" stroke="currentColor" strokeWidth={4.8} strokeLinecap="round" fill="none" />
          <path d="M5 90 Q20 80, 30 90 T55 90 T80 90 T105 90 T130 90" stroke="currentColor" strokeWidth={4.8} strokeLinecap="round" fill="none" />
          <path d="M5 120 Q20 110, 30 120 T55 120 T80 120 T105 120 T130 120" stroke="currentColor" strokeWidth={4.8} strokeLinecap="round" fill="none" />
          <path d="M5 150 Q20 140, 30 150 T55 150 T80 150 T105 150 T130 150" stroke="currentColor" strokeWidth={4.8} strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
}
