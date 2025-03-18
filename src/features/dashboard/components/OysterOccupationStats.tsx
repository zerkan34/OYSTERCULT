import React from 'react';
import { motion } from 'framer-motion';
import { PieChart as RechartsPC, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ThermometerSun, Activity, Shell } from 'lucide-react';

// Les couleurs spécifiques pour les différents types d'huîtres
const COLORS = {
  'N3': '#0d9488', // Couleur teal pour les huîtres N°3
  'N2': '#3b82f6', // Couleur bleue pour les huîtres N°2
  'Libre': '#334155' // Couleur bleu-gris foncé pour l'espace libre
};

// Données pour le graphique
const data = [
  { name: 'Huîtres N°3', value: 500, color: COLORS.N3 },
  { name: 'Huîtres N°2', value: 300, color: COLORS.N2 },
  { name: 'Libre', value: 800 - 500 - 300, color: COLORS.Libre }
];

// Calculer le pourcentage d'occupation (N3 + N2)
const occupationPercentage = Number(((data[0].value + data[1].value) / 800 * 100).toFixed(1));

export const OysterOccupationStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
      {/* Graphique circulaire */}
      <div className="col-span-1 flex flex-col items-center justify-center">
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPC>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" color={entry.color} />
                ))}
              </Pie>
            </RechartsPC>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-2xl font-bold text-white">{occupationPercentage}%</div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="col-span-2 grid grid-cols-2 gap-4">
        {/* Température */}
        <motion.div 
          className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg"
          style={{ 
            WebkitBackdropFilter: "blur(8px)", 
            backdropFilter: "blur(8px)",
            boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px -1px 2px 0px rgba(255, 255, 255, 0.05) inset"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
              <ThermometerSun className="text-brand-burgundy" size={20} />
            </div>
            <div className="text-white/70">Température</div>
          </div>
          <div className="text-xl font-bold mt-2 text-white">12.5<span className="text-sm font-normal text-white/50 ml-1">°C</span></div>
        </motion.div>

        {/* Oxygène dissous */}
        <motion.div 
          className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg"
          style={{ 
            WebkitBackdropFilter: "blur(8px)", 
            backdropFilter: "blur(8px)",
            boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px -1px 2px 0px rgba(255, 255, 255, 0.05) inset"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
              <Activity className="text-brand-burgundy" size={20} />
            </div>
            <div className="text-white/70">Oxygène dissous</div>
          </div>
          <div className="text-xl font-bold mt-2 text-white">87<span className="text-sm font-normal text-white/50 ml-1">%</span></div>
        </motion.div>

        {/* Huîtres N°3 */}
        <motion.div 
          className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg"
          style={{ 
            WebkitBackdropFilter: "blur(8px)", 
            backdropFilter: "blur(8px)",
            boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px -1px 2px 0px rgba(255, 255, 255, 0.05) inset"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
              <div className="w-8 h-8 rounded-lg bg-[#0d9488] flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </div>
            <div className="text-white/70">Huîtres N°3</div>
          </div>
          <div className="text-xl font-bold mt-2 text-white">500<span className="text-sm font-normal text-white/50 ml-1">kg</span></div>
        </motion.div>

        {/* Huîtres N°2 */}
        <motion.div 
          className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg"
          style={{ 
            WebkitBackdropFilter: "blur(8px)", 
            backdropFilter: "blur(8px)",
            boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px -1px 2px 0px rgba(255, 255, 255, 0.05) inset"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
              <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
            </div>
            <div className="text-white/70">Huîtres N°2</div>
          </div>
          <div className="text-xl font-bold mt-2 text-white">300<span className="text-sm font-normal text-white/50 ml-1">kg</span></div>
        </motion.div>
      </div>
    </div>
  );
};

export default OysterOccupationStats;
