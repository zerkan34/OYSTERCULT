import React, { useState } from 'react';
import { Package, Search, Filter, Calendar, Clock, AlertCircle, ChevronRight, Shell, Fish, Anchor, Sailboat, Ship } from 'lucide-react';
import { ModernCardBase } from '@/components/ui/ModernCardBase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('commandes');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Fonction pour obtenir la couleur en fonction du statut
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'En attente',
          bgColor: 'bg-yellow-500/20',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/30'
        };
      case 'confirmed':
        return {
          label: 'Confirmée',
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/30'
        };
      case 'dispatched':
        return {
          label: 'Expédiée',
          bgColor: 'bg-indigo-500/20',
          textColor: 'text-indigo-400',
          borderColor: 'border-indigo-500/30'
        };
      case 'in_transit':
        return {
          label: 'En transit',
          bgColor: 'bg-purple-500/20',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/30'
        };
      case 'delivered':
        return {
          label: 'Livrée',
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/30'
        };
      case 'completed':
        return {
          label: 'Traitée',
          bgColor: 'bg-teal-500/20',
          textColor: 'text-teal-400',
          borderColor: 'border-teal-500/30'
        };
      default:
        return {
          label: 'Inconnue',
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/30'
        };
    }
  };

  const orders = [
    {
      id: '2024-0127',
      product: 'Huîtres creuses Marennes-Oléron',
      supplier: 'Maison Gillardeau',
      deliveryDate: '10/03',
      price: 1250,
      quantity: '200kg',
      status: 'pending',
      icon: Shell,
      stockLocation: 'En attente',
      lastUpdate: '01/03/2024 09:15'
    },
    {
      id: '2024-0126',
      product: 'Moules bouchot AOP Mont Saint-Michel',
      supplier: 'Mytiliculteurs Bretons',
      deliveryDate: '08/03',
      price: 680,
      quantity: '150kg',
      status: 'confirmed',
      icon: Shell,
      stockLocation: 'En attente',
      lastUpdate: '28/02/2024 16:45'
    },
    {
      id: '2024-0125',
      product: 'Crevettes grises de l\'Atlantique',
      supplier: 'Pêcheurs de la Manche',
      deliveryDate: '05/03',
      price: 950,
      quantity: '50kg',
      status: 'dispatched',
      icon: Shell,
      stockLocation: 'En transit',
      lastUpdate: '28/02/2024 08:30'
    },
    {
      id: '2024-0124',
      product: 'Crabes dormeurs de Bretagne',
      supplier: 'Criée de Roscoff',
      deliveryDate: '03/03',
      price: 1100,
      quantity: '60kg',
      status: 'in_transit',
      icon: Shell,
      stockLocation: 'En transit',
      lastUpdate: '27/02/2024 19:00'
    },
    {
      id: '2024-0123',
      product: 'Moules de Méditerranée',
      supplier: 'CDB',
      deliveryDate: '28/02',
      price: 450,
      quantity: '100kg',
      status: 'pending',
      icon: Shell,
      stockLocation: 'Bassin A3',
      lastUpdate: '26/02/2024 14:30'
    },
    {
      id: '2024-0122',
      product: 'Huîtres Spéciales',
      supplier: 'Cancale Huîtres',
      deliveryDate: '27/02',
      price: 780,
      quantity: '150kg',
      status: 'confirmed',
      icon: Shell,
      stockLocation: 'Bassin B1',
      lastUpdate: '26/02/2024 10:15'
    },
    {
      id: '2024-0121',
      product: 'Bar de ligne',
      supplier: 'Pêcheurs Bretons',
      deliveryDate: '26/02',
      price: 890,
      quantity: '45kg',
      status: 'delivered',
      icon: Fish,
      stockLocation: 'Trempage T2',
      lastUpdate: '25/02/2024 16:45'
    },
    {
      id: '2024-0120',
      product: 'Huîtres plates Belon',
      supplier: 'Ostréiculteurs du Morbihan',
      deliveryDate: '24/02',
      price: 1350,
      quantity: '80kg',
      status: 'completed',
      icon: Shell,
      stockLocation: 'Bassin C2',
      lastUpdate: '24/02/2024 11:20'
    },
    {
      id: '2024-0119',
      product: 'Palourdes de Thau',
      supplier: 'Étang de Thau',
      deliveryDate: '22/02',
      price: 580,
      quantity: '40kg',
      status: 'completed',
      icon: Shell,
      stockLocation: 'Zone D3',
      lastUpdate: '22/02/2024 15:40'
    }
  ];

  return (
    <div>
      {/* En-tête avec recherche */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Commandes</h1>
            <p className="text-sm text-white/60 mt-1">Gérez vos commandes et fournisseurs</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="commandes">Commandes</TabsTrigger>
          <TabsTrigger value="fournisseurs">Fournisseurs</TabsTrigger>
        </TabsList>

        <TabsContent value="commandes">
          <ModernCardBase>
            <div className="p-6 space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order.id === selectedOrder ? null : order.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getStatusStyles(order.status).bgColor}`}>
                      {order.icon && <order.icon className={`w-5 h-5 ${getStatusStyles(order.status).textColor}`} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium text-white">{order.product}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusStyles(order.status).bgColor} ${getStatusStyles(order.status).textColor}`}>
                          {getStatusStyles(order.status).label}
                        </span>
                      </div>
                      <p className="text-sm text-white/60">
                        {order.supplier} • #{order.id} • Livraison le {order.deliveryDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-white">{order.price}€</p>
                      <p className="text-sm text-white/60">{order.quantity}</p>
                    </div>
                    <ChevronRight 
                      className={`w-5 h-5 text-white/40 transition-transform ${
                        selectedOrder === order.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                  {selectedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-white/40">Statut</p>
                          <p 
                            className={`text-sm text-white mt-1 ${getStatusStyles(order.status).textColor}`}
                          >
                            {getStatusStyles(order.status).label}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-white/40">Date de commande</p>
                          <p className="text-sm text-white mt-1">25/02/2024</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/40">Fournisseur</p>
                          <p className="text-sm text-white mt-1">{order.supplier}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/40">Emplacement stock</p>
                          <p className="text-sm text-white mt-1">{order.stockLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/40">Dernière mise à jour</p>
                          <p className="text-sm text-white mt-1">{order.lastUpdate}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ModernCardBase>
        </TabsContent>

        <TabsContent value="fournisseurs">
          <ModernCardBase>
            <div className="p-6">
              <p className="text-white/60">Liste des fournisseurs à venir...</p>
            </div>
          </ModernCardBase>
        </TabsContent>
      </Tabs>
    </div>
  );
}
