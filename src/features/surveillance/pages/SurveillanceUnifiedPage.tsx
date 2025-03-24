import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Calendar, Filter, Download, Trash2, Play, Pause, 
  Settings, Eye, Power, Edit2, Plus, AlertTriangle, Check, X
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { PageHeading } from '../../../components/ui/PageHeading';

const SurveillanceUnifiedPage = () => {
  // États
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  // Données
  const cameras = [
    { id: 'cam1', name: 'Caméra Entrée', status: 'active', location: 'Entrée principale', ipAddress: '192.168.1.100', model: 'HD 1080p' },
    { id: 'cam2', name: 'Caméra Hall', status: 'active', location: 'Hall d\'accueil', ipAddress: '192.168.1.101', model: '4K UHD' },
    { id: 'cam3', name: 'Caméra Stockage', status: 'inactive', location: 'Zone de stockage', ipAddress: '192.168.1.102', model: 'HD 1080p' },
    { id: 'cam4', name: 'Caméra Parking', status: 'active', location: 'Parking extérieur', ipAddress: '192.168.1.103', model: 'HD 720p' },
  ];

  const recordings = [
    { id: 'rec1', camera: 'Caméra Entrée', date: '2023-04-12', startTime: '08:30', endTime: '08:45', duration: '15 min', size: '45 MB' },
    { id: 'rec2', camera: 'Caméra Hall', date: '2023-04-12', startTime: '09:15', endTime: '09:30', duration: '15 min', size: '50 MB' },
    { id: 'rec3', camera: 'Caméra Stockage', date: '2023-04-11', startTime: '14:00', endTime: '14:30', duration: '30 min', size: '90 MB' },
    { id: 'rec4', camera: 'Caméra Parking', date: '2023-04-10', startTime: '18:45', endTime: '19:00', duration: '15 min', size: '40 MB' },
  ];

  const alerts = [
    { id: 'alert1', camera: 'Caméra Entrée', type: 'Mouvement', status: 'new', date: '2023-04-12', time: '08:35', description: 'Mouvement détecté à l\'entrée principale' },
    { id: 'alert2', camera: 'Caméra Hall', type: 'Personne', status: 'viewed', date: '2023-04-12', time: '09:20', description: 'Personne non identifiée dans le hall' },
    { id: 'alert3', camera: 'Caméra Stockage', type: 'Mouvement', status: 'resolved', date: '2023-04-11', time: '14:15', description: 'Mouvement dans la zone de stockage' },
  ];

  const alertTypes = [
    { id: 'movement', name: 'Mouvement' },
    { id: 'person', name: 'Personne' },
    { id: 'sound', name: 'Son' },
    { id: 'tamper', name: 'Altération' },
  ];

  // Métriques
  const totalCameras = cameras.length;
  const activeCameras = cameras.filter(camera => camera.status === 'active').length;
  const totalRecordings = recordings.length;
  const newAlerts = alerts.filter(alert => alert.status === 'new').length;

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de recherche
    console.log('Recherche:', searchQuery);
  };

  const resetFilters = () => {
    setSelectedDate('');
    setSelectedCamera(null);
    setSelectedType(null);
    setSearchQuery('');
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6 space-y-8"
    >
      <PageHeading
        title="Surveillance"
        description="Gérez vos caméras, visionnez les enregistrements et surveillez les alertes"
      />

      {/* Vue d'ensemble - Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-lg font-medium text-gray-300 mb-1">Caméras actives</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">
              {activeCameras}/{totalCameras}
            </p>
            <div className="flex h-8 items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span className="text-sm text-gray-400">En ligne</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-700 h-1 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full" style={{ width: `${(activeCameras / totalCameras) * 100}%` }}></div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium text-gray-300 mb-1">Enregistrements</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">{totalRecordings}</p>
            <div className="text-sm text-gray-400">Derniers 7 jours</div>
          </div>
          <div className="mt-2 flex space-x-1">
            {[0.2, 0.5, 0.7, 0.4, 0.6, 0.3, 0.8].map((value, index) => (
              <div key={index} className="flex-1 bg-gray-700 rounded-sm overflow-hidden">
                <div className="bg-cyan-400 h-8" style={{ height: `${value * 40}px` }}></div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium text-gray-300 mb-1">Alertes</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">{newAlerts} <span className="text-sm text-gray-400 font-normal">nouvelles</span></p>
            <div className="text-sm text-red-400 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              Non résolues
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <div className="h-2 bg-red-500 rounded-full" style={{ width: '40%' }}></div>
            <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '30%' }}></div>
            <div className="h-2 bg-green-500 rounded-full" style={{ width: '30%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>Critiques</span>
            <span>En attente</span>
            <span>Résolues</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium text-gray-300 mb-1">Stockage</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">1.8 <span className="text-sm text-gray-400 font-normal">To</span></p>
            <div className="text-sm text-gray-400">Capacité 5 To</div>
          </div>
          <div className="mt-2 w-full bg-gray-700 h-1 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full" style={{ width: '36%' }}></div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="bg-gray-700 rounded p-1">
                <p className="font-medium">Aujourd'hui</p>
                <p>120 Mo</p>
              </div>
            </div>
            <div>
              <div className="bg-gray-700 rounded p-1">
                <p className="font-medium">Semaine</p>
                <p>850 Mo</p>
              </div>
            </div>
            <div>
              <div className="bg-gray-700 rounded p-1">
                <p className="font-medium">Mois</p>
                <p>3.2 Go</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Section Caméras */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
          <h2 className="text-xl font-bold mb-4">Caméras</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              variant="primary" 
              size="sm" 
              className="flex items-center"
              aria-label="Ajouter une caméra"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une caméra
            </Button>
            <div className="flex items-center w-full sm:w-auto">
              <form className="relative w-full sm:w-auto" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Rechercher une caméra..."
                  className="bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Rechercher une caméra"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cameras.map(camera => (
            <Card key={camera.id} className="overflow-hidden">
              <div className="relative">
                <div 
                  className="bg-gray-800 h-48 flex items-center justify-center"
                  aria-label={`Flux vidéo de la caméra ${camera.name}`}
                >
                  {camera.status === 'active' ? (
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-green-500 mx-auto mb-2"></div>
                      <p className="text-sm font-medium">Flux en direct</p>
                      <p className="text-xs text-gray-400">{camera.ipAddress}</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500 mx-auto mb-2"></div>
                      <p className="text-sm font-medium">Hors ligne</p>
                      <p className="text-xs text-gray-400">{camera.ipAddress}</p>
                    </motion.div>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <div className="flex space-x-2">
                    <button 
                      className="p-1.5 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70"
                      aria-label={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
                      onClick={toggleFullscreen}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1.5 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70"
                      aria-label="Afficher les paramètres de la caméra"
                      onClick={() => showSettings === camera.id ? setShowSettings(null) : setShowSettings(camera.id)}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {showSettings === camera.id && (
                  <div className="absolute top-12 right-2 bg-black/90 backdrop-blur-md p-2 rounded-lg shadow-xl z-10">
                    <div className="flex flex-col space-y-1">
                      <button 
                        className="flex items-center p-2 rounded hover:bg-white/10 text-sm"
                        aria-label="Modifier les paramètres de la caméra"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        <span>Modifier</span>
                      </button>
                      <button 
                        className="flex items-center p-2 rounded hover:bg-white/10 text-sm"
                        aria-label={camera.status === 'active' ? "Désactiver la caméra" : "Activer la caméra"}
                      >
                        <Power className="w-4 h-4 mr-2" />
                        <span>{camera.status === 'active' ? "Désactiver" : "Activer"}</span>
                      </button>
                      <button 
                        className="flex items-center p-2 rounded hover:bg-red-900/50 text-sm text-red-400"
                        aria-label="Supprimer la caméra"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center">
                    <div className={`w-2 h-2 mr-2 rounded-full ${camera.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {camera.name}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-white/10 rounded">
                    {camera.model}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{camera.location}</p>
                <p className="text-xs text-gray-500 mt-1">{camera.ipAddress}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section Enregistrements */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
          <h2 className="text-xl font-bold mb-4">Enregistrements récents</h2>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="relative">
              <input
                id="date-select"
                type="date"
                className="bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm w-full"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                aria-label="Filtrer par date"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <select
              id="camera-select"
              className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm"
              value={selectedCamera || ''}
              onChange={(e) => setSelectedCamera(e.target.value === '' ? null : e.target.value)}
              aria-label="Filtrer par caméra"
            >
              <option value="">Toutes les caméras</option>
              {cameras.map(camera => (
                <option key={camera.id} value={camera.id}>{camera.name}</option>
              ))}
            </select>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 flex items-center whitespace-nowrap"
              onClick={resetFilters}
              aria-label="Réinitialiser les filtres"
            >
              <Filter className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recordings.map(recording => (
            <Card key={recording.id} className="overflow-hidden">
              <div className="relative">
                <div 
                  className="bg-gray-800 h-36 flex items-center justify-center cursor-pointer"
                  onClick={togglePlayback}
                  aria-label={`Lire l'enregistrement de ${recording.camera} du ${recording.date} à ${recording.startTime}`}
                  role="button"
                  tabIndex={0}
                >
                  {!isPlaying ? (
                    <Play className="w-10 h-10 text-white opacity-80 hover:opacity-100" />
                  ) : (
                    <Pause className="w-10 h-10 text-white opacity-80 hover:opacity-100" />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>{recording.startTime} - {recording.endTime}</span>
                    <span>{recording.duration}</span>
                  </div>
                  <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full w-1/3"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{recording.camera}</h3>
                  <span className="text-xs text-gray-400">{recording.size}</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{recording.date}</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 flex items-center justify-center"
                    aria-label="Télécharger l'enregistrement"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Télécharger</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center justify-center aspect-square"
                    aria-label="Supprimer l'enregistrement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section Alertes */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
          <h2 className="text-xl font-bold mb-4">Alertes récentes</h2>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <select
              id="alert-type-select"
              className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm"
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value === '' ? null : e.target.value)}
              aria-label="Filtrer par type d'alerte"
            >
              <option value="">Tous types</option>
              {alertTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <form className="relative" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Rechercher une alerte"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>
        </div>

        <div className="space-y-3">
          {alerts.map(alert => (
            <Card 
              key={alert.id} 
              className={`overflow-hidden cursor-pointer transition-all hover:bg-white/5 ${
                alert.status === 'new' ? 'border-red-500/50 bg-red-900/10' : 
                alert.status === 'viewed' ? 'border-yellow-500/30' : ''
              }`}
              onClick={() => setSelectedAlert(alert.id)}
              role="button"
              tabIndex={0}
              aria-label={`Voir les détails de l'alerte: ${alert.description}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      alert.status === 'new' ? 'bg-red-500/20 text-red-400' : 
                      alert.status === 'viewed' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-green-500/20 text-green-400'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {alert.camera}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                          {alert.type}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-400">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.date} • {alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.status === 'new' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1.5 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Marquer comme vu
                        }}
                        aria-label="Marquer comme vu"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1.5 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Marquer comme résolu
                      }}
                      aria-label="Marquer comme résolu"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SurveillanceUnifiedPage;
