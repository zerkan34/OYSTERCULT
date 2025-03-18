import React, { useState } from 'react';
import { Droplets, Thermometer, Package, Map } from 'lucide-react';
import { motion } from 'framer-motion';

interface StorageLocation {
  id: string;
  name: string;
  type: 'frigo' | 'congélateur' | 'remise';
  capacity: number;
  occupation: number;
  icon: 'droplets' | 'thermometer' | 'package' | 'map';
}

const mockLocations: StorageLocation[] = [
  {
    id: '1',
    name: 'Frigo 1',
    type: 'frigo',
    capacity: 500,
    occupation: 65,
    icon: 'droplets'
  },
  {
    id: '2',
    name: 'Frigo 2',
    type: 'frigo',
    capacity: 300,
    occupation: 30,
    icon: 'droplets'
  },
  {
    id: '3',
    name: 'Congélateur 1',
    type: 'congélateur',
    capacity: 200,
    occupation: 85,
    icon: 'thermometer'
  },
  {
    id: '4',
    name: 'Congélateur 2',
    type: 'congélateur',
    capacity: 150,
    occupation: 40,
    icon: 'thermometer'
  },
  {
    id: '5',
    name: 'Remise',
    type: 'remise',
    capacity: 1000,
    occupation: 55,
    icon: 'package'
  },
  {
    id: '6',
    name: 'Cave',
    type: 'remise',
    capacity: 800,
    occupation: 25,
    icon: 'map'
  }
];

const getIconComponent = (iconName: StorageLocation['icon'], className: string) => {
  switch (iconName) {
    case 'droplets':
      return <Droplets className={className} />;
    case 'thermometer':
      return <Thermometer className={className} />;
    case 'package':
      return <Package className={className} />;
    case 'map':
      return <Map className={className} />;
  }
};

const getTypeColor = (type: StorageLocation['type']) => {
  switch (type) {
    case 'frigo':
      return 'blue';
    case 'congélateur':
      return 'cyan';
    case 'remise':
      return type === 'remise' ? 'amber' : 'purple';
    default:
      return 'blue';
  }
};

export const OtherLocations: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockLocations.map((location) => {
        const colorName = getTypeColor(location.type);
        return (
          <div
            key={location.id}
            className="relative p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors cursor-pointer group"
            onClick={() => setSelectedLocation(location.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-md bg-${colorName}-500/20 flex items-center justify-center mr-3`}>
                  {getIconComponent(location.icon, `text-${colorName}-400`)}
                </div>
                <h3 className="text-white font-medium">{location.name}</h3>
              </div>
              <div className={`bg-${colorName}-500/20 text-${colorName}-400 text-xs px-2 py-1 rounded-full`}>
                {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Capacité</span>
                <span className="text-white">{location.capacity} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Occupation</span>
                <span className="text-white">{location.occupation}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className={`bg-${colorName}-400 h-full rounded-full`}
                  style={{ width: `${location.occupation}%` }}
                />
              </div>
              <div className="hidden group-hover:block mt-3">
                <p className="text-xs text-white/70 italic">
                  Cliquez pour voir les produits stockés
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
