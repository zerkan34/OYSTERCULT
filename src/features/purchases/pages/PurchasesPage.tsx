import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Shell, 
  Package, 
  Calendar, 
  Euro, 
  X, 
  Plus, 
  Eye,
  Fish,
  AlertCircle,
  ShoppingBag,
  Search,
  ChevronUp,
  Clock,
  ChevronRight,
  Star,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { ModernCardBase } from '@/components/ui/ModernCardBase';
import { PageTitle } from '@/components/ui/PageTitle';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { OrderDetails } from '../components/OrderDetails';
import { cn } from '@/lib/utils';

// Types pour les commandes
interface Order {
  id: string;
  product: string;
  supplier: string;
  deliveryDate: string;
  price: number;
  quantity: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed' | 'dispatched' | 'in_transit' | 'completed';
  icon: any;
  stockLocation: string;
  lastUpdate: string;
  rating: number;
}

// État initial pour les commentaires
interface Comment {
  text: string;
  date: string;
  author: string;
}

export function PurchasesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'status' | 'date' | 'price' | 'quantity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderDate, setReorderDate] = useState('');
  const [reorderQuantity, setReorderQuantity] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<{ [orderId: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      product: 'Huîtres spéciales n°2 Bouzigues',
      supplier: 'Bassin de Thau SARL',
      deliveryDate: '15/03',
      price: 1420,
      quantity: 180,
      status: 'pending',
      icon: Shell,
      stockLocation: 'En attente',
      lastUpdate: '2024-03-15',
      rating: 0
    },
    {
      id: '2',
      product: 'Palourdes vénérirupis',
      supplier: 'Conchyliculteurs Normands',
      deliveryDate: '14/03',
      price: 850,
      quantity: 65,
      status: 'confirmed',
      icon: Shell,
      stockLocation: 'En attente',
      lastUpdate: '2024-03-14',
      rating: 0
    },
    {
      id: '3',
      product: 'Coquilles Saint-Jacques Normandie',
      supplier: 'Pêcherie Atlantique',
      deliveryDate: '12/03',
      price: 1680,
      quantity: 90,
      status: 'dispatched',
      icon: Shell,
      stockLocation: 'En transit',
      lastUpdate: '2024-03-12',
      rating: 0
    },
    {
      id: '4',
      product: 'Coques fraîches Baie de Somme',
      supplier: 'Marée du Nord',
      deliveryDate: '11/03',
      price: 720,
      quantity: 40,
      status: 'in_transit',
      icon: Shell,
      stockLocation: 'En transit',
      lastUpdate: '2024-03-11',
      rating: 0
    },
    {
      id: '5',
      product: 'Huîtres creuses Marennes-Oléron',
      supplier: 'Maison Gillardeau',
      deliveryDate: '10/03',
      price: 1250,
      quantity: 200,
      status: 'pending',
      icon: Shell,
      stockLocation: 'En attente',
      lastUpdate: '2024-03-10',
      rating: 0
    },
    {
      id: '6',
      product: 'Moules bouchot AOP Mont Saint-Michel',
      supplier: 'Mytiliculteurs Bretons',
      deliveryDate: '08/03',
      price: 680,
      quantity: 150,
      status: 'confirmed',
      icon: Shell,
      stockLocation: 'En attente',
      lastUpdate: '2024-03-08',
      rating: 0
    },
    {
      id: '7',
      product: 'Crevettes grises de l\'Atlantique',
      supplier: 'Pêcheurs de la Manche',
      deliveryDate: '05/03',
      price: 950,
      quantity: 50,
      status: 'dispatched',
      icon: Shell,
      stockLocation: 'En transit',
      lastUpdate: '2024-03-05',
      rating: 0
    },
    {
      id: '8',
      product: 'Crabes dormeurs de Bretagne',
      supplier: 'Criée de Roscoff',
      deliveryDate: '03/03',
      price: 1100,
      quantity: 60,
      status: 'in_transit',
      icon: Shell,
      stockLocation: 'En transit',
      lastUpdate: '2024-03-03',
      rating: 0
    },
    {
      id: '9',
      product: 'Moules de Méditerranée',
      supplier: 'CDB',
      deliveryDate: '28/02',
      price: 450,
      quantity: 100,
      status: 'pending',
      icon: Shell,
      stockLocation: 'Bassin A3',
      lastUpdate: '2024-02-28',
      rating: 0
    },
    {
      id: '10',
      product: 'Huîtres Spéciales',
      supplier: 'Cancale Huîtres',
      deliveryDate: '27/02',
      price: 780,
      quantity: 150,
      status: 'confirmed',
      icon: Shell,
      stockLocation: 'Bassin B1',
      lastUpdate: '2024-02-27',
      rating: 0
    },
    {
      id: '11',
      product: 'Bar de ligne',
      supplier: 'Pêcheurs Bretons',
      deliveryDate: '26/02',
      price: 890,
      quantity: 45,
      status: 'delivered',
      icon: Fish,
      stockLocation: 'Trempage T2',
      lastUpdate: '2024-02-26',
      rating: 0
    },
    {
      id: '12',
      product: 'Huîtres plates Belon',
      supplier: 'Ostréiculteurs du Morbihan',
      deliveryDate: '24/02',
      price: 1350,
      quantity: 80,
      status: 'completed',
      icon: Shell,
      stockLocation: 'Bassin C2',
      lastUpdate: '2024-02-24',
      rating: 0
    },
    {
      id: '13',
      product: 'Palourdes de Thau',
      supplier: 'Étang de Thau',
      deliveryDate: '22/02',
      price: 580,
      quantity: 40,
      status: 'completed',
      icon: Shell,
      stockLocation: 'Zone D3',
      lastUpdate: '2024-02-22',
      rating: 0
    }
  ]);

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
      // TODO: Mettre à jour le formulaire avec le fichier
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la logique d'envoi
    // 1. Envoyer les données au backend
    // 2. Mettre à jour la traçabilité
    // 3. Mettre à jour la comptabilité
    console.log('Nouveau achat:');
    // TODO: Réinitialiser le formulaire
  };

  // Formater la quantité avec un espace avant kg
  const formatQuantity = (quantity: number) => `${quantity} kg`;

  // Types pour le tri
  type SortField = 'date' | 'price' | 'quantity' | 'status';

  // Options de tri
  const sortOptions = [
    { value: 'status', label: 'Statut', icon: <AlertCircle className="w-4 h-4" /> },
    { value: 'date', label: 'Date', icon: <Calendar className="w-4 h-4" /> },
    { value: 'price', label: 'Prix', icon: <Euro className="w-4 h-4" /> },
    { value: 'quantity', label: 'Quantité', icon: <Shell className="w-4 h-4" /> }
  ];

  // Tri des commandes
  const sortOrders = (ordersToSort: Order[]) => {
    return [...ordersToSort].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'status':
          const statusPriority: { [key: string]: number } = {
            'pending': 1,
            'processing': 2,
            'shipped': 3,
            'delivered': 4,
            'cancelled': 5
          };
          comparison = (statusPriority[a.status] || 999) - (statusPriority[b.status] || 999);
          break;

        case 'date':
          const dateA = new Date(a.deliveryDate).getTime();
          const dateB = new Date(b.deliveryDate).getTime();
          comparison = dateA - dateB;
          break;

        case 'price':
          const priceA = a.price;
          const priceB = b.price;
          comparison = priceA - priceB;
          break;

        case 'quantity':
          const qtyA = a.quantity;
          const qtyB = b.quantity;
          comparison = qtyA - qtyB;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // Calcul des statistiques
  const calculateStats = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyOrders = orders.filter(o => {
      const orderDate = new Date(o.deliveryDate);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const totalMonthValue = monthlyOrders.reduce((sum, order) => sum + order.price, 0);
    const totalMonthQuantity = monthlyOrders.reduce((sum, order) => sum + order.quantity, 0);
    const averageValue = orders.length > 0
      ? orders.reduce((sum, order) => sum + order.price, 0) / orders.length
      : 0;

    return {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalMonth: totalMonthValue.toFixed(2),
      totalQuantityMonth: totalMonthQuantity.toFixed(2),
      averageOrderValue: averageValue.toFixed(2),
      dailyAverage: (totalMonthQuantity / currentDate.getDate()).toFixed(1)
    };
  };

  const sortedOrders = sortOrders(orders);

  const toggleSortOrder = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const stats = calculateStats();

  const getMonthlyStats = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyOrders = orders.filter(o => {
      const orderDate = new Date(o.deliveryDate);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const totalMonthValue = monthlyOrders.reduce((sum, order) => sum + order.price, 0);
    const totalMonthQuantity = monthlyOrders.reduce((sum, order) => sum + order.quantity, 0);
    const averageValue = orders.length > 0
      ? orders.reduce((sum, order) => sum + order.price, 0) / orders.length
      : 0;

    return {
      totalMonthValue,
      totalMonthQuantity,
      averageValue
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageTitle 
        title="Achats" 
        icon={<ShoppingBag className="w-6 h-6" />}
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Panneau de gauche - Liste des commandes */}
        <div className="lg:col-span-12 space-y-6">
          {/* Barre d'actions */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[280px] relative">
              <Input
                type="text"
                placeholder="Rechercher une commande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-white/40" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Boutons de tri */}
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                onClick={() => toggleSortOrder(option.value as SortField)}
                className={cn(
                  "flex items-center gap-2 min-w-[44px] min-h-[44px]",
                  sortField === option.value && "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                )}
              >
                {option.icon}
                <span>{option.label}</span>
                {sortField === option.value && (
                  <ChevronUp
                    className={cn(
                      "w-4 h-4 transition-transform",
                      sortOrder === 'desc' && "transform rotate-180"
                    )}
                  />
                )}
              </Button>
            ))}
          </div>

          {/* Liste des commandes */}
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <ModernCardBase
                key={order.id}
                className="border border-white/10 rounded-lg overflow-hidden transform transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: "rgba(15,23,42,0.3)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "rgba(0,0,0,0.2) 0px 10px 20px -5px, rgba(0,150,255,0.1) 0px 8px 16px -8px, rgba(255,255,255,0.07) 0px -1px 2px 0px inset, rgba(0,65,255,0.05) 0px 0px 8px inset, rgba(0,0,0,0.05) 0px 0px 1px inset"
                }}
              >
                <div className="p-4 flex justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-semibold text-white truncate">
                            {order.product}
                          </span>
                          <Badge
                            variant="default"
                            className={`${getStatusStyles(order.status).bgColor} ${getStatusStyles(order.status).textColor} ${getStatusStyles(order.status).borderColor}`}
                          >
                            {getStatusStyles(order.status).label}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-cyan-400" />
                            <span>{order.supplier}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>{order.deliveryDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shell className="w-4 h-4 text-cyan-400" />
                            <span>{formatQuantity(order.quantity)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Euro className="w-4 h-4 text-cyan-400" />
                            <span>{order.price} €</span>
                          </div>
                        </div>

                        {/* Système de notation par étoiles */}
                        {order.status === 'completed' && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => {
                                    const updatedOrders = orders.map(o =>
                                      o.id === order.id ? { ...o, rating: star } : o
                                    );
                                    setOrders(updatedOrders);
                                  }}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= order.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-400'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bloc de commentaires */}
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-white/60">Commentaires</span>
                          </div>
                          {comments[order.id]?.map((comment, index) => (
                            <div
                              key={index}
                              className="bg-white/5 rounded-lg p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-cyan-400">{comment.author}</span>
                                <span className="text-xs text-gray-400">{comment.date}</span>
                              </div>
                              <p className="text-sm text-white/80">{comment.text}</p>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Ajouter un commentaire..."
                              className="flex-1 bg-white/5 border-white/10"
                            />
                            <Button
                              onClick={() => {
                                if (newComment.trim()) {
                                  const comment: Comment = {
                                    text: newComment,
                                    date: new Date().toLocaleString(),
                                    author: 'Vous'
                                  };
                                  setComments(prev => ({
                                    ...prev,
                                    [order.id]: [...(prev[order.id] || []), comment]
                                  }));
                                  setNewComment('');
                                }
                              }}
                              className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                            >
                              Envoyer
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xl font-bold text-white">{order.price}€</span>
                        <div className="flex items-center gap-2">
                          {order.status === 'delivered' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Ouvrir la facture
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            onClick={() => setSelectedOrder(order.id)}
                            aria-label="Voir les détails"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModernCardBase>
            ))}
          </div>
        </div>
      </div>

      {/* Modales et composants supplémentaires */}
      <Dialog 
        open={false} 
        onOpenChange={(open) => {
          if (!open) {
            // TODO: Réinitialiser le formulaire
          }
        }}
      >
        <DialogContent className="bg-[rgba(15,23,42,0.3)] backdrop-blur-[10px] border border-white/10 shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Nouvelle commande
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Formulaire */}
            <div className="space-y-4">
              <div>
                <label htmlFor="supplier" className="text-sm text-white/60 mb-1 block">
                  Fournisseur
                </label>
                <Input
                  id="supplier"
                  name="supplier"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  placeholder="Nom du fournisseur"
                />
              </div>

              <div>
                <label htmlFor="product" className="text-sm text-white/60 mb-1 block">
                  Produit
                </label>
                <Input
                  id="product"
                  name="product"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  placeholder="Nom du produit"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="text-sm text-white/60 mb-1 block">
                  Quantité (kg)
                </label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  placeholder="Quantité en kg"
                />
              </div>

              <div>
                <label htmlFor="price" className="text-sm text-white/60 mb-1 block">
                  Prix (€)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  placeholder="Prix en euros"
                />
              </div>

              <div>
                <label htmlFor="deliveryDate" className="text-sm text-white/60 mb-1 block">
                  Date de livraison
                </label>
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
                >
                  Annuler
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
              >
                Créer la commande
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
            setReorderMode(false);
            setReorderDate('');
            setReorderQuantity('');
          }
        }}
      >
        <DialogContent className="bg-[rgba(15,23,42,0.98)] border-white/10 text-white">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Détails de la commande
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white absolute right-4 top-4"
                    onClick={() => {
                      setSelectedOrder(null);
                      setReorderMode(false);
                      setReorderDate('');
                      setReorderQuantity('');
                    }}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </DialogHeader>

              {/* Contenu du modal */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-white">
                    {orders.find(o => o.id === selectedOrder)?.product}
                  </span>
                  <Badge
                    variant="default"
                    className={`${getStatusStyles(orders.find(o => o.id === selectedOrder)?.status || '').bgColor} ${getStatusStyles(orders.find(o => o.id === selectedOrder)?.status || '').textColor} ${getStatusStyles(orders.find(o => o.id === selectedOrder)?.status || '').borderColor}`}
                  >
                    {getStatusStyles(orders.find(o => o.id === selectedOrder)?.status || '').label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/60">Fournisseur</label>
                    <p className="text-white">{orders.find(o => o.id === selectedOrder)?.supplier}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/60">Date de livraison</label>
                    <p className="text-white">{orders.find(o => o.id === selectedOrder)?.deliveryDate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/60">Quantité</label>
                    <p className="text-white">{formatQuantity(orders.find(o => o.id === selectedOrder)?.quantity || 0)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/60">Prix</label>
                    <p className="text-white">{orders.find(o => o.id === selectedOrder)?.price} €</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReorderMode(true);
                      const originalOrder = orders.find(o => o.id === selectedOrder);
                      if (originalOrder) {
                        setReorderDate(originalOrder.deliveryDate);
                        setReorderQuantity(originalOrder.quantity.toString());
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Recommander
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedOrder(null);
                      setReorderMode(false);
                      setReorderDate('');
                      setReorderQuantity('');
                    }}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {selectedOrder && (
        <OrderDetails
          order={orders.find(o => o.id === selectedOrder)}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default PurchasesPage;
