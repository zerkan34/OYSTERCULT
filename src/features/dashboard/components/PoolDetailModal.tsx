import React from 'react';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';
import { 
  Shell, 
  X, 
  ThermometerSun,
  Activity,
  Droplets,
  BarChart3,
  LayoutList
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PoolDetailModalProps {
  pool: {
    id: string;
    name: string;
    status: string;
    temperature: number;
    oxygen: number;
    salinity: number;
    ph: number;
    lastCheck: string;
    alert: boolean;
  };
  onClose: () => void;
}

const modalAnimation = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  content: {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
  },
  item: {
    initial: { opacity: 0, y: 15 },
    animate: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1]
      } 
    }),
  }
};

const MetricCard = ({ 
  icon, 
  label, 
  value, 
  unit = '', 
  subValue = '',
  colorClass = 'text-white',
  index
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: React.ReactNode | number | string; 
  unit?: string;
  subValue?: string;
  colorClass?: string;
  index: number;
}) => (
  <motion.div
    custom={index}
    variants={modalAnimation.item}
    initial="initial"
    animate="animate"
    whileHover={{ 
      scale: 1.03, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2 }
    }}
    className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg"
    style={{
      WebkitBackdropFilter: "blur(8px)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 -1px 2px 0 rgba(255, 255, 255, 0.05) inset"
    }}
  >
    <div className="flex items-center space-x-3 mb-1">
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
        {icon}
      </div>
      <div className="text-white/70">{label}</div>
    </div>
    <div className={`text-xl font-bold mt-2 ${colorClass}`}>
      {typeof value === 'number' || typeof value === 'string' ? (
        <>
          {value}
          {unit && <span className="text-sm font-normal text-white/50 ml-1">{unit}</span>}
        </>
      ) : (
        value
      )}
    </div>
    {subValue && <div className="text-sm text-white/50 mt-1">{subValue}</div>}
  </motion.div>
);

const BatchItem = ({ name, weight, timeRemaining, index }: { name: string; weight: string; timeRemaining: string; index: number }) => (
  <motion.div
    custom={index + 5}
    variants={modalAnimation.item}
    initial="initial"
    animate="animate" 
    whileHover={{ 
      scale: 1.02, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2 }
    }}
    className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
    style={{ 
      WebkitBackdropFilter: "blur(8px)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 -1px 2px 0 rgba(255, 255, 255, 0.05) inset"
    }}
  >
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3 border border-white/10">
        <LayoutList size={18} className="text-blue-400" />
      </div>
      <div>
        <div className="text-white font-medium">{name}</div>
        <div className="text-sm text-white/60">{weight}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-white font-medium">{timeRemaining}</div>
      <div className="text-sm text-white/60">restantes</div>
    </div>
  </motion.div>
);

export function PoolDetailModal({ pool, onClose }: PoolDetailModalProps) {
  const modalRef = useClickOutside(onClose);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimal': return 'text-emerald-400';
      case 'Bon': return 'text-blue-400';
      case 'Attention': return 'text-amber-400';
      case 'Critique': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const overallQuality = Math.round((
    (pool.oxygen / 100) * 50 + 
    (1 - Math.abs(pool.temperature - 15) / 10) * 25 +
    (1 - Math.abs(pool.ph - 8) / 1) * 25
  ));

  const batches = [
    { name: 'LOT-2025-001', weight: '500 kg (Huîtres N°3)', timeRemaining: '12h' },
    { name: 'LOT-2025-002', weight: '300 kg (Huîtres N°2)', timeRemaining: '24h' }
  ];

  return (
    <motion.div
      {...modalAnimation.overlay}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      style={{ 
        WebkitBackdropFilter: "blur(10px)",
        backdropFilter: "blur(10px)",
      }}
    >
      <motion.div
        ref={modalRef}
        {...modalAnimation.content}
        className="bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)] rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-white/10 shadow-[rgba(0,0,0,0.2)_0px_5px_20px_-5px,rgba(0,200,200,0.1)_0px_5px_12px_-5px,rgba(255,255,255,0.07)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.05)_0px_0px_12px_inset,rgba(0,0,0,0.1)_0px_0px_8px_inset]"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{pool.name}</h2>
              <p className="text-white/60">Bassin de purification</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors rounded-full p-2 hover:bg-white/10"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6 mt-6">
            <motion.div
              variants={modalAnimation.item}
              initial="initial"
              animate="animate" 
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5"
            >
              <h3 className="text-xl font-bold text-white mb-5">
                Stock dans le bassin
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="col-span-1 flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Huîtres N°3', value: 16.7, color: '#0d9488' },
                            { name: 'Huîtres N°2', value: 10, color: '#3b82f6' },
                            { name: 'Libre', value: 73.3, color: '#334155' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                          stroke="none"
                        >
                          {[
                            { name: 'Huîtres N°3', value: 16.7, color: '#0d9488' },
                            { name: 'Huîtres N°2', value: 10, color: '#3b82f6' },
                            { name: 'Libre', value: 73.3, color: '#334155' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div className="text-2xl font-bold text-white">26.7%</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <MetricCard 
                    icon={<ThermometerSun size={20} className="text-brand-burgundy" />}
                    label="Température"
                    value={12.5}
                    unit="°C"
                    index={0}
                  />
                  
                  <MetricCard 
                    icon={<Activity size={20} className="text-brand-burgundy" />}
                    label="Oxygène dissous"
                    value={87}
                    unit="%"
                    index={1}
                  />
                  
                  <MetricCard 
                    icon={<div className="w-8 h-8 rounded-lg bg-[#0d9488] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>}
                    label="Huîtres N°3"
                    value={500}
                    unit="kg"
                    index={2}
                  />
                  
                  <MetricCard 
                    icon={<div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>}
                    label="Huîtres N°2"
                    value={300}
                    unit="kg"
                    index={3}
                  />
                </div>
              </div>
              
              <div className="mt-5">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Droplets size={20} className="text-cyan-400" />
                  </div>
                  <div className="text-white/70">Dernier nettoyage</div>
                  <div className="text-white font-medium ml-auto">12 mars 2025 <span className="text-sm text-white/50">(il y a 1 jour)</span></div>
                </div>
              </div>
              
              <div className="h-48 w-full bg-gradient-to-br from-[#071a40]/95 to-[#0a2858]/95 rounded-xl overflow-hidden shadow-2xl border border-blue-900/20 relative mt-6" 
                style={{ 
                  WebkitBackdropFilter: "blur(10px)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2), 0 -1px 2px 0 rgba(255, 255, 255, 0.05) inset"
                }}
              >
                {/* Overlay de brillance sur le dessus */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10"></div>
                
                <div className="relative h-full w-full">
                  {/* Visualisation du remplissage (gauche à droite) */}
                  <div className="absolute inset-0 flex">
                    {/* Partie N°3 - 500kg */}
                    <div className="h-full relative" style={{ width: '16.7%' }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-[#0d9488]/75 to-[#0d9488]/90 transition-all duration-500"></div>
                      {/* Label moderne pour N°3 */}
                      <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 z-20">
                        <div className="flex flex-col items-center">
                          <div className="bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-brand-burgundy/30 mb-1 shadow-lg">
                            <span className="text-white text-xs font-semibold">N°3</span>
                          </div>
                          <div className="text-xs text-white font-medium">500kg</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Partie N°2 - 300kg */}
                    <div className="h-full relative" style={{ width: '10%' }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/75 to-blue-600/90 transition-all duration-500" 
                        style={{
                          boxShadow: "0 0 20px rgba(37, 99, 235, 0.2)"
                        }}
                      ></div>
                      {/* Label moderne pour N°2 */}
                      <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 z-20">
                        <div className="flex flex-col items-center">
                          <div className="bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-blue-500/30 mb-1 shadow-lg">
                            <span className="text-white text-xs font-semibold">N°2</span>
                          </div>
                          <div className="text-xs text-white font-medium">300kg</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Curseur indiquant le niveau actuel */}
                  <div className="absolute left-[26.7%] inset-y-0 flex items-center pointer-events-none z-20">
                    <div className="h-16 w-[2px] bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)] rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={modalAnimation.item}
              initial="initial"
              animate="animate" 
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <LayoutList className="w-5 h-5 mr-2 text-brand-burgundy" />
                Lots en purification
              </h3>
              <div className="space-y-3">
                {batches.map((batch, index) => (
                  <BatchItem 
                    key={batch.name}
                    name={batch.name}
                    weight={batch.weight}
                    timeRemaining={batch.timeRemaining}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={onClose} 
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}