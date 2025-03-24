import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Shield, RefreshCw, AlertTriangle, X, Plus, Eye, Trash2, Video } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';

// Styles avancés pour l'effet glassmorphique identique à la sidebar et au dashboard
const glassCardStyles = {
  container: `
    relative overflow-hidden rounded-xl
    bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)]
    -webkit-backdrop-filter: blur(20px)
    backdrop-filter: blur(20px)
    shadow-[rgba(0,0,0,0.2)_0px_5px_20px_-5px,rgba(0,200,200,0.1)_0px_5px_12px_-5px,rgba(255,255,255,0.07)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.05)_0px_0px_12px_inset,rgba(0,0,0,0.1)_0px_0px_8px_inset]
    border-0
  `,
  heading: `
    text-lg font-medium 
    bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent
  `,
  subheading: `
    text-sm text-white/70
  `,
  hoverEffect: `
    transition-all duration-200
    hover:shadow-[rgba(0,0,0,0.25)_0px_8px_25px_-5px,rgba(0,200,200,0.1)_0px_0px_15px_inset,rgba(255,255,255,0.1)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.1)_0px_0px_15px_inset,rgba(0,0,0,0.15)_0px_0px_8px_inset]
  `,
  progressBar: `
    relative h-2 rounded-full overflow-hidden
    bg-[rgba(0,20,40,0.3)] mt-2 mb-3
  `
};

// Variants d'animation optimisés
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

const slideInVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

const SurveillanceSimplePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddCameraModalOpen, setIsAddCameraModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cameras, setCameras] = useState([
    { id: '1', name: 'Caméra Entrée', ip: '192.168.1.100:554', status: 'online', lastSeen: '24/03 17:47', alerts: 0 },
    { id: '2', name: 'Caméra Bassin #1', ip: '192.168.1.101:554', status: 'online', lastSeen: '24/03 17:50', alerts: 2 },
    { id: '3', name: 'Caméra Bassin #2', ip: '192.168.1.102:554', status: 'offline', lastSeen: '23/03 14:33', alerts: 0 },
    { id: '4', name: 'Caméra Zone de Stockage', ip: '192.168.1.103:554', status: 'online', lastSeen: '24/03 17:49', alerts: 1 },
  ]);

  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Simulation du chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddCamera = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Logique pour ajouter une caméra
    const formData = new FormData(event.currentTarget);
    const newCamera = {
      id: `${cameras.length + 1}`,
      name: formData.get('camera-name') as string,
      ip: formData.get('camera-ip') as string,
      status: 'online',
      lastSeen: new Date().toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'}),
      alerts: 0
    };
    
    setCameras([...cameras, newCamera]);
    setIsAddCameraModalOpen(false);
  };

  // Si en chargement, afficher un loader
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-cyan-500 border-b-cyan-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-white/70">Chargement des caméras...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      className="space-y-6"
    >
      {/* En-tête avec effet de dégradé */}
      <PageTitle 
        icon={<Video size={28} className="text-white" />}
        title="Surveillance"
      />

      {/* Section principale avec 3 colonnes en grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        {/* Colonne 1: Statistiques */}
        <motion.div 
          variants={slideInVariants}
          className={`${glassCardStyles.container} ${glassCardStyles.hoverEffect} p-5 space-y-4`}
        >
          <h2 className={glassCardStyles.heading}>Statistiques surveillance</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[rgba(0,40,80,0.2)] rounded-lg p-3 shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset]">
              <div className="flex items-center justify-between">
                <div className={glassCardStyles.subheading}>Caméras actives</div>
                <div className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                  {cameras.filter(c => c.status === 'online').length}/{cameras.length}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                {Math.round((cameras.filter(c => c.status === 'online').length / cameras.length) * 100)}%
              </div>
              <div className={glassCardStyles.progressBar}>
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(cameras.filter(c => c.status === 'online').length / cameras.length) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div className="bg-[rgba(0,40,80,0.2)] rounded-lg p-3 shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset]">
              <div className="flex items-center justify-between">
                <div className={glassCardStyles.subheading}>Alertes aujourd'hui</div>
                <div className="bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded-full">
                  {cameras.reduce((sum, camera) => sum + camera.alerts, 0)}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                {cameras.reduce((sum, camera) => sum + camera.alerts, 0)}
              </div>
              <div className={glassCardStyles.progressBar}>
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400"
                  initial={{ width: 0 }}
                  animate={{ width: cameras.reduce((sum, camera) => sum + camera.alerts, 0) > 0 ? '50%' : '0%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div className="bg-[rgba(0,40,80,0.2)] rounded-lg p-3 shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset]">
              <div className="flex items-center justify-between">
                <div className={glassCardStyles.subheading}>Durée fonctionnement</div>
                <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                  Stable
                </div>
              </div>
              <div className="text-2xl font-bold text-white mt-2">6j 12h</div>
              <div className={glassCardStyles.progressBar}>
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div className="bg-[rgba(0,40,80,0.2)] rounded-lg p-3 shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset]">
              <div className="flex items-center justify-between">
                <div className={glassCardStyles.subheading}>Espace stockage</div>
                <div className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full">
                  84%
                </div>
              </div>
              <div className="text-2xl font-bold text-white mt-2">758.4 Go</div>
              <div className={glassCardStyles.progressBar}>
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-400"
                  initial={{ width: 0 }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Colonne 2: Liste des caméras */}
        <motion.div 
          variants={slideInVariants}
          className={`${glassCardStyles.container} ${glassCardStyles.hoverEffect} p-5`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className={glassCardStyles.heading}>Caméras de surveillance</h2>
            <button
              onClick={() => setIsAddCameraModalOpen(true)}
              className="px-3 py-1.5 bg-[rgba(0,128,128,0.3)] hover:bg-[rgba(0,128,128,0.4)] rounded-lg text-sm text-white flex items-center transition-all shadow-[rgba(0,0,0,0.15)_0px_4px_8px,rgba(0,210,200,0.1)_0px_0px_3px_inset] min-w-[44px] min-h-[44px]"
              aria-label="Ajouter une caméra"
            >
              <Plus size={16} className="mr-2" />
              Ajouter
            </button>
          </div>
          
          <div className="space-y-3 overflow-auto pr-1" style={{ maxHeight: 'calc(100vh - 230px)' }}>
            {cameras.map((camera) => (
              <div 
                key={camera.id}
                className="rounded-lg backdrop-blur-sm bg-[rgba(0,40,80,0.2)] border border-white/10 transition-all duration-200 hover:border-cyan-500/30 p-4 flex flex-col focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus:outline-none"
                tabIndex={0}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-white">{camera.name}</h3>
                    <p className="text-white/60 text-sm">{camera.ip}</p>
                    <p className="text-white/40 text-xs mt-1">Dernière vue: {camera.lastSeen}</p>
                  </div>
                  <div 
                    className={`px-2 py-1 rounded-full text-xs ${
                      camera.status === 'online' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                      'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {camera.status === 'online' ? 'Connecté' : 'Déconnecté'}
                  </div>
                </div>
                
                <div className="bg-[rgba(0,20,40,0.3)] rounded-lg h-24 overflow-hidden relative">
                  {camera.status === 'online' ? (
                    <div 
                      className="absolute inset-0 bg-center bg-cover"
                      style={{ backgroundImage: `url('/OYSTERCULT/images/camera-feed-${camera.id}.jpg')` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60">
                      <Camera className="mr-2 opacity-50" size={18} />
                      Signal perdu
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                    <div className="flex items-center justify-end">
                      <span className="text-xs text-white/80 bg-black/40 px-1.5 py-0.5 rounded text-right">
                        {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2 mt-3">
                  <button 
                    className="flex-1 bg-[rgba(0,80,110,0.3)] hover:bg-[rgba(0,90,125,0.4)] text-white py-1.5 px-3 rounded-lg flex items-center justify-center text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 min-w-[44px] min-h-[44px]"
                    aria-label={`Voir le flux de ${camera.name}`}
                  >
                    <Eye size={16} className="mr-2" />
                    Voir le flux
                  </button>
                  
                  <button
                    className="bg-[rgba(180,40,40,0.2)] hover:bg-[rgba(180,40,40,0.3)] text-red-300 p-1.5 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 min-w-[44px] min-h-[44px]"
                    aria-label={`Supprimer ${camera.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Colonne 3: Journal d'alertes */}
        <motion.div 
          variants={slideInVariants}
          className={`${glassCardStyles.container} ${glassCardStyles.hoverEffect} p-5`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className={glassCardStyles.heading}>Journal d'alertes</h2>
            <div className="text-sm text-white/60">
              Aujourd'hui, 24 mars
            </div>
          </div>
          
          <div className="space-y-3 overflow-auto pr-1" style={{ maxHeight: 'calc(100vh - 230px)' }}>
            {[
              { id: 1, camera: 'Caméra Bassin #1', time: '16:05', message: 'Mouvement détecté', level: 'warning' },
              { id: 2, camera: 'Caméra Zone de Stockage', time: '15:32', message: 'Objet retiré', level: 'warning' },
              { id: 3, camera: 'Caméra Bassin #1', time: '14:47', message: 'Niveau d\'eau bas', level: 'error' },
              { id: 4, camera: 'Caméra Bassin #2', time: '09:15', message: 'Connexion perdue', level: 'error' },
              { id: 5, camera: 'Caméra Entrée', time: '08:01', message: 'Mouvement détecté', level: 'info' },
            ].map(alert => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg flex items-center bg-[rgba(0,20,40,0.3)] hover:bg-[rgba(0,25,45,0.4)] transition-colors`}
              >
                <div className={`
                  w-10 h-10 rounded-full mr-3 flex items-center justify-center
                  ${alert.level === 'error' ? 'bg-red-500/20 text-red-300' :
                    alert.level === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-blue-500/20 text-blue-300'
                  }
                `}>
                  <AlertTriangle size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">{alert.camera}</span>
                    <span className="text-sm text-white/40">{alert.time}</span>
                  </div>
                  <p className="text-sm mt-0.5 text-white/70">{alert.message}</p>
                </div>
              </div>
            ))}
            
            <button
              className="w-full mt-4 bg-[rgba(0,40,80,0.2)] hover:bg-[rgba(0,50,90,0.3)] text-white/80 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 min-h-[44px]"
              aria-label="Voir toutes les alertes"
            >
              Voir toutes les alertes
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modal d'ajout de caméra */}
      <AnimatePresence>
        {isAddCameraModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsAddCameraModalOpen(false)}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.3}}
            />
            <motion.div 
              className={`relative w-full max-w-md rounded-xl ${glassCardStyles.container} overflow-hidden`}
              initial={{opacity: 0, transform: "translateY(30px)"}}
              animate={{opacity: 1, transform: "translateY(0)"}}
              exit={{opacity: 0, transform: "translateY(30px)"}}
              transition={{duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0]}}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-xl ${glassCardStyles.heading}`}>Ajouter une caméra</h2>
                  <button
                    onClick={() => setIsAddCameraModalOpen(false)}
                    className="rounded-full p-1.5 bg-[rgba(0,40,80,0.3)] hover:bg-[rgba(0,50,90,0.4)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleAddCamera} className="space-y-4">
                  <div>
                    <label htmlFor="camera-name" className="block text-sm font-medium mb-1 text-white/80">Nom</label>
                    <input
                      id="camera-name"
                      name="camera-name"
                      type="text"
                      className="w-full bg-[rgba(0,20,40,0.3)] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                      placeholder="Caméra Entrée"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="camera-location" className="block text-sm font-medium mb-1 text-white/80">Emplacement</label>
                    <input
                      id="camera-location"
                      name="camera-location"
                      type="text"
                      className="w-full bg-[rgba(0,20,40,0.3)] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                      placeholder="Entrée principale"
                    />
                  </div>
                  <div>
                    <label htmlFor="camera-ip" className="block text-sm font-medium mb-1 text-white/80">Adresse IP</label>
                    <input
                      id="camera-ip"
                      name="camera-ip"
                      type="text"
                      className="w-full bg-[rgba(0,20,40,0.3)] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                      placeholder="192.168.1.100:554"
                      pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\:[0-9]{1,5})?$"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="camera-type" className="block text-sm font-medium mb-1 text-white/80">Type</label>
                    <select
                      id="camera-type"
                      name="camera-type"
                      className="w-full bg-[rgba(0,20,40,0.3)] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                      required
                    >
                      <option value="ip">Caméra IP</option>
                      <option value="rtsp">RTSP Stream</option>
                      <option value="hls">HLS Stream</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddCameraModalOpen(false)}
                      className="flex-1 px-4 py-2.5 bg-[rgba(0,20,40,0.3)] hover:bg-[rgba(0,30,50,0.4)] border border-white/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 text-white/80 min-h-[44px]"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 text-white font-medium min-h-[44px]"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SurveillanceSimplePage;
