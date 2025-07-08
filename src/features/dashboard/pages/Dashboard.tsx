import React from 'react';
import { TableOccupationDashboard } from '../components/TableOccupationDashboard';
import { PoolHealthSection } from '../components/PoolHealthSection';
import { WeatherWidget } from '../components/WeatherWidget';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, BarChart3, CheckCircle, Clock, Droplets, ThermometerSun, TrendingUp, Waves } from 'lucide-react';

interface StyleObject extends React.CSSProperties {
  background?: string;
  backdropFilter?: string;
  WebkitBackdropFilter?: string;
  boxShadow?: string;
  order?: number;
  width?: string;
  maxHeight?: string;
  overflowY?: 'auto' | 'hidden' | 'scroll' | 'visible';
  padding?: string;
  borderRadius?: string;
  backgroundImage?: string;
}

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

const baseGlassStyle: StyleObject = {
  background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
};

const miniWidgetStyle: StyleObject = {
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "0.5rem",
  padding: "1rem"
};

const iconContainerStyle: StyleObject = {
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)",
  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.25)",
  borderRadius: "0.375rem",
  padding: "0.5rem"
};

const progressBarStyle: StyleObject = {
  width: '72%',
  height: '100%',
  background: 'linear-gradient(to right, rgb(52, 211, 153), rgb(20, 184, 166))',
  borderRadius: '9999px'
};

const headerStyle: StyleObject = {
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
  padding: "1.5rem",
  borderRadius: "1rem",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "rgba(0, 0, 0, 0.3) 0px 10px 25px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset"
};

const Dashboard = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-2"
    >
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 lg:col-span-4"
        style={{
          ...baseGlassStyle,
          maxHeight: "400px",
          overflowY: "auto",
          padding: "0.8rem",
          borderRadius: "1rem"
        }}
      >
        <WeatherWidget />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="col-span-1 md:col-span-2 lg:col-span-2"
        style={{
          ...baseGlassStyle,
          padding: "0.8rem",
          borderRadius: "1rem"
        }}
      >
        <TableOccupationDashboard />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="col-span-1 md:col-span-1 lg:col-span-1"
        style={{
          ...baseGlassStyle,
          padding: "0.8rem",
          borderRadius: "1rem"
        }}
      >
        <div className="flex items-center mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center mr-2"
            style={iconContainerStyle}
          >
            <ThermometerSun className="text-cyan-400" size={18} />
          </div>
          <h2 className="text-lg font-medium text-white">Santé des Bassins</h2>
        </div>
        <PoolHealthSection />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="col-span-1 md:col-span-1 lg:col-span-1"
        style={{
          ...baseGlassStyle,
          padding: "0.8rem",
          borderRadius: "1rem"
        }}
      >
        <div className="flex items-center mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center mr-2"
            style={iconContainerStyle}
          >
            <BarChart3 className="text-cyan-400" size={18} />
          </div>
          <h2 className="text-lg font-medium text-white">Métriques générales de production</h2>
        </div>
        <div className="text-xs text-white/60 mb-3">Mis à jour il y a 5 min</div>
        
        <div className="space-y-3">
          <div className="p-2 rounded-lg" style={miniWidgetStyle}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/80 text-xs">Taux mortalité</span>
              <span className="text-green-400 text-xs">Stable cette semaine</span>
            </div>
            <div className="text-lg font-semibold text-white mb-1">17%</div>
            <div className="text-xs text-white/60">Taux normal pour la saison</div>
          </div>
          
          <div className="p-2 rounded-lg" style={miniWidgetStyle}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/80 text-xs">Prochaine récolte prévue</span>
              <span className="text-cyan-400 text-xs">Dans 15 jours</span>
            </div>
            <div className="text-lg font-semibold text-white mb-1">4.8t</div>
            <div className="text-xs text-white/60">Croissance optimale</div>
          </div>
        </div>
      </motion.div>

      {/* Nouveau conteneur spécialement pour le Bassin A2 */}
      <motion.div
        variants={itemVariants}
        className="lg:col-span-1 col-span-1"
        style={{
          ...baseGlassStyle,
          padding: "0.8rem",
          borderRadius: "1rem"
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Waves className="w-5 h-5 text-teal-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Bassin A2</h2>
          </div>
          <div className="text-xs text-white/50 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Mis à jour il y a 2 min
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="p-2 rounded-lg" style={miniWidgetStyle}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/80 text-xs flex items-center gap-1">
                <ThermometerSun className="w-3 h-3" />
                Température
              </span>
              <span className="text-orange-400 text-xs">Élevée</span>
            </div>
            <div className="text-lg font-semibold text-white mb-1">13.2°C</div>
            <div className="text-xs text-white/60">Surveillance requise</div>
          </div>
          
          <div className="p-2 rounded-lg" style={miniWidgetStyle}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/80 text-xs flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                Oxygène
              </span>
              <span className="text-green-400 text-xs">Bon</span>
            </div>
            <div className="text-lg font-semibold text-white mb-1">88%</div>
            <div className="text-xs text-white/60">Niveau optimal</div>
          </div>
          
          <div className="p-2 rounded-lg" style={miniWidgetStyle}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/80 text-xs flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Capacité
              </span>
              <span className="text-yellow-400 text-xs">65%</span>
            </div>
            <div className="text-lg font-semibold text-white mb-1">650/1000</div>
            <div className="text-xs text-white/60">Moules & Oursins</div>
          </div>
          
          <div className="p-2 rounded-lg" style={miniWidgetStyle}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/80 text-xs flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Qualité eau
              </span>
              <span className="text-emerald-400 text-xs">Excellente</span>
            </div>
            <div className="text-lg font-semibold text-white mb-1">92%</div>
            <div className="text-xs text-white/60">pH: 8.0 - Salinité: 31.9</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="md:col-span-2 lg:col-span-4"
        style={{
          ...baseGlassStyle,
          padding: "0.8rem",
          borderRadius: "1rem"
        }}
      >
        <div className="flex items-center mb-2">
          <Activity className="w-5 h-5 text-cyan-400 mr-2" />
          <h2 className="text-lg font-semibold text-white">Aperçu des Opérations</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <motion.div
            variants={itemVariants}
            className="rounded-lg p-2"
            style={miniWidgetStyle}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-medium">Performance</h3>
              <TrendingUp className="text-cyan-400" size={16} />
            </div>
            <p className="text-xl font-semibold text-white">92%</p>
            <p className="text-xs text-cyan-300">+2.5% ce mois</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-lg p-2"
            style={miniWidgetStyle}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-medium">Occupation</h3>
              <BarChart3 className="text-cyan-400" size={16} />
            </div>
            <p className="text-xl font-semibold text-white">78%</p>
            <p className="text-xs text-cyan-300">Capacité optimale</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-lg p-2"
            style={miniWidgetStyle}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-medium">Alertes</h3>
              <AlertTriangle className="text-cyan-400" size={16} />
            </div>
            <p className="text-xl font-semibold text-white">2</p>
            <p className="text-xs text-cyan-300">Niveau faible</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
