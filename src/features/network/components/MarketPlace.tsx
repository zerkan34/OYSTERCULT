import React from 'react';
import { Package, MapPin, Clock, DollarSign } from 'lucide-react';

interface MarketItem {
  id: string;
  title: string;
  type: 'offer' | 'request';
  category: string;
  description: string;
  price?: number;
  quantity: number;
  unit: string;
  location: string;
  postedAt: string;
  seller: {
    name: string;
    rating: number;
  };
  image?: string;
}

const mockItems: MarketItem[] = [
  {
    id: '1',
    title: 'Huîtres plates N°3',
    type: 'offer',
    category: 'Huîtres',
    description: 'Lot d\'huîtres plates calibre 3, excellente qualité',
    price: 8.5,
    quantity: 1000,
    unit: 'douzaines',
    location: 'Marennes-Oléron',
    postedAt: '2025-02-19T10:00:00',
    seller: {
      name: 'Huîtres Dupont & Fils',
      rating: 4.8
    },
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62'
  },
  {
    id: '2',
    title: 'Recherche poches d\'élevage',
    type: 'request',
    category: 'Matériel',
    description: 'Recherche poches d\'élevage en bon état',
    quantity: 500,
    unit: 'unités',
    location: 'Cancale',
    postedAt: '2025-02-19T09:00:00',
    seller: {
      name: 'Ostréiculture Martin',
      rating: 4.5
    }
  }
];

interface MarketPlaceProps {
  searchQuery: string;
}

export function MarketPlace({ searchQuery }: MarketPlaceProps) {
  const filteredItems = mockItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
        >
          {item.image && (
            <div className="h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.type === 'offer'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {item.type === 'offer' ? 'Offre' : 'Recherche'}
                </span>
                <h3 className="text-lg font-medium text-white mt-2">{item.title}</h3>
                <div className="flex items-center text-sm text-white/60 mt-1">
                  <Package size={16} className="mr-1" />
                  {item.category}
                </div>
              </div>
              {item.price && (
                <div className="text-xl font-bold text-white">
                  {item.price}€
                  <span className="text-sm text-white/60">/{item.unit}</span>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm text-white/70">{item.description}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-white/60">
                <MapPin size={16} className="mr-2" />
                {item.location}
              </div>
              <div className="flex items-center text-sm text-white/60">
                <Clock size={16} className="mr-2" />
                {new Date(item.postedAt).toLocaleDateString('fr-FR')}
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="flex-1 px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors">
                {item.type === 'offer' ? 'Contacter le vendeur' : 'Proposer'}
              </button>
              <button className="px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                Détails
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}