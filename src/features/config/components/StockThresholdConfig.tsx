import React, { useState } from 'react';
import { Package, AlertTriangle, Zap, Settings, Save, Plus, Edit2, Tag, Table, ShoppingCart, Check, X } from 'lucide-react';

interface ProductStockThreshold {
  id: string;
  name: string;
  category: string;
  minStock: number;
  maxStock: number;
  unit: string;
  currentStock: number;
}

const mockProducts: ProductStockThreshold[] = [
  {
    id: '1',
    name: 'Huîtres Plates',
    category: 'Huîtres',
    minStock: 100,
    maxStock: 1000,
    unit: 'douzaine',
    currentStock: 250
  },
  {
    id: '2',
    name: 'Huîtres Creuses',
    category: 'Huîtres',
    minStock: 200,
    maxStock: 2000,
    unit: 'douzaine',
    currentStock: 150
  },
  {
    id: '3',
    name: 'Huîtres Spéciales',
    category: 'Huîtres',
    minStock: 50,
    maxStock: 500,
    unit: 'douzaine',
    currentStock: 30
  }
];

export function StockThresholdConfig() {
  const [products, setProducts] = useState(mockProducts);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, { minStock: number; maxStock: number }>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'product' | 'purchase' | 'table' | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    minStock: 0,
    maxStock: 0,
    unit: 'unité',
    currentStock: 0
  });

  const handleEditToggle = () => {
    if (editMode) {
      // Apply changes when exiting edit mode
      const updatedProducts = products.map(product => ({
        ...product,
        minStock: editValues[product.id]?.minStock ?? product.minStock,
        maxStock: editValues[product.id]?.maxStock ?? product.maxStock
      }));
      setProducts(updatedProducts);
      setEditValues({});
    } else {
      // Initialize edit values when entering edit mode
      const initialEditValues: Record<string, { minStock: number; maxStock: number }> = {};
      products.forEach(product => {
        initialEditValues[product.id] = {
          minStock: product.minStock,
          maxStock: product.maxStock
        };
      });
      setEditValues(initialEditValues);
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (productId: string, field: 'minStock' | 'maxStock', value: number) => {
    setEditValues(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const handleAddClick = (type: 'product' | 'purchase' | 'table') => {
    setAddType(type);
    setShowAddModal(true);
    
    // Reset form
    setNewItem({
      name: '',
      category: type === 'product' ? 'Huîtres' : type === 'purchase' ? 'Achats' : 'Tables',
      minStock: 0,
      maxStock: 0,
      unit: type === 'product' ? 'douzaine' : type === 'purchase' ? 'unité' : 'pochon',
      currentStock: 0
    });
  };

  const handleNewItemChange = (field: string, value: any) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddItem = () => {
    const newProduct: ProductStockThreshold = {
      id: `${Date.now()}`,
      ...newItem
    };

    setProducts(prev => [...prev, newProduct]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Configuration des Seuils de Stock</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => handleAddClick('product')}
            className="flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Ajouter un produit"
          >
            <Plus size={20} className="mr-2" />
            Ajouter
          </button>
          <button
            onClick={handleEditToggle}
            className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
              editMode 
                ? 'bg-brand-primary hover:bg-brand-primary/90' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-label={editMode ? "Enregistrer les modifications" : "Modifier les seuils"}
          >
            {editMode ? (
              <>
                <Save size={20} className="mr-2" />
                Enregistrer
              </>
            ) : (
              <>
                <Settings size={20} className="mr-2" />
                Modifier les seuils
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 bg-white/5">
          <div className="col-span-2 text-sm font-medium text-white">Produit</div>
          <div className="text-sm font-medium text-white">Stock actuel</div>
          <div className="text-sm font-medium text-white">Seuil minimum</div>
          <div className="text-sm font-medium text-white">Seuil maximum</div>
          <div className="text-sm font-medium text-white">Statut</div>
        </div>

        <div className="divide-y divide-white/10">
          {products.map((product) => {
            const isLowStock = product.currentStock < product.minStock;
            
            return (
              <div key={product.id} className="grid grid-cols-6 gap-4 p-4 items-center">
                <div className="col-span-2 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                    <Package size={20} className="text-brand-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{product.name}</div>
                    <div className="text-sm text-white/60">{product.category}</div>
                  </div>
                </div>

                <div className="text-white">
                  {product.currentStock} {product.unit}s
                </div>

                <div>
                  {editMode ? (
                    <input
                      type="number"
                      value={editValues[product.id]?.minStock}
                      onChange={(e) => handleInputChange(product.id, 'minStock', Number(e.target.value))}
                      min="0"
                      className="w-full px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-white"
                      aria-label={`Seuil minimum pour ${product.name}`}
                    />
                  ) : (
                    <div className="text-white">{product.minStock} {product.unit}s</div>
                  )}
                </div>

                <div>
                  {editMode ? (
                    <input
                      type="number"
                      value={editValues[product.id]?.maxStock}
                      onChange={(e) => handleInputChange(product.id, 'maxStock', Number(e.target.value))}
                      min="0"
                      className="w-full px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-white"
                      aria-label={`Seuil maximum pour ${product.name}`}
                    />
                  ) : (
                    <div className="text-white">{product.maxStock} {product.unit}s</div>
                  )}
                </div>

                <div>
                  {isLowStock ? (
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <AlertTriangle size={16} />
                      <span>Stock bas</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-400">
                      <Zap size={16} />
                      <span>Optimal</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editMode && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="text-blue-400">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="text-blue-400 font-medium">Mode édition</h3>
              <p className="text-blue-400/80 text-sm mt-1">
                Modifiez les seuils de stock pour chaque produit. Cliquez sur "Enregistrer" pour appliquer les modifications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-xl max-w-xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {addType === 'product' && 'Ajouter un produit'}
                {addType === 'purchase' && 'Ajouter un achat'}
                {addType === 'table' && 'Ajouter une table'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-white/60 hover:text-white"
                aria-label="Fermer"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="item-type">
                  Type d'élément
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddClick('product')}
                    className={`flex items-center justify-center p-3 rounded-lg ${
                      addType === 'product' ? 'bg-brand-primary text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                    aria-pressed={addType === 'product'}
                  >
                    <Package size={18} className="mr-2" />
                    Produit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddClick('purchase')}
                    className={`flex items-center justify-center p-3 rounded-lg ${
                      addType === 'purchase' ? 'bg-brand-primary text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                    aria-pressed={addType === 'purchase'}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Achat
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddClick('table')}
                    className={`flex items-center justify-center p-3 rounded-lg ${
                      addType === 'table' ? 'bg-brand-primary text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                    aria-pressed={addType === 'table'}
                  >
                    <Table size={18} className="mr-2" />
                    Table
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="item-name">
                  Nom
                </label>
                <input
                  type="text"
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => handleNewItemChange('name', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder={
                    addType === 'product' 
                      ? 'ex: Huîtres Plates' 
                      : addType === 'purchase' 
                        ? 'ex: Matériel d\'emballage' 
                        : 'ex: Table A1'
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="item-category">
                  Catégorie
                </label>
                <input
                  type="text"
                  id="item-category"
                  value={newItem.category}
                  onChange={(e) => handleNewItemChange('category', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder={
                    addType === 'product' 
                      ? 'ex: Huîtres' 
                      : addType === 'purchase' 
                        ? 'ex: Fournitures' 
                        : 'ex: Production'
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="min-stock">
                    Seuil minimum
                  </label>
                  <input
                    type="number"
                    id="min-stock"
                    value={newItem.minStock}
                    onChange={(e) => handleNewItemChange('minStock', Number(e.target.value))}
                    min="0"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="max-stock">
                    Seuil maximum
                  </label>
                  <input
                    type="number" 
                    id="max-stock"
                    value={newItem.maxStock}
                    onChange={(e) => handleNewItemChange('maxStock', Number(e.target.value))}
                    min="0"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="current-stock">
                    Stock actuel
                  </label>
                  <input
                    type="number"
                    id="current-stock"
                    value={newItem.currentStock}
                    onChange={(e) => handleNewItemChange('currentStock', Number(e.target.value))}
                    min="0"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="unit">
                    Unité
                  </label>
                  <input
                    type="text"
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) => handleNewItemChange('unit', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                    placeholder={
                      addType === 'product' 
                        ? 'ex: douzaine' 
                        : addType === 'purchase' 
                          ? 'ex: unité' 
                          : 'ex: pochon'
                    }
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Annuler"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!newItem.name}
                className={`px-4 py-2 bg-brand-primary text-white rounded-lg transition-colors ${
                  newItem.name ? 'hover:bg-brand-primary/90' : 'opacity-50 cursor-not-allowed'
                }`}
                aria-label="Ajouter"
              >
                <Check size={18} className="mr-2 inline-block" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
