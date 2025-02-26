import React, { useState } from 'react';
import { Package, AlertTriangle, MoreVertical, Edit, Trash2, History } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  location: string;
  lastRestockDate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const mockItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Huîtres Plates',
    sku: 'HP-001',
    category: 'Huîtres',
    currentStock: 850,
    minimumStock: 200,
    unit: 'douzaines',
    location: 'Zone A',
    lastRestockDate: '2025-02-15',
    status: 'in_stock'
  },
  {
    id: '2',
    name: 'Huîtres Creuses',
    sku: 'HC-001',
    category: 'Huîtres',
    currentStock: 150,
    minimumStock: 300,
    unit: 'douzaines',
    location: 'Zone B',
    lastRestockDate: '2025-02-10',
    status: 'low_stock'
  }
];

interface InventoryListProps {
  searchQuery: string;
}

export function InventoryList({ searchQuery }: InventoryListProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filteredItems = mockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-medium text-white">Articles en Stock</h3>
      </div>
      
      <div className="divide-y divide-white/10">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg ${
                  item.status === 'low_stock'
                    ? 'bg-yellow-500/20'
                    : item.status === 'out_of_stock'
                    ? 'bg-red-500/20'
                    : 'bg-white/5'
                } flex items-center justify-center`}>
                  {item.status === 'low_stock' || item.status === 'out_of_stock' ? (
                    <AlertTriangle size={24} className={
                      item.status === 'low_stock' ? 'text-yellow-300' : 'text-red-300'
                    } />
                  ) : (
                    <Package size={24} className="text-white/60" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-white">{item.name}</h3>
                    <span className="text-sm text-white/60">{item.sku}</span>
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-4 text-sm text-white/60">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.location}</span>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-6">
                    <div>
                      <div className="text-sm text-white/60">Stock actuel</div>
                      <div className="text-white font-medium">
                        {item.currentStock} {item.unit}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-white/60">Stock minimum</div>
                      <div className="text-white font-medium">
                        {item.minimumStock} {item.unit}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-white/60">Dernier réapprovisionnement</div>
                      <div className="text-white font-medium">
                        {new Date(item.lastRestockDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <MoreVertical size={20} className="text-white/60" />
                </button>
                
                {selectedItem === item.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg py-1 z-10">
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center">
                      <Edit size={16} className="mr-2" />
                      Modifier
                    </button>
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center">
                      <History size={16} className="mr-2" />
                      Historique
                    </button>
                    <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5 flex items-center">
                      <Trash2 size={16} className="mr-2" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}