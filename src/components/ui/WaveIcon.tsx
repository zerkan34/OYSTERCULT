import React from 'react';

interface WaveIconProps {
  size?: number;
  className?: string;
  withCircle?: boolean;
}

export const WaveIcon: React.FC<WaveIconProps> = ({ size = 60, className = '', withCircle = false }) => {
  return (
    <div className={`flex items-center justify-center ${className} ${withCircle ? 'rounded-full shadow-xl relative overflow-hidden bg-gray-900/50' : ''}`} style={withCircle ? { width: size, height: size } : undefined}>
      {withCircle && <div className="absolute inset-0 flex items-center justify-center bg-gradient-radial from-blue-500/20 via-blue-400/10 to-transparent animate-[pulse_4s_ease-in-out_infinite]" />}
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{ transform: 'scale(0.65)' }}>
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
            style={{ opacity: 0.9, transform: 'translateY(2px)' }}
          >
            <path
              d="M2 4c.6.5 1.2 1 2.5 1C7 5 7 3 9.5 3c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
              className="text-cyan-400"
            />
            <path
              d="M2 9c.6.5 1.2 1 2.5 1C7 10 7 8 9.5 8c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
              className="text-white"
              style={{ stroke: 'white' }}
            />
            <path
              d="M2 14c.6.5 1.2 1 2.5 1C7 15 7 13 9.5 13c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
              className="text-cyan-400"
            />
            <path
              d="M2 19c.6.5 1.2 1 2.5 1C7 20 7 18 9.5 18c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
              className="text-cyan-400"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
