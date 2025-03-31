import React from 'react';
import { TableOccupationDashboard } from '../components/TableOccupationDashboard.tsx';
import { PoolHealthSection } from '../components/PoolHealthSection.tsx';
import { WeatherWidget } from '../components/WeatherWidget';
import { motion } from 'framer-motion';
import { BarChart3, Activity, AlertTriangle, TrendingUp, Layers, ThermometerSun, Cloud } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {/* Section du haut avec le titre */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-3 lg:col-span-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
            padding: "1.5rem",
            borderRadius: "1rem",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "rgba(0, 0, 0, 0.3) 0px 10px 25px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset"
          }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent" 
            style={{ backgroundImage: "linear-gradient(90deg, #ffffff, #a5f3fc)" }}>
            Tableau de bord
          </h1>
          <div className="flex space-x-3">
            <button className="px-4 py-2 rounded-lg text-white text-sm transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.07) 100%)",
                boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 6px 0px, rgba(255, 255, 255, 0.1) 0px 1px 2px 0px inset",
              }}>
              Aujourd'hui
            </button>
            <button className="px-4 py-2 rounded-lg text-white/80 text-sm hover:text-white transition-all duration-200">
              Cette semaine
            </button>
            <button className="px-4 py-2 rounded-lg text-white/80 text-sm hover:text-white transition-all duration-200">
              Ce mois
            </button>
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div 
          variants={itemVariants}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
          }}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.25)"
              }}>
              <BarChart3 className="text-cyan-400" size={22} />
            </div>
            <h2 className="text-lg font-medium text-white">Stocks</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/60">Commandes en cours</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Fournisseurs actifs</p>
              <p className="text-2xl font-bold text-white">8</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Stock total</p>
              <p className="text-2xl font-bold text-white">1,250 kg</p>
            </div>
          </div>
        </motion.div>

        {/* Météo */}
        <motion.div 
          variants={itemVariants}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
          }}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.25)"
              }}>
              <Cloud className="text-cyan-400" size={22} />
            </div>
            <h2 className="text-lg font-medium text-white">Météo</h2>
          </div>
          <WeatherWidget />
        </motion.div>

        {/* Activité récente */}
        <motion.div 
          variants={itemVariants}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
          }}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.25)"
              }}>
              <Activity className="text-cyan-400" size={22} />
            </div>
            <h2 className="text-lg font-medium text-white">Activité récente</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)"
              }}>
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
              <div>
                <p className="text-sm text-white">Nouvelle commande #123</p>
                <p className="text-xs text-white/50">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)"
              }}>
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
              <div>
                <p className="text-sm text-white">Stock mis à jour</p>
                <p className="text-xs text-white/50">Il y a 4 heures</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)"
              }}>
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 shadow-[0_0_8px_rgba(250,204,21,0.5)]"></div>
              <div>
                <p className="text-sm text-white">Nouveau fournisseur ajouté</p>
                <p className="text-xs text-white/50">Il y a 1 jour</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alertes */}
        <motion.div 
          variants={itemVariants}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
          }}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.25)"
              }}>
              <AlertTriangle className="text-yellow-400" size={22} />
            </div>
            <h2 className="text-lg font-medium text-white">Alertes</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg"
              style={{
                background: "linear-gradient(135deg, rgba(250, 204, 21, 0.2) 0%, rgba(250, 204, 21, 0.05) 100%)",
                boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)"
              }}>
              <p className="text-sm text-yellow-100">Stock faible : Huîtres n°3</p>
              <p className="text-xs mt-1 text-yellow-100/70">Reste 50 kg</p>
            </div>
            <div className="p-4 rounded-lg"
              style={{
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)",
                boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)"
              }}>
              <p className="text-sm text-red-100">Commande en retard #456</p>
              <p className="text-xs mt-1 text-red-100/70">Retard de 2 jours</p>
            </div>
          </div>
        </motion.div>

        {/* Performance */}
        <motion.div 
          variants={itemVariants}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
          }}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.25)"
              }}>
              <TrendingUp className="text-emerald-400" size={22} />
            </div>
            <h2 className="text-lg font-medium text-white">Performance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-white/60">Croissance</p>
              <p className="text-sm font-bold text-emerald-400">+12%</p>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style={{ width: '72%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-white/60">Efficacité</p>
              <p className="text-sm font-bold text-emerald-400">+8%</p>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </motion.div>

        {/* Section des composants existants */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-3 lg:col-span-4"
          style={{
            background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
            borderRadius: "1rem",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: "1.5rem",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
          }}
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.25)"
              }}>
              <Layers className="text-cyan-400" size={22} />
            </div>
            <h2 className="text-xl font-medium text-white">Occupation des Tables</h2>
          </div>
          <TableOccupationDashboard />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="md:col-span-3 lg:col-span-4"
          style={{
            background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
            borderRadius: "1rem",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: "1.5rem",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
          }}
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.25)"
              }}>
              <ThermometerSun className="text-cyan-400" size={22} />
            </div>
            <h2 className="text-xl font-medium text-white">Santé des Bassins</h2>
          </div>
          <PoolHealthSection />
        </motion.div>
      </motion.div>
    </div>
  );
}
