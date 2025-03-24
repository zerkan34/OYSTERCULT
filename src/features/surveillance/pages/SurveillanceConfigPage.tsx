import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { AlertCircle, Camera, Plus, Video, Wifi, Check } from "lucide-react";
import { toast } from "@/lib/toast";

// Types pour nos équipements de surveillance
interface SurveillanceDevice {
  id: string;
  name: string;
  type: 'camera' | 'nvr' | 'dvr';
  model: string;
  ipAddress: string;
  port: string;
  username: string;
  password: string;
  status: 'connected' | 'disconnected' | 'pending';
  location: string;
}

const SurveillanceConfigPage: React.FC = () => {
  // State pour gérer la liste des appareils
  const [devices, setDevices] = useState<SurveillanceDevice[]>([
    {
      id: '1',
      name: 'Caméra entrée principale',
      type: 'camera',
      model: 'Hikvision DS-2CD2143G2-I',
      ipAddress: '192.168.1.100',
      port: '554',
      username: 'admin',
      password: '********',
      status: 'connected',
      location: 'Entrée'
    },
    {
      id: '2',
      name: 'NVR Centre',
      type: 'nvr',
      model: 'Hikvision DS-7608NI-K2',
      ipAddress: '192.168.1.200',
      port: '80',
      username: 'admin',
      password: '********',
      status: 'disconnected',
      location: 'Local technique'
    }
  ]);

  // State pour le nouvel appareil
  const [newDevice, setNewDevice] = useState<Omit<SurveillanceDevice, 'id' | 'status'>>({
    name: '',
    type: 'camera',
    model: '',
    ipAddress: '',
    port: '',
    username: '',
    password: '',
    location: ''
  });

  // State pour gérer le formulaire
  const [autoConnect, setAutoConnect] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);

  // Gérer le changement des champs du formulaire
  const handleInputChange = (field: keyof Omit<SurveillanceDevice, 'id' | 'status'>, value: string) => {
    setNewDevice({
      ...newDevice,
      [field]: value
    });
  };

  // Tester la connexion à l'appareil
  const testConnection = () => {
    // Vérifier si les champs obligatoires sont remplis
    if (!newDevice.ipAddress || !newDevice.port) {
      toast.error('Veuillez saisir l\'adresse IP et le port de l\'appareil');
      return;
    }

    setTestingConnection(true);

    // Simuler un test de connexion (à remplacer par une vraie connexion API)
    setTimeout(() => {
      setTestingConnection(false);
      
      // 70% de chance de succès pour la démonstration
      const success = Math.random() > 0.3;
      
      if (success) {
        toast.success(`Connexion établie avec succès à ${newDevice.ipAddress}:${newDevice.port}`);
      } else {
        toast.error(`Impossible de se connecter à ${newDevice.ipAddress}:${newDevice.port}`);
      }
    }, 2000);
  };

  // Ajouter un nouvel appareil
  const addDevice = () => {
    // Vérifier si les champs obligatoires sont remplis
    if (!newDevice.name || !newDevice.ipAddress || !newDevice.port) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Créer le nouvel appareil
    const device: SurveillanceDevice = {
      ...newDevice,
      id: (devices.length + 1).toString(),
      status: autoConnect ? 'connected' : 'disconnected'
    };

    // Ajouter à la liste
    setDevices([...devices, device]);
    
    // Réinitialiser le formulaire
    setNewDevice({
      name: '',
      type: 'camera',
      model: '',
      ipAddress: '',
      port: '',
      username: '',
      password: '',
      location: ''
    });

    toast.success(`${device.name} a été ajouté avec succès`);
  };

  // Supprimer un appareil
  const deleteDevice = (id: string) => {
    const deviceToDelete = devices.find(d => d.id === id);
    
    if (deviceToDelete) {
      setDevices(devices.filter(d => d.id !== id));
      toast.info(`${deviceToDelete.name} a été supprimé`);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Configuration de la surveillance</h1>
      </div>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="devices">Appareils</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="alerts">Configuration des alertes</TabsTrigger>
        </TabsList>
        
        {/* Onglet Appareils */}
        <TabsContent value="devices" className="space-y-6">
          {/* Liste des appareils existants */}
          <Card>
            <CardHeader>
              <CardTitle>Appareils de surveillance</CardTitle>
              <CardDescription>Liste de tous vos équipements de surveillance vidéo connectés</CardDescription>
            </CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                <div className="text-center py-6 text-white/60">
                  <Camera className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>Aucun appareil de surveillance configuré</p>
                  <p className="text-sm">Utilisez le formulaire ci-dessous pour ajouter votre premier appareil</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {devices.map((device) => (
                    <Card key={device.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{device.name}</CardTitle>
                          <div className={`px-2 py-1 rounded text-xs ${
                            device.status === 'connected' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {device.status === 'connected' ? 'Connecté' : 'Déconnecté'}
                          </div>
                        </div>
                        <CardDescription>{device.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm grid grid-cols-2 gap-y-2 pb-0">
                        <div>
                          <span className="text-white/60">Type:</span> 
                          <span className="ml-1">
                            {device.type === 'camera' && 'Caméra'}
                            {device.type === 'nvr' && 'NVR'}
                            {device.type === 'dvr' && 'DVR'}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/60">Modèle:</span> 
                          <span className="ml-1">{device.model}</span>
                        </div>
                        <div>
                          <span className="text-white/60">IP:</span> 
                          <span className="ml-1">{device.ipAddress}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Port:</span> 
                          <span className="ml-1">{device.port}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2 mt-4">
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => {
                            // Code pour visualiser le flux vidéo
                            toast.info("Visualisation du flux non disponible dans cette démo");
                          }}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Visualiser
                        </Button>
                        <Button 
                          variant="secondary"
                          size="sm" 
                          onClick={() => deleteDevice(device.id)}
                        >
                          Supprimer
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulaire d'ajout */}
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un appareil</CardTitle>
              <CardDescription>Connectez un nouvel appareil de surveillance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deviceName">Nom de l'appareil*</Label>
                  <Input 
                    id="deviceName" 
                    placeholder="Ex: Caméra entrée principale" 
                    value={newDevice.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deviceType">Type d'appareil*</Label>
                  <Select 
                    value={newDevice.type} 
                    onValueChange={(value: any) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camera">Caméra IP</SelectItem>
                      <SelectItem value="nvr">Enregistreur NVR</SelectItem>
                      <SelectItem value="dvr">Enregistreur DVR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deviceModel">Modèle</Label>
                  <Input 
                    id="deviceModel" 
                    placeholder="Ex: Hikvision DS-2CD2143G2-I" 
                    value={newDevice.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deviceLocation">Emplacement</Label>
                  <Input 
                    id="deviceLocation" 
                    placeholder="Ex: Entrée principale" 
                    value={newDevice.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Paramètres de connexion</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deviceIp">Adresse IP*</Label>
                    <Input 
                      id="deviceIp" 
                      placeholder="Ex: 192.168.1.100" 
                      value={newDevice.ipAddress}
                      onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="devicePort">Port*</Label>
                    <Input 
                      id="devicePort" 
                      placeholder="Ex: 554 ou 80" 
                      value={newDevice.port}
                      onChange={(e) => handleInputChange('port', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deviceUsername">Nom d'utilisateur</Label>
                    <Input 
                      id="deviceUsername" 
                      placeholder="Ex: admin" 
                      value={newDevice.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="devicePassword">Mot de passe</Label>
                    <Input 
                      id="devicePassword" 
                      type="password" 
                      placeholder="••••••••"
                      value={newDevice.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="autoConnect" 
                  checked={autoConnect}
                  onChange={() => setAutoConnect(!autoConnect)}
                />
                <Label htmlFor="autoConnect" className="cursor-pointer">
                  Connecter automatiquement après l'ajout
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="secondary"
                onClick={testConnection}
                disabled={testingConnection}
              >
                {testingConnection ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Test en cours...
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4 mr-1" />
                    Tester la connexion
                  </>
                )}
              </Button>
              <Button 
                variant="primary"
                onClick={addDevice}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter l'appareil
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Onglet Paramètres */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>Configuration générale du système de surveillance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Enregistrements</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="recordingMotion" />
                  <Label htmlFor="recordingMotion">Enregistrer uniquement sur détection de mouvement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="recordingSchedule" />
                  <Label htmlFor="recordingSchedule">Activer l'enregistrement selon un planning</Label>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium">Stockage</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recordingDuration">Durée de conservation (jours)</Label>
                    <Input id="recordingDuration" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storagePath">Chemin de stockage des enregistrements</Label>
                    <Input id="storagePath" defaultValue="/recordings" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="primary">
                <Check className="h-4 w-4 mr-1" />
                Enregistrer les paramètres
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Onglet Alertes */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des alertes</CardTitle>
              <CardDescription>Gérez les notifications et alertes du système de surveillance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Notifications</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="alertsMotion" />
                  <Label htmlFor="alertsMotion">Alertes sur détection de mouvement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="alertsOffline" />
                  <Label htmlFor="alertsOffline">Alertes si un appareil est hors ligne</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="alertsEmail" />
                  <Label htmlFor="alertsEmail">Envoi des alertes par email</Label>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium">Email</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emailRecipient">Adresse email de réception</Label>
                    <Input id="emailRecipient" type="email" placeholder="exemple@domaine.com" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-amber-500/20 bg-amber-500/10 rounded-lg mt-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-medium text-amber-500">Configuration SMTP</h5>
                    <p className="text-xs text-white/70 mt-1">
                      Pour recevoir des emails, vous devez configurer les paramètres SMTP dans les paramètres système.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="primary">
                <Check className="h-4 w-4 mr-1" />
                Enregistrer la configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurveillanceConfigPage;
