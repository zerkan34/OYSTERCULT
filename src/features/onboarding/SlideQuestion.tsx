import React, { useState } from 'react';
import { Sparkles, MapPin, Waves } from 'lucide-react';

interface SlideQuestionProps {
  onSelect: (value: 'MEDITERRANEE' | 'ATLANTIQUE') => void;
}

const options = [
  {
    label: 'MÉDITERRANÉE',
    value: 'MEDITERRANEE',
    color: 'from-cyan-400 to-blue-500',
    desc: 'Sud & Est',
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

export const SlideQuestion: React.FC<SlideQuestionProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: 'MEDITERRANEE' | 'ATLANTIQUE') => {
    setSelected(value);
    onSelect(value);
    localStorage.setItem('oyster_zone', value);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[440px] py-1.5 px-12 border border-white/10 rounded-lg relative w-full max-w-5xl mx-auto"
      style={{ opacity: 1, transform: 'none' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="slide-question-title"
    >
      {/* Coins lumineux overlay */}
      <div className="absolute -inset-[1px] rounded-lg z-0 overflow-hidden" style={{ background: 'transparent' }} aria-hidden="true">
        <div className="absolute w-[20%] h-[1px]" style={{ top: '-1px', background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.4), transparent)', boxShadow: 'rgba(34, 211, 238, 0.2) 0px 0px 6px', left: '55.992%' }} />
        <div className="absolute w-[1px] h-[20%]" style={{ right: '-1px', background: 'linear-gradient(transparent, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.4), transparent)', boxShadow: 'rgba(34, 211, 238, 0.2) 0px 0px 6px', top: '1.91346%' }} />
        <div className="absolute w-[20%] h-[1px]" style={{ bottom: '-1px', background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.4), transparent)', boxShadow: 'rgba(34, 211, 238, 0.2) 0px 0px 6px', right: '-19.8379%' }} />
        <div className="absolute w-[1px] h-[20%]" style={{ left: '-1px', background: 'linear-gradient(transparent, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.4), transparent)', boxShadow: 'rgba(34, 211, 238, 0.2) 0px 0px 6px', bottom: '105.381%' }} />
      </div>
      {/* Overlay glassy-gradient */}
      <div className="absolute -inset-[1px] rounded-lg z-0" style={{ background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.03), rgba(56, 189, 248, 0.05), rgba(34, 211, 238, 0.03))', boxShadow: 'rgba(34, 211, 238, 0.263) 0px 0px 3.25px, rgba(34, 211, 238, 0.263) 0px 0px 2.62px inset' }} aria-hidden="true" />
      {/* Content */}
      <div className="flex flex-col items-center w-full relative z-10 py-6 md:py-10 px-4">
        <div className="w-full flex flex-col items-center gap-8 mb-10">
          <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl animate-pop mb-2">
            <Sparkles size={48} className="text-white drop-shadow-[0_0_16px_rgba(34,211,238,0.95)]" aria-hidden="true" />
          </span>
          <h2 id="slide-question-title" className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_0_24px_rgba(34,211,238,0.8)] text-center mb-0 whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>
            Où se situe votre production&nbsp;?
          </h2>
          <p className="text-white/70 text-xl md:text-2xl text-center mb-4 max-w-3xl mx-auto whitespace-nowrap">
            Cette information personnalisera votre expérience sur la plateforme.
          </p>
        </div>
        <div className="flex flex-col gap-8 w-full items-center">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`flex items-center gap-4 px-8 py-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_20px_rgba(0,0,0,0.22),0_0_20px_rgba(0,210,200,0.16),0_0_8px_rgba(0,0,0,0.12)_inset] hover:shadow-[0_8px_24px_rgba(0,0,0,0.28),0_0_28px_rgba(0,210,200,0.22),0_0_8px_rgba(0,0,0,0.12)_inset] min-w-[44px] min-h-[56px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 text-2xl font-semibold w-full max-w-lg mx-auto ${isSelected ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_6px_20px_rgba(0,0,0,0.25),0_0_22px_rgba(0,210,200,0.22)]' : 'text-white/80 hover:text-cyan-200'}`}
                aria-label={`Production en ${opt.label}`}
                aria-pressed={isSelected}
                tabIndex={0}
                onClick={() => handleSelect(opt.value as 'MEDITERRANEE' | 'ATLANTIQUE')}
              >
                <Icon className="text-cyan-400" aria-hidden="true" size={28} />
                <span>{opt.label}</span>
                {opt.desc && <span className="text-white/60 text-lg ml-3 whitespace-nowrap">{opt.desc}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
