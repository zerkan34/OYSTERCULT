import React, { useState } from 'react';
import { MapPin, Waves } from 'lucide-react';

interface SlideQuestionProps {
  onSkip: () => void;
  onSelect: (value: 'MEDITERRANEE' | 'ATLANTIQUE') => void;
}

const options = [
  {
    label: 'MÉDITERRANÉE',
    value: 'MEDITERRANEE',
    color: 'from-cyan-400 to-blue-500',
    desc: '',
    icon: MapPin,
  },
  {
    label: 'ATLANTIQUE',
    value: 'ATLANTIQUE',
    color: 'from-blue-400 to-cyan-500',
    desc: '',
    icon: Waves,
  },
];

export const SlideQuestion: React.FC<SlideQuestionProps> = ({ onSelect, onSkip }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: 'MEDITERRANEE' | 'ATLANTIQUE') => {
    setSelected(value);
    onSelect(value);
    localStorage.setItem('oyster_zone', value);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[540px] py-1.5 px-12 border border-white/10 rounded-lg relative w-full max-w-5xl mx-auto"
      style={{ opacity: 1, transform: 'none' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="slide-question-title"
    >

      {/* Coins lumineux overlay */}
      <div className="absolute -inset-[1px] rounded-lg z-0 overflow-hidden" style={{ background: 'transparent' }} aria-hidden="true">
        <div className="absolute w-[20%] h-[1px]" style={{ top: '-1px', background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.4), transparent)', boxShadow: 'rgba(34, 211, 238, 0.2) 0px 0px 6px', left: '40%' }} />
        <div className="absolute w-[1px] h-[20%]" style={{ left: '-1px', background: 'linear-gradient(transparent, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.4), transparent)', boxShadow: 'rgba(34, 211, 238, 0.2) 0px 0px 6px', top: '40%' }} />
        <div className="absolute w-[20%] h-[1px]" style={{ bottom: '-1px', background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.4), transparent)', boxShadow: 'rgba(34, 211, 238, 0.2) 0px 0px 6px', right: '40%' }} />
        <div className="absolute w-[1px] h-[20%]" style={{ right: '-1px', background: 'linear-gradient(transparent, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.4), transparent)', boxShadow: 'rgba(34, 211, 238, 0.2) 0px 0px 6px', bottom: '40%' }} />
      </div>
      {/* Overlay glassy-gradient */}
      <div className="absolute -inset-[1px] rounded-lg z-0" style={{ background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.03), rgba(56, 189, 248, 0.05), rgba(34, 211, 238, 0.03))', boxShadow: 'rgba(34, 211, 238, 0.263) 0px 0px 3.25px, rgba(34, 211, 238, 0.263) 0px 0px 2.62px inset' }} aria-hidden="true" />
      {/* Content */}
      <div className="flex flex-col items-center w-full relative z-10 py-6 md:py-10 px-4">
        <div className="w-full flex flex-col items-center gap-8 mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full shadow-xl animate-pop mb-2 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ transform: 'scale(0.65)' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
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
          <h2 id="slide-question-title" className="relative text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-center mb-0 whitespace-nowrap animate-gradient-x" style={{ letterSpacing: '0.04em' }}>
            Où se situe votre production&nbsp;?
            <div className="absolute -inset-x-20 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform -translate-y-1/2" />
          </h2>
          <p className="text-white/70 text-xl md:text-2xl text-center mb-4 max-w-3xl mx-auto whitespace-nowrap bg-gradient-to-r from-white/70 via-cyan-200/50 to-white/70 bg-clip-text">
            Cette information personnalisera votre expérience sur la plateforme.
          </p>
        </div>
        <div className="flex flex-col gap-6 w-full max-w-lg mx-auto mb-12">
          <div className="grid grid-cols-2 gap-6">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`group relative flex flex-col items-center justify-center gap-4 px-6 py-8 rounded-2xl bg-gradient-to-br from-white/[0.075] to-white/[0.035] backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_24px_rgba(0,0,0,0.24),0_0_16px_rgba(0,210,200,0.16)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.28),0_0_24px_rgba(0,210,200,0.24)] min-w-[44px] min-h-[56px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 text-2xl font-medium overflow-hidden ${isSelected ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-[0_6px_24px_rgba(0,0,0,0.3),0_0_28px_rgba(0,210,200,0.28)]' : 'text-white/90 hover:text-cyan-200'}`}
                aria-label={`Production en ${opt.label}`}
                aria-pressed={isSelected}
                tabIndex={0}
                onClick={() => handleSelect(opt.value as 'MEDITERRANEE' | 'ATLANTIQUE')}
              >
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-shimmer" style={{ '--shimmer-speed': '2.5s' } as any} />
                </div>
                
                {/* Icône avec effet de glow */}
                <div className="relative">
                  <Icon className="text-cyan-400 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" size={32} />
                  <div className="absolute inset-0 bg-cyan-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Texte avec effet de transition */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="relative">
                    <span className="relative z-10 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:to-white transition-all duration-300">
                      {opt.label}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
          </div>
          <button
            onClick={onSkip}
            className="group relative w-full max-w-lg mx-auto flex items-center justify-center gap-3 px-8 py-3.5 text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 rounded-xl backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/30 shadow-[0_4px_12px_rgba(0,0,0,0.1),0_0_8px_rgba(0,210,200,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15),0_0_12px_rgba(0,210,200,0.2)] transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-cyan-500/[0.08] to-blue-500/[0.08] hover:from-cyan-500/10 hover:to-blue-500/10 overflow-hidden"
            aria-label="Passer la configuration"
          >
            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-shimmer" style={{ '--shimmer-speed': '2s' } as any} />
            </div>
            
            <span className="text-sm font-medium relative z-10 text-white transition-all duration-300">Passer la configuration</span>
            
            {/* Flèche avec animation améliorée */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-all duration-300 group-hover:translate-x-1 group-hover:scale-105 relative z-10">
              <path d="M5 12h14M12 5l7 7-7 7" className="stroke-white transition-colors duration-300" />
            </svg>
            
            {/* Effet de glow sur le hover */}
            <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
