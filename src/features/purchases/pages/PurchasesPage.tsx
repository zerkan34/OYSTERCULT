import React, { useState } from 'react';
import { Package, Search, Filter, Calendar, Clock, AlertCircle, ChevronRight, Shell, Fish, Anchor, Sailboat, Ship, Plus, Camera, Scan, Star, X, Upload, MessageSquare } from 'lucide-react';
import { ModernCardBase } from '@/components/ui/ModernCardBase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OrderDetails } from '../components/OrderDetails';

export function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedOrderForComments, setSelectedOrderForComments] = useState<string | null>(null);
  const [showNewPurchaseForm, setShowNewPurchaseForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    supplier: '',
    product: '',
    expiryDate: '',
    invoice: null as File | null
  });

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, invoice: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la logique d'envoi
    // 1. Envoyer les données au backend
    // 2. Mettre à jour la traçabilité
    // 3. Mettre à jour la comptabilité
    console.log('Nouveau achat:', { ...formData, rating });
    setShowNewPurchaseForm(false);
    setFormData({
      supplier: '',
      product: '',
      expiryDate: '',
      invoice: null
    });
    setRating(0);
  };

  const orders = [
    {
      id: '2024-0131',
      product: 'Huîtres spéciales n°2 Bouzigues',
      supplier: 'Bassin de Thau SARL',
      deliveryDate: '15/03',
      price: 1420,
      quantity: '180kg',
      status: 'pending',
      icon: Shell,
      stockLocation: 'En attente',
      lastUpdate: '01/03/2024 14:30'
    },
    {
      id: '2024-0130',
      product: 'Palourdes vénérirupis',
      supplier: 'Conchyliculteurs Normands',
      deliveryDate: '14/03',
      price: 850,
      quantity: '65kg',
      status: 'confirmed',
      icon: Shell,
      stockLocation: 'En attente',
      lastUpdate: '01/03/2024 11:20'
    },
    {
      id: '2024-0129',
      product: 'Coquilles Saint-Jacques Normandie',
      supplier: 'Pêcherie Atlantique',
      deliveryDate: '12/03',
      price: 1680,
      quantity: '90kg',
      status: 'dispatched',
      icon: Shell,
      stockLocation: 'En transit',
      lastUpdate: '01/03/2024 09:45'
    },
    {
      id: '2024-0128',
      product: 'Coques fraîches Baie de Somme',
      supplier: 'Marée du Nord',
      deliveryDate: '11/03',
      price: 720,
      quantity: '40kg',
      status: 'in_transit',
      icon: Shell,
      stockLocation: 'En transit',
      lastUpdate: '01/03/2024 08:15'
    },
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
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 flex items-center space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtres
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div key={order.id}>
            <ModernCardBase className="overflow-hidden">
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
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
                  <div className="px-6 pb-6 pt-2 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="flex justify-end mt-6 space-x-4">
                      <button
                        onClick={() => setSelectedOrderForComments(order.id)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors flex items-center space-x-2"
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Commenter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </ModernCardBase>
          </div>
        ))}
      </div>

      {selectedOrderForComments && (
        <OrderDetails
          order={orders.find(o => o.id === selectedOrderForComments)}
          onClose={() => setSelectedOrderForComments(null)}
        />
      )}

      {showNewPurchaseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg p-6 w-full max-w-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Nouvel achat</h2>
              <button
                onClick={() => setShowNewPurchaseForm(false)}
                className="p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="text-white/60" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Nom du fournisseur</label>
                <Input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Produit</label>
                <Input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">DLC</label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Évaluation</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Facture</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1">
                    <div className="flex items-center justify-center px-4 py-3 border border-dashed border-white/20 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 text-white/60 mr-2" />
                      <span className="text-white/60">Choisir un fichier</span>
                    </div>
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {/* TODO: Implement camera capture */}}
                  >
                    <Camera className="w-4 h-4" />
                    Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {/* TODO: Implement scanner */}}
                  >
                    <Scan className="w-4 h-4" />
                    Scanner
                  </Button>
                </div>
                {formData.invoice && (
                  <p className="mt-2 text-sm text-white/60">
                    Fichier sélectionné : {formData.invoice.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowNewPurchaseForm(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-blue hover:bg-brand-blue/90"
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
