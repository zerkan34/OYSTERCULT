import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeading } from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Bell, Calendar, Filter, Search, AlertTriangle, Camera, Clock, Eye, X, Check } from 'lucide-react';

export const AlertsPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2025-03-24');
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const alertTypes = [
    { id: 'movement', name: 'Mouvement' },
    { id: 'person', name: 'Personne' },
    { id: 'vehicle', name: 'Véhicule' },
    { id: 'animal', name: 'Animal' },
    { id: 'system', name: 'Système' }
  ];

  const cameras = [
    { id: 'cam1', name: 'Entrée principale' },
    { id: 'cam2', name: 'Parking' },
    { id: 'cam3', name: 'Zone de stockage' },
    { id: 'cam4', name: 'Bassin 1' },
    { id: 'cam5', name: 'Bassin 2' },
    { id: 'cam6', name: 'Bureau principal' },
  ];

  const alerts = [
    { 
      id: 'alert1', 
      camera: 'Parking', 
      cameraId: 'cam2',
      time: '14:30', 
      date: '24/03/2025', 
      type: 'Mouvement', 
      typeId: 'movement',
      description: 'Mouvement détecté dans la zone sensible',
      status: 'new'
    },
    { 
      id: 'alert2', 
      camera: 'Zone de stockage', 
      cameraId: 'cam3',
      time: '12:15', 
      date: '24/03/2025', 
      type: 'Personne', 
      typeId: 'person',
      description: 'Personne non identifiée détectée',
      status: 'new'
    },
    { 
      id: 'alert3', 
      camera: 'Entrée principale', 
      cameraId: 'cam1',
      time: '08:45', 
      date: '24/03/2025', 
      type: 'Véhicule', 
      typeId: 'vehicle',
      description: 'Véhicule non autorisé',
      status: 'viewed'
    },
    { 
      id: 'alert4', 
      camera: 'Bassin 1', 
      cameraId: 'cam4',
      time: '10:20', 
      date: '24/03/2025', 
      type: 'Système', 
      typeId: 'system',
      description: 'Connexion perdue avec la caméra pendant 30 secondes',
      status: 'resolved'
    },
    { 
      id: 'alert5', 
      camera: 'Parking', 
      cameraId: 'cam2',
      time: '16:45', 
      date: '23/03/2025', 
      type: 'Animal', 
      typeId: 'animal',
      description: 'Animal détecté dans la zone',
      status: 'viewed'
    },
    { 
      id: 'alert6', 
      camera: 'Zone de stockage', 
      cameraId: 'cam3',
      time: '17:30', 
      date: '23/03/2025', 
      type: 'Mouvement', 
      typeId: 'movement',
      description: 'Mouvement détecté en dehors des heures d\'ouverture',
      status: 'resolved'
    },
  ];

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const listItemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.05,
        duration: 0.2 
      } 
    }),
    hover: { 
      backgroundColor: 'rgba(255, 255, 255, 0.05)'
    }
  };

  // Filtres pour les alertes
  const filteredAlerts = alerts.filter(alert => {
    if (selectedCamera && alert.cameraId !== selectedCamera) return false;
    if (selectedType && alert.typeId !== selectedType) return false;
    // Formatage de la date pour la comparaison
    const alertDate = new Date(alert.date.split('/').reverse().join('-')).toISOString().split('T')[0];
    if (selectedDate && alertDate !== selectedDate) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-red-500';
      case 'viewed': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'new': return 'Nouveau';
      case 'viewed': return 'Vu';
      case 'resolved': return 'Résolu';
      default: return 'Inconnu';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Mouvement': return 'text-blue-400';
      case 'Personne': return 'text-red-400';
      case 'Véhicule': return 'text-yellow-400';
      case 'Animal': return 'text-green-400';
      case 'Système': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const resetFilters = () => {
    setSelectedCamera(null);
    setSelectedType(null);
    setSelectedDate('2025-03-24');
  };

  return (
    <motion.div 
      className="p-6 max-w-[1600px] mx-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <PageHeading 
        title="Alertes" 
        description="Gestion des alertes de surveillance"
        icon={<Bell className="h-8 w-8 text-red-400" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center flex-wrap gap-4">
              <h3 className="font-semibold text-lg">Liste des alertes</h3>
              <div className="flex items-center space-x-3">
                <div className="relative min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 w-full placeholder-gray-500"
                    aria-label="Rechercher parmi les alertes"
                  />
                </div>
                <Button 
                  onClick={resetFilters}
                  variant="outline" 
                  size="sm"
                  className="text-white/80 border-white/20"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </div>
            
            {/* Filtres */}
            <div className="p-4 border-b border-white/10 flex flex-wrap gap-4 md:items-center">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Date:</span>
              </div>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 min-w-[160px]"
                aria-label="Filtrer par date"
              />
              
              <div className="flex items-center space-x-2 ml-0 md:ml-4">
                <Camera className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Caméra:</span>
              </div>
              <select 
                value={selectedCamera || ''} 
                onChange={(e) => setSelectedCamera(e.target.value || null)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 appearance-none pr-8 min-w-[150px]"
                style={{ 
                  backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em'
                }}
                aria-label="Filtrer par caméra"
              >
                <option value="">Toutes les caméras</option>
                {cameras.map(camera => (
                  <option key={camera.id} value={camera.id}>{camera.name}</option>
                ))}
              </select>
              
              <div className="flex items-center space-x-2 ml-0 md:ml-4">
                <AlertTriangle className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Type:</span>
              </div>
              <select 
                value={selectedType || ''} 
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 appearance-none pr-8 min-w-[150px]"
                style={{ 
                  backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em'
                }}
                aria-label="Filtrer par type d'alerte"
              >
                <option value="">Tous les types</option>
                {alertTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            {/* Liste des alertes */}
            <div className="overflow-y-auto max-h-[550px] custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-block p-3 rounded-full bg-white/5 mb-3">
                    <Bell className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-lg text-gray-300">Aucune alerte trouvée</h3>
                  <p className="text-gray-400 mt-2">Essayez de modifier vos filtres ou de sélectionner une autre date</p>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {filteredAlerts.map((alert, index) => (
                    <motion.li 
                      key={alert.id}
                      custom={index}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      variants={listItemVariants}
                      className={`p-4 transition-colors cursor-pointer ${selectedAlert === alert.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                      onClick={() => setSelectedAlert(alert.id)}
                      aria-label={`Alerte: ${alert.type} - ${alert.camera} - ${alert.time}`}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedAlert(alert.id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${alert.typeId === 'system' ? 'bg-purple-900/20' : 'bg-red-900/20'}`}>
                            <AlertTriangle className={`h-5 w-5 ${getTypeColor(alert.type)}`} />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h4 className={`font-medium ${getTypeColor(alert.type)}`}>{alert.type}</h4>
                              <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusColor(alert.status)} bg-opacity-20 text-white`}>
                                {getStatusText(alert.status)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-400">
                              <Camera className="h-3 w-3 mr-1" />
                              <span>{alert.camera}</span>
                              <span className="mx-2">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{alert.time}, {alert.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-0 overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold text-lg">Détails de l'alerte</h3>
            </div>
            
            {selectedAlert ? (
              <>
                {/* Contenu de l'alerte sélectionnée */}
                {(() => {
                  const alert = alerts.find(a => a.id === selectedAlert);
                  if (!alert) return null;
                  
                  return (
                    <div className="flex-grow flex flex-col">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg ${alert.typeId === 'system' ? 'bg-purple-900/20' : 'bg-red-900/20'}`}>
                              <AlertTriangle className={`h-5 w-5 ${getTypeColor(alert.type)}`} />
                            </div>
                            <div>
                              <h4 className={`font-medium ${getTypeColor(alert.type)}`}>{alert.type}</h4>
                              <p className="text-sm text-gray-300">{alert.camera}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs ${getStatusColor(alert.status)} bg-opacity-20 text-white`}>
                            {getStatusText(alert.status)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 flex-grow">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-400">Description</p>
                            <p className="mt-1">{alert.description}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-400">Date et heure</p>
                            <p className="mt-1">{alert.time}, {alert.date}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-400">Caméra</p>
                            <p className="mt-1">{alert.camera}</p>
                          </div>
                          
                          <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                            {/* Emplacement de la miniature vidéo */}
                            <div className="relative w-full h-full">
                              <div className="absolute inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center">
                                <Camera className="h-12 w-12 text-gray-600" />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Button 
                                  variant="primary"
                                  className="bg-cyan-600 hover:bg-cyan-500"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Voir l'enregistrement
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border-t border-white/10 flex space-x-3">
                        <Button 
                          fullWidth 
                          variant="outline"
                          className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Marquer comme résolu
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-white/20 hover:bg-white/10 min-w-[45px] !p-0 flex items-center justify-center"
                          aria-label="Ignorer l'alerte"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="inline-block p-3 rounded-full bg-white/5 mb-3">
                    <AlertTriangle className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-lg text-gray-300">Aucune alerte sélectionnée</h3>
                  <p className="text-gray-400 mt-2 max-w-md">
                    Sélectionnez une alerte dans la liste pour afficher ses détails
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertsPage;
