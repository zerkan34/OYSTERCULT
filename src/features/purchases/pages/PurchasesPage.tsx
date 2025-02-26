import React, { useState } from 'react';
import { Package, Search, Filter, Calendar, Clock, AlertCircle, Plus, ChevronRight, Shell, Fish } from 'lucide-react';
import { ModernCardBase } from '@/components/ui/ModernCardBase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Dialog } from '@/components/ui/Dialog';
import { PurchaseConfiguration } from '../components/PurchaseConfiguration';

export function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('commandes');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);

  const orders = [
    {
      id: '2024-0123',
      product: 'Moules de Méditerranée',
      supplier: 'CDB',
      deliveryDate: '28/02',
      price: 450,
      quantity: '100kg',
      status: 'pending',
      icon: Shell
    },
    {
      id: '2024-0122',
      product: 'Huîtres Spéciales',
      supplier: 'Cancale Huîtres',
      deliveryDate: '27/02',
      price: 780,
      quantity: '150kg',
      status: 'confirmed',
      icon: Shell
    },
    {
      id: '2024-0121',
      product: 'Bar de ligne',
      supplier: 'Pêcheurs Bretons',
      deliveryDate: '26/02',
      price: 890,
      quantity: '45kg',
      status: 'delivered',
      icon: Fish
    }
  ];

  return (
    <div>
      {/* En-tête avec recherche */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Achats</h1>
            <p className="text-sm text-white/60 mt-1">Gérez vos commandes et fournisseurs</p>
          </div>
          <Button 
            onClick={() => setIsNewOrderDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle commande
          </Button>
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
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      {order.icon && <order.icon className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-white">{order.product}</h3>
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
                          <p className="text-sm text-white mt-1">{order.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/40">Date de commande</p>
                          <p className="text-sm text-white mt-1">25/02/2024</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/40">Fournisseur</p>
                          <p className="text-sm text-white mt-1">{order.supplier}</p>
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

      {/* Modal de nouvelle commande */}
      <Dialog
        open={isNewOrderDialogOpen}
        onClose={() => setIsNewOrderDialogOpen(false)}
        title="Nouvelle commande"
      >
        <div className="space-y-4">
          <PurchaseConfiguration />
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline"
              onClick={() => setIsNewOrderDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Créer la commande
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
