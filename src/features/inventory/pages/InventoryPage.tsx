import React, { useState } from 'react';
import { Plus, Filter, Search, BarChart2, Package, AlertTriangle, Droplets, ShoppingCart, Map, X, Thermometer, DollarSign, Upload, Camera, History, Eye, FileText } from 'lucide-react';
import { OysterTableMap, Table } from '../components/OysterTableMap';
import { PurificationPools } from '../components/PurificationPools';
import { TrempeView } from '../components/TrempeView';
import { useStore } from '@/lib/store';
import { TableDetail } from '../components/TableDetail';
import { InventoryForm } from '../components/InventoryForm';
import { InventoryFilters } from '../components/InventoryFilters';
import { useTouchGestures } from '@/lib/hooks';
import { PurchaseConfiguration } from '@/features/purchases/components/PurchaseConfiguration';
import { PurchaseForm } from '@/features/purchases/components/PurchaseForm';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';

type TabType = 'tables' | 'pools' | 'trempes' | 'autres' | 'achats' | 'charges';

export function InventoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('tables');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [hoveredTable, setHoveredTable] = useState<Table | null>(null);
  const [showNewItem, setShowNewItem] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewStorageLocation, setShowNewStorageLocation] = useState(false);
  const [selectedStorageLocation, setSelectedStorageLocation] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [productToRemove, setProductToRemove] = useState<{ id: string; name: string; quantity: string; } | null>(null);
  const [removeQuantity, setRemoveQuantity] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    arrivalDate: new Date().toISOString().substring(0, 10),
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  });

  // État pour gérer la liste des produits (simulation)
  const [productList, setProductList] = useState({
    'Frigo 1': [
      { id: 'F1-01', name: 'Huîtres Fines de Claire', quantity: '50kg', arrivalDate: '2025-02-25', expiryDate: '2025-03-10' },
      { id: 'F1-02', name: 'Moules de Bouchot', quantity: '25kg', arrivalDate: '2025-03-01', expiryDate: '2025-03-08' },
      { id: 'F1-03', name: 'Palourdes', quantity: '15kg', arrivalDate: '2025-02-28', expiryDate: '2025-03-07' }
    ],
    'Frigo 2': [
      { id: 'F2-01', name: 'Huîtres Spéciales', quantity: '30kg', arrivalDate: '2025-02-27', expiryDate: '2025-03-12' },
      { id: 'F2-02', name: 'Crevettes Royales', quantity: '10kg', arrivalDate: '2025-03-01', expiryDate: '2025-03-05' }
    ],
    'Congélateur 1': [
      { id: 'C1-01', name: 'Saumon Frais', quantity: '40kg', arrivalDate: '2025-01-15', expiryDate: '2025-04-15' },
      { id: 'C1-02', name: 'Huîtres Surgelées', quantity: '60kg', arrivalDate: '2025-02-10', expiryDate: '2025-08-10' },
      { id: 'C1-03', name: 'Coquilles St-Jacques', quantity: '35kg', arrivalDate: '2025-02-20', expiryDate: '2025-05-20' }
    ],
    'Congélateur 2': [
      { id: 'C2-01', name: 'Filets de Poisson', quantity: '25kg', arrivalDate: '2025-02-15', expiryDate: '2025-06-15' },
      { id: 'C2-02', name: 'Fruits de Mer', quantity: '20kg', arrivalDate: '2025-02-25', expiryDate: '2025-05-25' }
    ],
    'Remise': [
      { id: 'R-01', name: 'Matériel d\'emballage', quantity: '200 unités', arrivalDate: '2025-01-10', expiryDate: 'N/A' },
      { id: 'R-02', name: 'Sachets biodégradables', quantity: '500 unités', arrivalDate: '2025-02-01', expiryDate: 'N/A' }
    ],
    'Cave': [
      { id: 'CA-01', name: 'Vin blanc', quantity: '50 bouteilles', arrivalDate: '2024-10-15', expiryDate: '2026-10-15' },
      { id: 'CA-02', name: 'Huîtres affinées', quantity: '100kg', arrivalDate: '2025-02-20', expiryDate: '2025-04-20' }
    ]
  });

  const pageRef = React.useRef<HTMLDivElement>(null);

  // Fonction pour générer un ID unique
  const generateId = (locationPrefix: string) => {
    const randomId = Math.floor(Math.random() * 10000);
    return `${locationPrefix}-${randomId.toString().padStart(5, '0')}`;
  };

  // Fonction pour ajouter un nouveau produit
  const handleAddProduct = () => {
    if (!selectedStorageLocation || !newProduct.name || !newProduct.quantity) return;

    // Générer le préfixe pour l'ID
    let prefix = '';
    if (selectedStorageLocation.includes('Frigo')) prefix = 'F';
    else if (selectedStorageLocation.includes('Congélateur')) prefix = 'C';
    else if (selectedStorageLocation === 'Remise') prefix = 'R';
    else if (selectedStorageLocation === 'Cave') prefix = 'CA';

    const newProductEntry = {
      id: generateId(prefix),
      name: newProduct.name,
      quantity: `${newProduct.quantity}${newProduct.unit === 'unités' ? ' unités' : newProduct.unit === 'bouteilles' ? ' bouteilles' : newProduct.unit}`,
      arrivalDate: newProduct.arrivalDate,
      expiryDate: newProduct.expiryDate === '' ? 'N/A' : newProduct.expiryDate
    };

    setProductList({
      ...productList,
      [selectedStorageLocation]: [...productList[selectedStorageLocation], newProductEntry]
    });

    // Réinitialiser le formulaire et fermer le modal
    setNewProduct({
      name: '',
      quantity: '',
      unit: 'kg',
      arrivalDate: new Date().toISOString().substring(0, 10),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
    });

    setShowAddProduct(false);
  };

  // Fonction pour initialiser la sortie d'un produit
  const initiateRemoveProduct = (locationName: string, product: any) => {
    setProductToRemove({
      id: product.id,
      name: product.name,
      quantity: product.quantity
    });
    // Extraire la valeur numérique de la quantité
    const quantityMatch = product.quantity.match(/^(\d+(?:\.\d+)?)/);
    if (quantityMatch && quantityMatch[1]) {
      setRemoveQuantity(quantityMatch[1]);
    } else {
      setRemoveQuantity('');
    }
    setShowRemoveConfirm(true);
  };

  // Fonction pour extraire l'unité d'une chaîne de quantité (ex: "50kg" -> "kg")
  const extractUnit = (quantityString: string) => {
    const match = quantityString.match(/[a-zA-Z]+|unités|bouteilles/);
    return match ? match[0] : '';
  };

  // Fonction pour extraire la valeur numérique d'une chaîne de quantité (ex: "50kg" -> 50)
  const extractQuantityValue = (quantityString: string) => {
    const match = quantityString.match(/^(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Fonction pour supprimer un produit ou réduire sa quantité
  const handleRemoveProduct = () => {
    if (!selectedStorageLocation || !productToRemove) return;
    
    const originalQuantityValue = extractQuantityValue(productToRemove.quantity);
    const removeQuantityValue = parseFloat(removeQuantity);
    const unit = extractUnit(productToRemove.quantity);
    
    // Obtenir la liste actuelle des produits
    const currentProducts = [...productList[selectedStorageLocation]];
    const productIndex = currentProducts.findIndex(p => p.id === productToRemove.id);
    
    if (productIndex === -1) return;
    
    // Si la quantité à retirer est supérieure ou égale à la quantité disponible, supprimer le produit
    if (removeQuantityValue >= originalQuantityValue) {
      const updatedProducts = currentProducts.filter(p => p.id !== productToRemove.id);
      setProductList({
        ...productList,
        [selectedStorageLocation]: updatedProducts
      });
      console.log(`Produit ${productToRemove.id} entièrement retiré de ${selectedStorageLocation}`);
    } else {
      // Sinon, réduire la quantité
      const updatedProduct = {
        ...currentProducts[productIndex],
        quantity: `${(originalQuantityValue - removeQuantityValue).toFixed(2).replace(/\.00$/, '')}${unit}`
      };
      
      currentProducts[productIndex] = updatedProduct;
      setProductList({
        ...productList,
        [selectedStorageLocation]: currentProducts
      });
      console.log(`${removeQuantity}${unit} de ${productToRemove.name} retiré de ${selectedStorageLocation}`);
    }
    
    // Réinitialiser l'état et fermer le modal
    setShowRemoveConfirm(false);
    setProductToRemove(null);
    setRemoveQuantity('');
  };

  // Touch gesture handling
  const { handlers, isRefreshing } = useTouchGestures(
    async () => {
      // Refresh data
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  );

  const getTitleByTab = () => {
    switch (activeTab) {
      case 'tables':
        return 'Tables';
      case 'trempes':
        return 'Trempes';
      case 'pools':
        return 'Bassins';
      case 'autres':
        return 'Autres emplacements';
      case 'achats':
        return 'Achats';
      case 'charges':
        return 'Charges';
      default:
        return '';
    }
  };

  const [showNewChargeModal, setShowNewChargeModal] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      chargeName: '',
      amount: 0,
      description: '',
      invoice: null
    }
  });

  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);

  const handleAddCharge = (data: any) => {
    console.log(data);
    setShowNewChargeModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoicePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveInvoice = () => {
    setInvoicePreview(null);
  };

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const pastCharges = [
    { id: 'CH-001', name: 'Carburant voiture', amount: 50, date: '2025-03-01' },
    { id: 'CH-002', name: 'Carburant bateau', amount: 75, date: '2025-03-03' },
    { id: 'CH-003', name: 'Réparation équipement', amount: 200, date: '2025-03-05' }
  ];

  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const [selectedCharge, setSelectedCharge] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleViewCharge = (charge: any) => {
    setSelectedCharge(charge);
    setShowInvoiceModal(true);
  };

  return (
    <div 
      ref={pageRef} 
      className="space-y-6"
      {...handlers}
    >
      <div className="flex items-center justify-between mb-6" role="banner">
        <h1 className="text-2xl font-bold text-white" aria-label="Titre de la page">{getTitleByTab()}</h1>
        <div className="flex items-center space-x-3" role="toolbar">
          {/* Bouton Nouveau Lot supprimé */}
        </div>
      </div>

      <div className="flex items-center space-x-4 border-b border-white/10" role="tablist">
        <button
          onClick={() => setActiveTab('tables')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'tables'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
          aria-label="Tables"
          aria-selected={activeTab === 'tables'}
        >
          <div className="flex items-center">
            <Package size={16} className="mr-2" aria-hidden="true" />
            Tables
          </div>
        </button>
        <button
          onClick={() => setActiveTab('trempes')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'trempes'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
          aria-label="Trempes"
          aria-selected={activeTab === 'trempes'}
        >
          <div className="flex items-center">
            <Droplets size={16} className="mr-2" aria-hidden="true" />
            Trempes
          </div>
        </button>
        <button
          onClick={() => setActiveTab('pools')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pools'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
          aria-label="Bassins"
          aria-selected={activeTab === 'pools'}
        >
          <div className="flex items-center">
            <Droplets size={16} className="mr-2" aria-hidden="true" />
            Bassins
          </div>
        </button>
        <button
          onClick={() => setActiveTab('autres')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'autres'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
          aria-label="Autres emplacements"
          aria-selected={activeTab === 'autres'}
        >
          <div className="flex items-center">
            <Map size={16} className="mr-2" aria-hidden="true" />
            Autres emplacements
          </div>
        </button>
        <button
          onClick={() => setActiveTab('achats')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'achats'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
          aria-label="Achats"
          aria-selected={activeTab === 'achats'}
        >
          <div className="flex items-center">
            <ShoppingCart size={16} className="mr-2" aria-hidden="true" />
            Achats
          </div>
        </button>
        <button
          onClick={() => setActiveTab('charges')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'charges'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
          aria-label="Charges"
          aria-selected={activeTab === 'charges'}
        >
          <div className="flex items-center">
            <DollarSign size={16} className="mr-2" aria-hidden="true" />
            Charges
          </div>
        </button>
      </div>

      <div className="flex items-center space-x-4" role="search">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            aria-label="Rechercher"
          />
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label="Filtres"
        >
          <Filter size={20} className="mr-2" aria-hidden="true" />
          Filtres
        </button>
      </div>

      {activeTab === 'tables' && (
        <OysterTableMap
          onTableSelect={setSelectedTable}
          onTableHover={setHoveredTable}
          hoveredTable={hoveredTable}
          selectedTable={selectedTable}
        />
      )}
      {activeTab === 'pools' && <PurificationPools />}
      {activeTab === 'trempes' && <TrempeView />}
      {activeTab === 'autres' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-white">Lieux de stockage alternatifs</h2>
            <button
              onClick={() => setShowNewStorageLocation(true)}
              className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
              aria-label="Ajouter lieu de stockage"
            >
              <Plus size={18} className="mr-2" aria-hidden="true" />
              Ajouter lieu de stockage
            </button>
          </div>
          <div className="glass-effect rounded-xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Frigo 1 */}
              <div 
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                onClick={() => setSelectedStorageLocation('Frigo 1')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
                      <Droplets size={18} className="text-blue-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-white font-medium">Frigo 1</h3>
                  </div>
                  <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    Frigo
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Capacité</span>
                    <span className="text-white">500 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Occupation</span>
                    <span className="text-white">65%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="hidden group-hover:block mt-3">
                    <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
                  </div>
                </div>
              </div>

              {/* Frigo 2 */}
              <div 
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                onClick={() => setSelectedStorageLocation('Frigo 2')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
                      <Droplets size={18} className="text-blue-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-white font-medium">Frigo 2</h3>
                  </div>
                  <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    Frigo
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Capacité</span>
                    <span className="text-white">300 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Occupation</span>
                    <span className="text-white">30%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <div className="hidden group-hover:block mt-3">
                    <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
                  </div>
                </div>
              </div>

              {/* Congélateur 1 */}
              <div 
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                onClick={() => setSelectedStorageLocation('Congélateur 1')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-cyan-500/20 flex items-center justify-center mr-3">
                      <Thermometer size={18} className="text-cyan-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-white font-medium">Congélateur 1</h3>
                  </div>
                  <div className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
                    Congélateur
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Capacité</span>
                    <span className="text-white">200 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Occupation</span>
                    <span className="text-white">85%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="hidden group-hover:block mt-3">
                    <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
                  </div>
                </div>
              </div>

              {/* Congélateur 2 */}
              <div 
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                onClick={() => setSelectedStorageLocation('Congélateur 2')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-cyan-500/20 flex items-center justify-center mr-3">
                      <Thermometer size={18} className="text-cyan-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-white font-medium">Congélateur 2</h3>
                  </div>
                  <div className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
                    Congélateur
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Capacité</span>
                    <span className="text-white">150 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Occupation</span>
                    <span className="text-white">40%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="hidden group-hover:block mt-3">
                    <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
                  </div>
                </div>
              </div>

              {/* Remise */}
              <div 
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                onClick={() => setSelectedStorageLocation('Remise')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-amber-500/20 flex items-center justify-center mr-3">
                      <Package size={18} className="text-amber-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-white font-medium">Remise</h3>
                  </div>
                  <div className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full">
                    Remise
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Capacité</span>
                    <span className="text-white">1000 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Occupation</span>
                    <span className="text-white">55%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '55%' }}></div>
                  </div>
                  <div className="hidden group-hover:block mt-3">
                    <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
                  </div>
                </div>
              </div>

              {/* Cave */}
              <div 
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                onClick={() => setSelectedStorageLocation('Cave')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center mr-3">
                      <Map size={18} className="text-purple-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-white font-medium">Cave</h3>
                  </div>
                  <div className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                    Remise
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Capacité</span>
                    <span className="text-white">800 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Occupation</span>
                    <span className="text-white">25%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <div className="hidden group-hover:block mt-3">
                    <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'achats' && <PurchaseConfiguration />}
      {selectedTable && (
        <TableDetail
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}

      {showNewItem && activeTab !== 'achats' && (
        <InventoryForm
          isOpen={showNewItem}
          onClose={() => setShowNewItem(false)}
        />
      )}

      {showNewItem && activeTab === 'achats' && (
        <PurchaseForm
          isOpen={showNewItem}
          onClose={() => setShowNewItem(false)}
        />
      )}

      {showFilters && (
        <InventoryFilters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Modal pour afficher les produits d'un lieu de stockage */}
      {selectedStorageLocation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${
                  selectedStorageLocation.includes('Frigo') ? 'bg-blue-500/20' :
                  selectedStorageLocation.includes('Congélateur') ? 'bg-cyan-500/20' :
                  selectedStorageLocation === 'Remise' ? 'bg-amber-500/20' : 'bg-purple-500/20'
                }`}>
                  {selectedStorageLocation.includes('Frigo') ? <Droplets size={20} className="text-blue-400" aria-hidden="true" /> :
                   selectedStorageLocation.includes('Congélateur') ? <Thermometer size={20} className="text-cyan-400" aria-hidden="true" /> :
                   selectedStorageLocation === 'Remise' ? <Package size={20} className="text-amber-400" aria-hidden="true" /> : 
                   <Map size={20} className="text-purple-400" aria-hidden="true" />}
                </div>
                <h3 className="text-xl font-bold text-white">{selectedStorageLocation}</h3>
              </div>
              <button
                onClick={() => setSelectedStorageLocation(null)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-white/70">
                  {productList[selectedStorageLocation]?.length} produits stockés
                </p>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors flex items-center gap-2"
                aria-label="Ajouter un produit"
              >
                <Plus size={16} aria-hidden="true" />
                Ajouter un produit
              </button>
            </div>

            <div className="space-y-4">
              {/* En-tête du tableau */}
              <div className="grid grid-cols-5 gap-4 p-3 bg-white/5 rounded-lg text-white/70 text-sm font-medium">
                <div>Produit</div>
                <div>Quantité</div>
                <div>Date d'arrivée</div>
                <div>DLC</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Corps du tableau */}
              {productList[selectedStorageLocation]?.length > 0 ? (
                productList[selectedStorageLocation]?.map((product) => (
                  <div key={product.id} className="grid grid-cols-5 gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm transition-colors">
                    <div className="font-medium">{product.name}</div>
                    <div>{product.quantity}</div>
                    <div>{product.arrivalDate}</div>
                    <div>
                      {product.expiryDate === 'N/A' ? 
                        <span className="text-white/50">N/A</span> : 
                        <span className={`${
                          new Date(product.expiryDate) < new Date() ? 'text-red-400' :
                          new Date(product.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'text-amber-400' : 'text-green-400'
                        }`}>
                          {product.expiryDate}
                        </span>
                      }
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          initiateRemoveProduct(selectedStorageLocation, product);
                        }}
                        className="px-3 py-1 bg-brand-burgundy/80 hover:bg-brand-burgundy text-white text-xs rounded-lg transition-colors"
                        aria-label="Sortir"
                      >
                        Sortir
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-white/60">
                  Aucun produit stocké dans cet emplacement
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal pour ajouter un nouveau produit */}
      {showAddProduct && selectedStorageLocation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Ajouter un produit - {selectedStorageLocation}
              </h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }} className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2">Nom du produit</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                  className="w-full p-3 bg-brand-dark/80 rounded-lg text-white border border-brand-blue/30 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  placeholder="Ex: Huîtres Fines de Claire"
                  aria-label="Nom du produit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-2">Quantité</label>
                  <input
                    type="text"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    required
                    className="w-full p-3 bg-brand-dark/80 rounded-lg text-white border border-brand-blue/30 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    placeholder="Ex: 50"
                    aria-label="Quantité"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Unité</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full p-3 bg-brand-dark/80 rounded-lg text-white border border-brand-blue/30 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue appearance-none"
                    aria-label="Unité"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="tonnes">tonnes</option>
                    <option value="unités">unités</option>
                    <option value="bouteilles">bouteilles</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2">Date d'arrivée</label>
                <input
                  type="date"
                  value={newProduct.arrivalDate}
                  onChange={(e) => setNewProduct({ ...newProduct, arrivalDate: e.target.value })}
                  required
                  className="w-full p-3 bg-brand-dark/80 rounded-lg text-white border border-brand-blue/30 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  aria-label="Date d'arrivée"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Date d'expiration (DLC)</label>
                <input
                  type="date"
                  value={newProduct.expiryDate}
                  onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                  className="w-full p-3 bg-brand-dark/80 rounded-lg text-white border border-brand-blue/30 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  aria-label="Date d'expiration (DLC)"
                />
                <p className="text-xs text-white/50 mt-1">Laissez vide si non applicable</p>
              </div>

              <div className="pt-4 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                  aria-label="Annuler"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                  aria-label="Ajouter"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour ajouter un nouveau lieu de stockage */}
      {showNewStorageLocation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" role="dialog">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Nouveau lieu de stockage</h3>
              <button
                onClick={() => setShowNewStorageLocation(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Lieu de stockage</label>
                <input
                  type="text"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="Ex: Entrepôt principal"
                  aria-label="Lieu de stockage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Type de stockage</label>
                <select className="w-full p-4 bg-brand-dark/80 rounded-lg text-white border border-brand-blue/30 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue appearance-none" aria-label="Type de stockage">
                  <option value="">Sélectionner un type</option>
                  <option value="frigo">Frigo</option>
                  <option value="congelateur">Congélateur</option>
                  <option value="remise">Remise</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Capacité (estimée)</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="Ex: 1000"
                    aria-label="Capacité (estimée)"
                  />
                  <select className="p-4 bg-brand-dark/80 rounded-lg text-white border border-brand-blue/30 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue appearance-none" aria-label="Unité">
                    <option value="kg">kg</option>
                    <option value="tonnes">tonnes</option>
                    <option value="units">unités</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewStorageLocation(false)}
                  className="w-full py-2 text-sm text-white/70 hover:text-white border border-white/10 rounded-lg transition-colors"
                  aria-label="Annuler"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-full py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                  aria-label="Enregistrer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation pour sortir un produit */}
      {showRemoveConfirm && productToRemove && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Sortir un produit
              </h3>
              <button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setProductToRemove(null);
                }}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white text-lg mb-2">{productToRemove.name}</p>
              <p className="text-white/70">Quantité disponible: {productToRemove.quantity}</p>
            </div>

            <form 
              onSubmit={(e) => { 
                e.preventDefault();
                handleRemoveProduct();
              }} 
              className="space-y-4"
            >
              <div>
                <label className="block text-white/80 mb-2">Quantité à sortir</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={extractQuantityValue(productToRemove.quantity)}
                    value={removeQuantity}
                    onChange={(e) => setRemoveQuantity(e.target.value)}
                    required
                    className="w-full p-3 bg-brand-dark/80 rounded-l-lg text-white border border-brand-blue/30 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    placeholder="Quantité"
                    aria-label="Quantité à sortir"
                  />
                  <span className="bg-white/10 text-white px-4 py-3 rounded-r-lg border-t border-r border-b border-brand-blue/30">
                    {extractUnit(productToRemove.quantity)}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowRemoveConfirm(false);
                    setProductToRemove(null);
                  }}
                  className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                  aria-label="Annuler"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
                  aria-label="Confirmer"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour les charges */}
      {activeTab === 'charges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-white">Charges</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowNewChargeModal(true)}
                className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                aria-label="Nouvelle Charge"
              >
                <DollarSign size={18} aria-hidden="true" />
                Nouvelle Charge
              </button>
              <button
                onClick={() => setShowCalendarModal(true)}
                className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label="Calendrier"
              >
                <History size={18} aria-hidden="true" />
                Calendrier
              </button>
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <div className="flex justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                  <FileText className="text-brand-blue" size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-white font-medium">Carburant voiture</p>
                  <p className="text-white/60 text-sm">Date: 2025-03-01</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <p className="text-white font-medium">50 €</p>
                <button
                  onClick={() => handleViewCharge(pastCharges[0])}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Voir"
                >
                  <Eye size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="flex justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                  <FileText className="text-brand-blue" size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-white font-medium">Carburant bateau</p>
                  <p className="text-white/60 text-sm">Date: 2025-03-03</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <p className="text-white font-medium">75 €</p>
                <button
                  onClick={() => handleViewCharge(pastCharges[1])}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Voir"
                >
                  <Eye size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="flex justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                  <FileText className="text-brand-blue" size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-white font-medium">Réparation équipement</p>
                  <p className="text-white/60 text-sm">Date: 2025-03-05</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <p className="text-white font-medium">200 €</p>
                <button
                  onClick={() => handleViewCharge(pastCharges[2])}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Voir"
                >
                  <Eye size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          {showNewChargeModal && (
            <Modal
              isOpen={showNewChargeModal}
              onClose={() => setShowNewChargeModal(false)}
              title="Nouvelle Charge"
              size="lg"
            >
              <form onSubmit={handleSubmit(handleAddCharge)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nom de la charge
                  </label>
                  <input
                    {...register('chargeName', { required: 'Le nom de la charge est requis' })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    aria-label="Nom de la charge"
                  />
                  {errors.chargeName && (
                    <p className="mt-1 text-sm text-red-400">{errors.chargeName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Montant (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('amount', { required: 'Le montant est requis' })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    aria-label="Montant (€)"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                    placeholder="Ajoutez une description..."
                    aria-label="Description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Facture (photo/scan)
                  </label>
                  <div className="flex flex-col items-center justify-center p-4 border border-dashed border-white/20 rounded-lg bg-white/5">
                    {invoicePreview ? (
                      <div className="w-full space-y-3">
                        <img 
                          src={invoicePreview} 
                          alt="Aperçu de la facture" 
                          className="max-h-48 mx-auto object-contain rounded-lg"
                          aria-label="Aperçu de la facture"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveInvoice}
                          className="w-full py-2 text-sm text-white/70 hover:text-white border border-white/10 rounded-lg transition-colors"
                          aria-label="Supprimer et choisir une autre"
                        >
                          Supprimer et choisir une autre
                        </button>
                      </div>
                    ) : (
                      <div className="w-full space-y-4">
                        <div className="flex justify-center">
                          <label htmlFor="invoice-upload" className="cursor-pointer bg-white/10 hover:bg-white/15 text-white rounded-lg px-4 py-3 flex items-center justify-center transition-colors duration-200">
                            <Upload size={20} aria-hidden="true" />
                            <span>Choisir un fichier</span>
                            <input
                              id="invoice-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                              aria-label="Choisir un fichier"
                            />
                          </label>
                        </div>
                        <div className="text-center">
                          <span className="text-sm text-white/40">ou</span>
                        </div>
                        <div className="flex justify-center">
                          <button
                            type="button"
                            className="bg-white/10 hover:bg-white/15 text-white rounded-lg px-4 py-3 flex items-center justify-center transition-colors duration-200"
                            aria-label="Prendre une photo"
                          >
                            <Camera size={20} aria-hidden="true" />
                            <span>Prendre une photo</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-white/50">La facture sera disponible dans Comptabilité</p>
                </div>
                <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowNewChargeModal(false)}
                    className="px-5 py-2 border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    aria-label="Annuler"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/90 rounded-lg text-white transition-colors"
                    aria-label="Enregistrer"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </Modal>
          )}
          {showCalendarModal && (
            <Modal
              isOpen={showCalendarModal}
              onClose={() => setShowCalendarModal(false)}
              title="Calendrier"
              size="lg"
            >
              <div className="p-4">
                <p className="text-white">Ici, vous pouvez intégrer un composant de calendrier.</p>
              </div>
            </Modal>
          )}
        </div>
      )}

      {/* Modal pour afficher les détails de la facture */}
      {showInvoiceModal && selectedCharge && (
        <Modal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          title="Détails de la facture"
          size="lg"
        >
          <div className="p-4">
            <p className="text-white">Détails de la facture pour {selectedCharge.name}</p>
            {/* Add more invoice details here */}
          </div>
        </Modal>
      )}

      {/* Loading overlay for refresh */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" role="alert">
          <div className="bg-white/5 rounded-full p-4">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}