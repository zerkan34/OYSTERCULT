import React from 'react';
import { TableOccupationDashboard } from '../components/TableOccupationDashboard';
import { PoolHealthSection } from '../components/PoolHealthSection';
import { WeatherWidget } from '../components/WeatherWidget';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, BarChart3, Cloud, Layers, ThermometerSun, TrendingUp } from 'lucide-react';

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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
    >
      {/* Section des tables */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 lg:col-span-3"
        style={{
          ...baseGlassStyle,
          padding: "1.5rem",
          borderRadius: "1rem"
        }}
      >
        <TableOccupationDashboard />
      </motion.div>

      {/* Section météo */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-3 lg:col-span-4"
        style={{
          ...baseGlassStyle,
          maxHeight: "400px",
          overflowY: "auto",
          padding: "1.5rem"
        }}
      >
        <WeatherWidget />
      </motion.div>

      {/* Section Aperçu des Opérations */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-3 lg:col-span-3 rounded-xl p-5"
        style={baseGlassStyle}
      >
        <div className="flex items-center mb-4">
          <Activity className="w-6 h-6 text-cyan-400 mr-2" />
          <h2 className="text-lg font-semibold text-white">Aperçu des Opérations</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Mini widget 1 - Performance */}
          <motion.div
            variants={itemVariants}
            className="rounded-lg p-4"
            style={{
              ...miniWidgetStyle,
              order: 1
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-medium">Performance</h3>
              <TrendingUp className="text-cyan-400" size={18} />
            </div>
            <p className="text-2xl font-semibold text-white">92%</p>
            <p className="text-xs text-cyan-300">+2.5% ce mois</p>
          </motion.div>

          {/* Mini widget 2 - Occupation */}
          <motion.div
            variants={itemVariants}
            className="rounded-lg p-4"
            style={{
              ...miniWidgetStyle,
              order: 2
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-medium">Occupation</h3>
              <BarChart3 className="text-cyan-400" size={18} />
            </div>
            <p className="text-2xl font-semibold text-white">78%</p>
            <p className="text-xs text-cyan-300">Capacité optimale</p>
          </motion.div>

          {/* Mini widget 3 - Alertes */}
          <motion.div
            variants={itemVariants}
            className="rounded-lg p-4"
            style={{
              ...miniWidgetStyle,
              order: 3
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-medium">Alertes</h3>
              <AlertTriangle className="text-cyan-400" size={18} />
            </div>
            <p className="text-2xl font-semibold text-white">2</p>
            <p className="text-xs text-cyan-300">Niveau faible</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Section Santé des Bassins */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-3 lg:col-span-3"
        style={baseGlassStyle}
      >
        <div className="flex items-center mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
            style={iconContainerStyle}
          >
            <ThermometerSun className="text-cyan-400" size={22} />
          </div>
          <h2 className="text-xl font-medium text-white">Santé des Bassins</h2>
        </div>
        <PoolHealthSection />
      </motion.div>
    </motion.div>
  );
};

      </div>
    </motion.div>
  );
};

export default Dashboard;
            </div>
            <h2 className="text-xl font-medium text-white">Santé des Bassins</h2>
          </div>
          <PoolHealthSection />
        </motion.div>
      </motion.div>

      {/* Espace équivalent à la hauteur du footer */}
      <div className="h-[35rem]"></div>
    </div>
  );
}
