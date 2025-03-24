import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Camera, Plus, Trash2, Check, X, RefreshCw, Eye } from 'lucide-react';
import { toast } from '../../../lib/toast';

// Type simple pour un appareil de surveillance
interface SurveillanceDevice {
  id: string;
  name: string;
  ipAddress: string;
  port: string;
  username: string;
  password: string;
  isConnected: boolean;
  lastSeen?: string;
}

const SurveillancePage: React.FC = () => {
  // État pour les appareils de surveillance - récupération depuis le stockage local si disponible
  const [devices, setDevices] = useState<SurveillanceDevice[]>(() => {
    const savedDevices = localStorage.getItem('surveillanceDevices');
    return savedDevices ? JSON.parse(savedDevices) : [
      {
        id: '1',
        name: 'Caméra entrée',
        ipAddress: '192.168.1.100',
        port: '554',
        username: 'admin',
        password: '********',
        isConnected: true,
        lastSeen: new Date().toISOString()
      }
    ];
  });

  // État pour le nouvel appareil
  const [newDevice, setNewDevice] = useState<Omit<SurveillanceDevice, 'id' | 'isConnected'>>({
    name: '',
    ipAddress: '',
    port: '554', // Port par défaut
    username: 'admin', // Valeur par défaut
    password: ''
  });

  // État pour afficher/masquer le formulaire
  const [showForm, setShowForm] = useState(false);
  // État pour le test de connexion
  const [testingConnection, setTestingConnection] = useState(false);
  // État pour indiquer le chargement de la page
  const [loading, setLoading] = useState(true);

  // Sauvegarde des appareils dans le stockage local quand ils changent
  useEffect(() => {
    localStorage.setItem('surveillanceDevices', JSON.stringify(devices));
  }, [devices]);

  // Simulation du chargement initial
  useEffect(() => {
    // Simulation d'un chargement de données
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Gérer les changements dans le formulaire
  const handleInputChange = (field: keyof Omit<SurveillanceDevice, 'id' | 'isConnected'>, value: string) => {
    setNewDevice({
      ...newDevice,
      [field]: value
    });
  };

  // Tester la connexion
  const testConnection = () => {
    if (!newDevice.ipAddress || !newDevice.port) {
      toast.error('Veuillez saisir l\'adresse IP et le port');
      return;
    }

    setTestingConnection(true);

    // Simulation d'un test de connexion (à remplacer par API réelle)
    setTimeout(() => {
      setTestingConnection(false);
      const success = Math.random() > 0.2;
      
      if (success) {
        toast.success(`Connexion réussie à ${newDevice.ipAddress}:${newDevice.port}`);
      } else {
        toast.error(`Échec de connexion à ${newDevice.ipAddress}:${newDevice.port}`);
      }
    }, 1500);
  };

  // Ajouter un nouvel appareil
  const addDevice = () => {
    if (!newDevice.name || !newDevice.ipAddress) {
      toast.error('Veuillez saisir au moins le nom et l\'adresse IP');
      return;
    }

    const device: SurveillanceDevice = {
      ...newDevice,
      id: Date.now().toString(),
      isConnected: true,
      lastSeen: new Date().toISOString()
    };

    setDevices([...devices, device]);
    
    // Réinitialiser le formulaire
    setNewDevice({
      name: '',
      ipAddress: '',
      port: '554',
      username: 'admin',
      password: ''
    });
    
    setShowForm(false);
    toast.success(`${device.name} ajouté avec succès`);
  };

  // Supprimer un appareil
  const deleteDevice = (id: string) => {
    const deviceToDelete = devices.find(d => d.id === id);
    
    if (deviceToDelete) {
      setDevices(devices.filter(d => d.id !== id));
      toast.info(`${deviceToDelete.name} supprimé`);
    }
  };

  // Voir le flux d'une caméra (simulation)
  const viewCamera = (device: SurveillanceDevice) => {
    toast.info(`Ouverture du flux de ${device.name}...`);
    
    // Simulation d'un chargement de flux
    setTimeout(() => {
      // Mise à jour de l'état "dernière vue"
      const updatedDevices = devices.map(d => 
        d.id === device.id 
          ? { ...d, lastSeen: new Date().toISOString() } 
          : d
      );
      setDevices(updatedDevices);
      
      // Dans une implémentation réelle, cela pourrait ouvrir une fenêtre modale avec le flux
      toast.success(`Flux de ${device.name} prêt à être affiché`);
    }, 1200);
  };

  // Fonction pour formater la date de dernière vue
  const formatLastSeen = (dateString?: string) => {
    if (!dateString) return 'Jamais';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-lg text-white/70">Chargement des appareils de surveillance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Surveillance Vidéo</h1>
        <Button 
          onClick={() => setShowForm(!showForm)}
          aria-label={showForm ? "Annuler l'ajout d'une caméra" : "Ajouter une caméra"}
          className="min-w-[44px] min-h-[44px]"
        >
          {showForm ? <X className="mr-2" /> : <Plus className="mr-2" />}
          {showForm ? 'Annuler' : 'Ajouter une caméra'}
        </Button>
      </div>

      {/* Formulaire d'ajout simplifié */}
      {showForm && (
        <Card className="p-4 mb-6 border border-blue-500/30">
          <h2 className="text-lg font-semibold mb-4">Connecter un nouvel appareil</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="col-span-2">
              <Label htmlFor="name">Nom de l'appareil</Label>
              <Input
                id="name"
                value={newDevice.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Caméra entrée"
                className="mt-1"
                aria-required="true"
              />
            </div>
            <div>
              <Label htmlFor="ipAddress">Adresse IP</Label>
              <Input
                id="ipAddress"
                value={newDevice.ipAddress}
                onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                placeholder="192.168.1.100"
                className="mt-1"
                aria-required="true"
              />
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={newDevice.port}
                onChange={(e) => handleInputChange('port', e.target.value)}
                placeholder="554"
                className="mt-1"
                aria-required="true"
              />
            </div>
            <div>
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                value={newDevice.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="admin"
                className="mt-1"
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={newDevice.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 col-span-2 mt-2">
              <Button
                variant="outline"
                onClick={testConnection}
                disabled={testingConnection}
                aria-label="Tester la connexion"
                className="min-w-[44px] min-h-[44px]"
              >
                {testingConnection ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Tester la connexion
              </Button>
              <Button 
                onClick={addDevice} 
                aria-label="Ajouter la caméra" 
                className="min-w-[44px] min-h-[44px]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Liste des appareils */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Vos appareils ({devices.length})</h2>
        
        {devices.length === 0 ? (
          <div className="text-center p-8 bg-black/20 rounded-lg border border-white/10">
            <Camera className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p className="text-white/70">Aucun appareil de surveillance connecté</p>
            <p className="text-sm text-white/50 mb-4">Cliquez sur "Ajouter une caméra" pour commencer</p>
            <Button 
              onClick={() => setShowForm(true)} 
              aria-label="Ajouter une caméra"
              className="min-w-[44px] min-h-[44px]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une caméra
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {devices.map((device) => (
              <Card key={device.id} className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{device.name}</h3>
                    <p className="text-white/60 text-sm">{device.ipAddress}:{device.port}</p>
                    <p className="text-white/40 text-xs mt-1">
                      Dernière vue: {formatLastSeen(device.lastSeen)}
                    </p>
                  </div>
                  <div 
                    className={`px-2 py-1 rounded-full text-xs ${
                      device.isConnected 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {device.isConnected ? 'Connecté' : 'Déconnecté'}
                  </div>
                </div>
                
                <div className="mt-auto flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 min-w-[44px] min-h-[44px]"
                    onClick={() => viewCamera(device)}
                    aria-label={`Voir le flux de ${device.name}`}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Voir
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-300 min-w-[44px] min-h-[44px]"
                    onClick={() => deleteDevice(device.id)}
                    aria-label={`Supprimer ${device.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveillancePage;
