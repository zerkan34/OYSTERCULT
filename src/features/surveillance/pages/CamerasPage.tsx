import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeading } from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Camera, Settings, Plus, MoreVertical, Power, Trash2, Edit2 } from 'lucide-react';

export const CamerasPage = () => {
  const [showSettings, setShowSettings] = useState<string | null>(null);

  const cameras = [
    { id: 'cam1', name: 'Entrée principale', location: 'Extérieur', status: 'active', ipAddress: '192.168.1.101', model: 'Oyster Pro 4K' },
    { id: 'cam2', name: 'Parking', location: 'Extérieur', status: 'active', ipAddress: '192.168.1.102', model: 'Oyster Pro 4K' },
    { id: 'cam3', name: 'Zone de stockage', location: 'Intérieur', status: 'active', ipAddress: '192.168.1.103', model: 'Oyster Pro 4K' },
    { id: 'cam4', name: 'Bassin 1', location: 'Zone de purification', status: 'active', ipAddress: '192.168.1.104', model: 'Oyster Pro 2K' },
    { id: 'cam5', name: 'Bassin 2', location: 'Zone de purification', status: 'active', ipAddress: '192.168.1.105', model: 'Oyster Pro 2K' },
    { id: 'cam6', name: 'Bureau principal', location: 'Administration', status: 'inactive', ipAddress: '192.168.1.106', model: 'Oyster Pro 2K' },
  ];

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.3 
      } 
    }),
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  const toggleSettings = (cameraId: string) => {
    if (showSettings === cameraId) {
      setShowSettings(null);
    } else {
      setShowSettings(cameraId);
    }
  };

  return (
    <motion.div 
      className="p-6 max-w-[1600px] mx-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <PageHeading 
          title="Gestion des caméras" 
          description="Configuration et statut des caméras de surveillance"
          icon={<Camera className="h-8 w-8 text-cyan-400" />}
        />
        
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une caméra
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {cameras.map((camera, index) => (
          <motion.div 
            key={camera.id}
            custom={index}
            initial="initial"
            animate="animate"
            whileHover="hover"
            variants={cardVariants}
          >
            <Card className="overflow-hidden h-full flex flex-col">
              <div className="relative p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{camera.name}</h3>
                  <div className="relative">
                    <button 
                      onClick={() => toggleSettings(camera.id)} 
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Options de la caméra"
                      aria-expanded={showSettings === camera.id}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {showSettings === camera.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-white/10 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="py-1">
                          <button 
                            className="flex items-center px-4 py-2 text-sm hover:bg-white/10 w-full text-left transition-colors"
                            aria-label="Modifier la caméra"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Modifier
                          </button>
                          <button 
                            className="flex items-center px-4 py-2 text-sm hover:bg-white/10 w-full text-left transition-colors"
                            aria-label={`${camera.status === 'active' ? 'Désactiver' : 'Activer'} la caméra`}
                          >
                            <Power className="w-4 h-4 mr-2" />
                            {camera.status === 'active' ? 'Désactiver' : 'Activer'}
                          </button>
                          <button 
                            className="flex items-center px-4 py-2 text-sm hover:bg-red-700/20 w-full text-left text-red-400 transition-colors"
                            aria-label="Supprimer la caméra"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${camera.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="ml-2 text-sm text-gray-300">
                      {camera.status === 'active' ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{camera.location}</span>
                </div>
              </div>
              
              <div className="p-4 flex-grow">
                <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center mb-4">
                  <div className="relative w-full h-full">
                    {/* Placeholder pour l'aperçu de la caméra */}
                    <div className="absolute inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-600" />
                    </div>
                    {camera.status === 'inactive' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-red-400 font-medium bg-black/50 px-4 py-2 rounded-lg">Caméra hors ligne</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Adresse IP</p>
                    <p className="font-mono">{camera.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Modèle</p>
                    <p>{camera.model}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-white/10 flex justify-between">
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                >
                  Voir flux
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-white/80 border-white/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurer
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CamerasPage;
