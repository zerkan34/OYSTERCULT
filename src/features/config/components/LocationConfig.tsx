import React, { useState } from 'react';
import { Map, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  type: string;
  capacity: number;
  currentOccupancy: number;
  cordCount: number;
  cordLength: number;
  oystersPerCord: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  status: 'active' | 'maintenance' | 'inactive';
}

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Zone Nord',
    type: 'table',
    capacity: 100,
    currentOccupancy: 0,
    cordCount: 10,
    cordLength: 3,
    oystersPerCord: 130,
    coordinates: {
      latitude: 46.1558,
      longitude: -1.1532
    },
    status: 'active'
  },
  {
    id: '2',
    name: 'Zone Sud',
    type: 'table',
    capacity: 100,
    currentOccupancy: 0,
    cordCount: 10,
    cordLength: 3,
    oystersPerCord: 130,
    coordinates: {
      latitude: 46.1498,
      longitude: -1.1502
    },
    status: 'active'
  }
];

export function LocationConfig() {
  const [showNewLocation, setShowNewLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [locations, setLocations] = useState(mockLocations);

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setShowNewLocation(true);
  };

  const handleDelete = (locationId: string) => {
    setLocations(locations.filter(l => l.id !== locationId));
    setShowDeleteConfirm(null);
  };

  const handleSave = (data: Partial<Location>) => {
    if (editingLocation) {
      // Update existing location
      setLocations(locations.map(l => 
        l.id === editingLocation.id ? { ...l, ...data } : l
      ));
    } else {
      // Create new location
      const newLocation = {
        id: crypto.randomUUID(),
        ...data as Location
      };
      setLocations([...locations, newLocation]);
    }
    setShowNewLocation(false);
    setEditingLocation(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Emplacements des tables</h2>
        <button
          onClick={() => {
            setEditingLocation(null);
            setShowNewLocation(true);
          }}
          className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Configuration table
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-brand-primary/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                  <Map size={20} className="text-brand-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-white">{location.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      location.status === 'active'
                        ? 'bg-green-500/20 text-green-300'
                        : location.status === 'maintenance'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {location.status === 'active'
                        ? 'Actif'
                        : location.status === 'maintenance'
                        ? 'Maintenance'
                        : 'Inactif'}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm text-white/60">Type</div>
                      <div className="text-white">{location.type}</div>
                      
                      <div className="text-sm text-white/60 mt-4">Nombre de perches</div>
                      <div className="text-white">{location.capacity}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-white/60">Nombre de corde par perches</div>
                      <div className="text-white">{location.cordCount}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(location)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Edit2 size={20} className="text-white/60" />
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(location.id)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="text-white/60" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-md">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Confirmer la suppression</h3>
                <p className="mt-2 text-sm text-white/70">
                  Êtes-vous sûr de vouloir supprimer cet emplacement ? Cette action est irréversible.
                </p>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewLocation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingLocation ? 'Modifier la table' : 'Nouvelle table'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('name') as string,
                type: formData.get('type') as string,
                capacity: Number(formData.get('capacity')), 
                cordCount: Number(formData.get('cordCount')), 
                cordLength: Number(formData.get('cordLength')), 
                oystersPerCord: Number(formData.get('oystersPerCord')), 
                coordinates: {
                  latitude: Number(formData.get('latitude')),
                  longitude: Number(formData.get('longitude'))
                }
              };
              handleSave(data);
            }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nom de l'emplacement
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="Ex: Table Nord"
                    defaultValue={editingLocation?.name}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Type
                  </label>
                  <select 
                    name="type"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    defaultValue={editingLocation?.type || "table"}
                    required
                  >
                    <option value="table">Table</option>
                    <option value="tableTrempe">Table de trempe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nombre de perches
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    defaultValue={editingLocation?.capacity || 100}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nombre de corde par perches
                  </label>
                  <input
                    type="number"
                    name="cordCount"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    defaultValue={editingLocation?.cordCount || 10}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Longueur de corde
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="cordLength"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-l-lg text-white"
                      defaultValue={editingLocation?.cordLength || 3}
                      required
                    />
                    <span className="bg-white/10 px-3 py-2 rounded-r-lg text-white/60">mètres</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nombre d'huîtres par pochons
                  </label>
                  <input
                    type="number"
                    name="oystersPerCord"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    defaultValue={editingLocation?.oystersPerCord || 130}
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-3">Coordonnées GPS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      step="0.0001"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      defaultValue={editingLocation?.coordinates?.latitude}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      step="0.0001"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      defaultValue={editingLocation?.coordinates?.longitude}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewLocation(false);
                    setEditingLocation(null);
                  }}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  {editingLocation ? 'Mettre à jour' : 'Créer table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}