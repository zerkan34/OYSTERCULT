import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, AlertTriangle, ChevronRight, Activity, Thermometer, Waves, Beaker, Info } from 'lucide-react';
import { PoolDetailModal } from './PoolDetailModal';

// Types pour les données de santé des bassins
interface PoolHealth {
  id: string;
  name: string;
  status: 'Optimal' | 'Bon' | 'Attention' | 'Critique';
  temperature: number;
  oxygen: number;
  salinity: number;
  ph: number;
  lastCheck: string;
  alert: boolean;
}

// Données de démonstration pour la santé des bassins
const demoPools: PoolHealth[] = [
  {
    id: 'pool-001',
    name: 'Bassin Nord',
    status: 'Optimal',
    temperature: 16.2,
    oxygen: 95,
    salinity: 32.5,
    ph: 8.1,
    lastCheck: '12/03/2025',
    alert: false
  },
  {
    id: 'pool-002',
    name: 'Bassin Central',
    status: 'Attention',
    temperature: 17.8,
    oxygen: 82,
    salinity: 33.1,
    ph: 7.7,
    lastCheck: '12/03/2025',
    alert: true
  },
  {
    id: 'pool-003',
    name: 'Bassin Sud',
    status: 'Bon',
    temperature: 15.9,
    oxygen: 91,
    salinity: 31.8,
    ph: 8.0,
    lastCheck: '11/03/2025',
    alert: false
  }
];

// Animation optimisée utilisant transform
const cardVariants = {
  hidden: { opacity: 0, transform: 'translateY(20px)' },
  visible: (i: number) => ({
    opacity: 1,
    transform: 'translateY(0)',
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.19, 1.0, 0.22, 1.0] // Expo ease out
    }
  })
};

// Composant pour une jauge avec animation
const GaugeIndicator = ({ 
  value, 
  maxValue = 100, 
  label, 
  unit = '', 
  colorScheme = 'blue',
  icon
}: { 
  value: number; 
  maxValue?: number; 
  label: string; 
  unit?: string;
  colorScheme?: 'blue' | 'green' | 'amber' | 'red';
  icon?: React.ReactNode;
}) => {
  const percent = Math.min(100, Math.round((value / maxValue) * 100));
  
  const getGradient = () => {
    if (colorScheme === 'green') return 'from-emerald-500 to-teal-400';
    if (colorScheme === 'amber') return 'from-amber-500 to-yellow-400';
    if (colorScheme === 'red') return 'from-red-500 to-rose-400';
    return 'from-blue-500 to-cyan-400';
  };
  
  return (
    <div className="relative space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center text-white/70 text-sm">
          {icon && <span className="mr-1.5">{icon}</span>}
          <span>{label}</span>
        </div>
        <span className="font-medium text-white">{value}{unit}</span>
      </div>
      <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
          animate={{ transform: `scaleX(${percent / 100})`, transformOrigin: 'left' }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${getGradient()}`}
        />
      </div>
    </div>
  );
};

// Composant pour une carte de bassin avec des effets visuels améliorés
const PoolCard = ({ pool, index, onClick }: { pool: PoolHealth, index: number, onClick: (pool: PoolHealth) => void }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimal': return 'text-emerald-400';
      case 'Bon': return 'text-blue-400';
      case 'Attention': return 'text-amber-400';
      case 'Critique': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const getHeaderGradient = (status: string) => {
    switch (status) {
      case 'Optimal': return 'from-emerald-900/70 to-teal-800/70';
      case 'Bon': return 'from-blue-900/70 to-cyan-800/70';
      case 'Attention': return 'from-amber-900/70 to-orange-800/70';
      case 'Critique': return 'from-red-900/70 to-rose-800/70';
      default: return 'from-slate-900/70 to-slate-800/70';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'Optimal': return 'border-emerald-500/30';
      case 'Bon': return 'border-blue-500/30';
      case 'Attention': return 'border-amber-500/30';
      case 'Critique': return 'border-red-500/30';
      default: return 'border-white/10';
    }
  };

  // Icônes pour chaque métrique
  const temperatureIcon = <Thermometer size={14} className="text-red-400" />;
  const oxygenIcon = <Activity size={14} className="text-blue-400" />;
  const salinityIcon = <Waves size={14} className="text-cyan-400" />;
  const phIcon = <Beaker size={14} className="text-purple-400" />;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className={`rounded-xl overflow-hidden glass-effect backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] transform-gpu ${getBorderColor(pool.status)}`}
      style={{ 
        WebkitBackdropFilter: "blur(10px)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className={`p-5 bg-gradient-to-r ${getHeaderGradient(pool.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
              <Droplets className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{pool.name}</h3>
              <div className={`text-sm font-medium ${getStatusColor(pool.status)} flex items-center`}>
                <div className={`w-2 h-2 rounded-full mr-1.5 ${
                  pool.status === 'Optimal' ? 'bg-emerald-400' :
                  pool.status === 'Bon' ? 'bg-blue-400' :
                  pool.status === 'Attention' ? 'bg-amber-400' : 'bg-red-400'
                }`}></div>
                {pool.status}
              </div>
            </div>
          </div>
          {pool.alert && (
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/30 shadow-md">
              <AlertTriangle size={16} className="text-amber-400" />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 space-y-4 bg-slate-800/30">
        <div className="space-y-3.5">
          <GaugeIndicator 
            value={pool.temperature} 
            maxValue={25}
            label="Température" 
            unit="°C" 
            colorScheme={pool.temperature > 17 ? 'amber' : 'blue'} 
            icon={temperatureIcon}
          />
          
          <GaugeIndicator 
            value={pool.oxygen} 
            label="Oxygène dissous" 
            unit="%" 
            colorScheme={pool.oxygen < 85 ? 'amber' : 'green'} 
            icon={oxygenIcon}
          />
          
          <GaugeIndicator 
            value={pool.salinity} 
            maxValue={40}
            label="Salinité" 
            unit="‰" 
            colorScheme={pool.salinity > 33 ? 'amber' : 'blue'} 
            icon={salinityIcon}
          />
          
          <GaugeIndicator 
            value={pool.ph * 10} 
            maxValue={140}
            label="pH" 
            unit="" 
            colorScheme={pool.ph < 7.8 ? 'amber' : 'blue'} 
            icon={phIcon}
          />
        </div>
        
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="text-sm text-white/60 flex items-center">
            <Info size={14} className="mr-1.5 text-white/40" />
            <span>Dernier contrôle: <span className="text-white font-medium ml-1">{pool.lastCheck}</span></span>
          </div>
          <button 
            onClick={() => onClick(pool)}
            className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/5 hover:border-white/20"
          >
            <span className="text-xs text-white">Détails</span>
            <ChevronRight size={14} className="text-white/70" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export function PoolHealthSection() {
  const [selectedPool, setSelectedPool] = useState<PoolHealth | null>(null);

  const handleSelectPool = (pool: PoolHealth) => {
    setSelectedPool(pool);
  };

  const handleCloseModal = () => {
    setSelectedPool(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-800/30 backdrop-blur-sm flex items-center justify-center border border-blue-400/20">
          <Droplets className="text-blue-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Santé des bassins</h2>
          <p className="text-white/70">Surveillez les paramètres de l'eau en temps réel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {demoPools.map((pool, index) => (
          <PoolCard
            key={pool.id}
            pool={pool}
            index={index}
            onClick={handleSelectPool}
          />
        ))}
      </div>

      {selectedPool && (
        <PoolDetailModal
          pool={selectedPool}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
