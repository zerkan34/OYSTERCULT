import React from 'react';
import { motion } from 'framer-motion';
import { Shell, Calendar, AlertTriangle, AlertCircle } from 'lucide-react';

// Type pour les données de la table
interface OysterTable {
  name: string;
  value: number; // Taux de remplissage
  color: string;
  type: string;
  currentSize: string;
  targetSize: string;
  timeProgress: number;
  startDate: string;
  harvest: string;
  mortality: number;
  alert?: string;
  status?: string;
  plates: string;
}

interface OysterTableCardProps {
  table: OysterTable;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

function getDaysRemaining(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(date.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export const OysterTableCard: React.FC<OysterTableCardProps> = ({
  table,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick
}) => {
  const hasAlert = table.alert || (table.timeProgress > 100);
  
  return (
    <motion.div 
      className={`
        relative rounded-lg p-4 overflow-hidden
        bg-[rgba(0,40,80,0.2)]
        shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset]
        cursor-pointer transition-all duration-200
      `}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      style={{ transform: isHovered ? 'scale(1.02)' : 'none' }}
    >
      {/* Effet de surbrillance */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(0,128,128,0.1)] to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: table.value === 100 ? '#22c55e' : '#eab308' }}></div>
            <div>
              <div className="text-white font-medium">{table.name}</div>
              <div className="text-xs text-white/70">{table.plates}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-white">{table.value}%</div>
            <div className="text-xs text-white/70">occupée</div>
          </div>
        </div>

        {/* Grilles d'occupation */}
        <div className="space-y-1">
          {/* Rangée du haut */}
          <div className="grid grid-cols-10 gap-1 w-full bg-[#22c55e]/10">
            {[...Array(10)].map((_, i) => {
              if (table.value === 100) {
                return (
                  <div key={i} className="w-full h-7 rounded-sm border border-white/10 bg-[#22c55e]"></div>
                );
              }

              // Pour Table A1 (72%), on remplit de droite à gauche
              if (table.name === 'Table A1') {
                const filledSquares = Math.floor((table.value / 100) * 8);
                const partialFill = ((table.value / 100) * 8) % 1;
                const position = i - 1; // -1 car on a un carré transparent à gauche

                if (i === 0) {
                  return <div key={i} className="w-full h-7 rounded-sm border border-white/10 bg-transparent"></div>;
                }

                if (i === 9) {
                  return <div key={i} className="w-full h-7 rounded-sm border border-white/10 bg-[#22c55e]"></div>;
                }

                if (position >= 8 - filledSquares) {
                  return <div key={i} className="w-full h-7 rounded-sm border border-white/10 bg-[#22c55e]"></div>;
                }

                if (position === 7 - filledSquares && partialFill > 0) {
                  return (
                    <div key={i} className="w-full h-7 rounded-sm border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bottom-0 bg-[#22c55e]" style={{ width: `${partialFill * 100}%` }}></div>
                    </div>
                  );
                }

                return <div key={i} className="w-full h-7 rounded-sm border border-white/10 bg-transparent"></div>;
              }

              // Pour les autres tables
              return (
                <div 
                  key={i} 
                  className="w-full h-7 rounded-sm border border-white/10 bg-[#22c55e]" 
                  style={{ 
                    opacity: i === 0 || i === 9 ? 0 :
                            i - 1 < Math.floor((table.value / 100) * 8) ? 1 : 0
                  }}
                ></div>
              );
            })}
          </div>

          {/* Rangée du bas */}
          <div className="grid grid-cols-10 gap-1 w-full bg-[#22c55e]/10">
            {[...Array(10)].map((_, i) => {
              if (table.value === 100) {
                return (
                  <div key={`second-${i}`} className="w-full h-7 rounded-sm border border-white/10 bg-[#22c55e]"></div>
                );
              }

              // Pour Table A1 (72%), on remplit de droite à gauche
              if (table.name === 'Table A1') {
                const filledSquares = Math.floor((table.value / 100) * 8);
                const partialFill = ((table.value / 100) * 8) % 1;
                const position = i - 1; // -1 car on a un carré transparent à gauche

                if (i === 0) {
                  return <div key={`second-${i}`} className="w-full h-7 rounded-sm border border-white/10 bg-transparent"></div>;
                }

                if (i === 9) {
                  return <div key={`second-${i}`} className="w-full h-7 rounded-sm border border-white/10 bg-[#22c55e]"></div>;
                }

                if (position >= 8 - filledSquares) {
                  return <div key={`second-${i}`} className="w-full h-7 rounded-sm border border-white/10 bg-[#22c55e]"></div>;
                }

                if (position === 7 - filledSquares && partialFill > 0) {
                  return (
                    <div key={`second-${i}`} className="w-full h-7 rounded-sm border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bottom-0 bg-[#22c55e]" style={{ width: `${partialFill * 100}%` }}></div>
                    </div>
                  );
                }

                return <div key={`second-${i}`} className="w-full h-7 rounded-sm border border-white/10 bg-transparent"></div>;
              }

              // Pour les autres tables
              return (
                <div 
                  key={`second-${i}`} 
                  className="w-full h-7 rounded-sm border border-white/10 bg-[#22c55e]"
                  style={{ 
                    opacity: i === 0 || i === 9 ? 0 :
                            i - 1 < Math.floor((table.value / 100) * 8) ? 1 : 0
                  }}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Informations de date et mortalité */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-white/70">
            {table.value > 0 && table.mortality > 0 && (
              <>
                <span className="font-medium">Mortalité :</span>{" "}
                {table.mortality}%
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mt-3">
          {table.harvest && (
            <div className="flex items-center text-white/70">
              <Calendar className="w-4 h-4 mr-1 text-cyan-400" />
              <span>Récolte: {table.harvest}</span>
            </div>
          )}
          {table.mortality > 0 && table.value > 0 && (
            <div className="flex items-center text-yellow-400">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {table.mortality}% mortalité
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
