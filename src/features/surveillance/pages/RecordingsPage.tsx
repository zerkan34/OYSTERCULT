import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeading } from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Video, Calendar, Clock, Search, Download, Trash2, Play, Pause, Filter } from 'lucide-react';

export const RecordingsPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2025-03-24');
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const recordings = [
    { id: 'rec1', camera: 'Entrée principale', date: '2025-03-24', startTime: '08:00', endTime: '08:15', duration: '15min', size: '45MB', thumbnail: '' },
    { id: 'rec2', camera: 'Parking', date: '2025-03-24', startTime: '09:30', endTime: '09:45', duration: '15min', size: '48MB', thumbnail: '' },
    { id: 'rec3', camera: 'Zone de stockage', date: '2025-03-24', startTime: '10:15', endTime: '10:30', duration: '15min', size: '42MB', thumbnail: '' },
    { id: 'rec4', camera: 'Bassin 1', date: '2025-03-24', startTime: '11:00', endTime: '11:15', duration: '15min', size: '46MB', thumbnail: '' },
    { id: 'rec5', camera: 'Bassin 2', date: '2025-03-24', startTime: '12:30', endTime: '12:45', duration: '15min', size: '47MB', thumbnail: '' },
    { id: 'rec6', camera: 'Entrée principale', date: '2025-03-24', startTime: '14:00', endTime: '14:15', duration: '15min', size: '45MB', thumbnail: '' },
  ];

  const cameras = [
    { id: 'cam1', name: 'Entrée principale' },
    { id: 'cam2', name: 'Parking' },
    { id: 'cam3', name: 'Zone de stockage' },
    { id: 'cam4', name: 'Bassin 1' },
    { id: 'cam5', name: 'Bassin 2' },
    { id: 'cam6', name: 'Bureau principal' },
  ];

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const tableRowVariants = {
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

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
        title="Enregistrements" 
        description="Accédez aux vidéos enregistrées par le système de surveillance"
        icon={<Video className="h-8 w-8 text-cyan-400" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Vidéos enregistrées</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 w-full placeholder-gray-500"
                    aria-label="Rechercher dans les enregistrements"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-white/80 border-white/20"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
              </div>
            </div>
            
            <div className="p-4 border-b border-white/10 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Date:</span>
              </div>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                aria-label="Sélectionner une date"
              />
              
              <div className="flex items-center space-x-2 ml-4">
                <Video className="w-4 h-4 text-gray-400" />
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
                aria-label="Sélectionner une caméra"
              >
                <option value="">Toutes les caméras</option>
                {cameras.map(camera => (
                  <option key={camera.id} value={camera.id}>{camera.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Caméra</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Heure</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Durée</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Taille</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recordings.map((recording, index) => (
                      <motion.tr 
                        key={recording.id}
                        custom={index}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        variants={tableRowVariants}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-2">
                              <div className="text-sm font-medium">{recording.camera}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{formatDate(recording.date)}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{recording.startTime} - {recording.endTime}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{recording.duration}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{recording.size}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1.5 rounded hover:bg-white/10" aria-label="Lire l'enregistrement">
                              <Play className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-white/10" aria-label="Télécharger l'enregistrement">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-red-900/20 text-red-400" aria-label="Supprimer l'enregistrement">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-0 overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold text-lg">Lecteur vidéo</h3>
            </div>
            
            <div className="flex-grow p-4 flex flex-col">
              <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center mb-4">
                {/* Placeholder pour le lecteur vidéo */}
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-600" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400 font-medium">Sélectionnez un enregistrement</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mt-auto">
                {/* Contrôles du lecteur */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">00:00</span>
                  <div className="relative flex-grow mx-4">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full w-0"></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">15:00</span>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    className="p-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                    aria-label="Reculer de 10 secondes"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                      <path d="M11 12h4"></path>
                      <path d="M11 16v-8h4"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={togglePlayback}
                    className="p-3 rounded-full bg-cyan-600 hover:bg-cyan-500 transition-colors"
                    aria-label={isPlaying ? "Mettre en pause" : "Lire"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button 
                    className="p-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                    aria-label="Avancer de 10 secondes"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                      <path d="M12 12h4"></path>
                      <path d="M12 16v-8h4"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-white/10">
              <Button 
                fullWidth 
                variant="outline"
                className="text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger cet enregistrement
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default RecordingsPage;
