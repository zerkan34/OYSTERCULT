import React, { useState } from 'react';
import { DollarSign, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface PriceList {
  id: string;
  name: string;
  description: string;
  type: 'retail' | 'wholesale';
  products: {
    name: string;
    size: string;
    unit: string;
    price: number;
    minQuantity?: number;
  }[];
  validFrom: string;
  validTo?: string;
}

const mockPriceLists: PriceList[] = [
  {
    id: '1',
    name: 'Prix Détail 2025',
    description: 'Liste des prix pour la vente au détail',
    type: 'retail',
    products: [
      { name: 'Huîtres Plates', size: '3', unit: 'douzaine', price: 24.90 },
      { name: 'Huîtres Creuses', size: '3', unit: 'douzaine', price: 19.90 }
    ],
    validFrom: '2025-01-01',
    validTo: '2025-12-31'
  },
  {
    id: '2',
    name: 'Prix Grossiste 2025',
    description: 'Liste des prix pour la vente en gros',
    type: 'wholesale',
    products: [
      { name: 'Huîtres Plates', size: '3', unit: 'douzaine', price: 18.90, minQuantity: 100 },
      { name: 'Huîtres Creuses', size: '3', unit: 'douzaine', price: 14.90, minQuantity: 100 }
    ],
    validFrom: '2025-01-01',
    validTo: '2025-12-31'
  }
];

export function PricingConfig() {
  const [showNewPriceList, setShowNewPriceList] = useState(false);
  const [editingPriceList, setEditingPriceList] = useState<PriceList | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [priceLists, setPriceLists] = useState(mockPriceLists);

  const handleEdit = (priceList: PriceList) => {
    setEditingPriceList(priceList);
    setShowNewPriceList(true);
  };

  const handleDelete = (priceListId: string) => {
    setPriceLists(priceLists.filter(p => p.id !== priceListId));
    setShowDeleteConfirm(null);
  };

  const handleSave = (data: Partial<PriceList>) => {
    if (editingPriceList) {
      // Update existing price list
      setPriceLists(priceLists.map(p => 
        p.id === editingPriceList.id ? { ...p, ...data } : p
      ));
    } else {
      // Create new price list
      const newPriceList = {
        id: crypto.randomUUID(),
        ...data as PriceList
      };
      setPriceLists([...priceLists, newPriceList]);
    }
    setShowNewPriceList(false);
    setEditingPriceList(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Tarification</h2>
        <button
          onClick={() => {
            setEditingPriceList(null);
            setShowNewPriceList(true);
          }}
          className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nouvelle liste de prix
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {priceLists.map((priceList) => (
          <div
            key={priceList.id}
            className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-brand-primary/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                  <DollarSign size={20} className="text-brand-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-white">{priceList.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      priceList.type === 'retail'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {priceList.type === 'retail' ? 'Détail' : 'Gros'}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 mt-1">{priceList.description}</p>
                  
                  <div className="mt-4">
                    <div className="text-sm text-white/60">
                      Valide du {new Date(priceList.validFrom).toLocaleDateString('fr-FR')}
                      {priceList.validTo && ` au ${new Date(priceList.validTo).toLocaleDateString('fr-FR')}`}
                    </div>
                    
                    <div className="mt-4">
                      <table className="w-full">
                        <thead>
                          <tr className="text-sm text-white/60">
                            <th className="text-left pb-2">Produit</th>
                            <th className="text-left pb-2">Calibre</th>
                            <th className="text-right pb-2">Prix</th>
                            {priceList.type === 'wholesale' && (
                              <th className="text-right pb-2">Qté min.</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="text-white">
                          {priceList.products.map((product, index) => (
                            <tr key={index} className="border-t border-white/10">
                              <td className="py-2">{product.name}</td>
                              <td className="py-2">N°{product.size}</td>
                              <td className="text-right py-2">{product.price.toFixed(2)}€/{product.unit}</td>
                              {priceList.type === 'wholesale' && (
                                <td className="text-right py-2">{product.minQuantity}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(priceList)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Edit2 size={20} className="text-white/60" />
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(priceList.id)}
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
                  Êtes-vous sûr de vouloir supprimer cette liste de prix ? Cette action est irréversible.
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

      {showNewPriceList && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingPriceList ? 'Modifier la liste de prix' : 'Nouvelle liste de prix'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                type: formData.get('type') as 'retail' | 'wholesale',
                validFrom: formData.get('validFrom') as string,
                validTo: formData.get('validTo') as string,
                products: [] // TODO: Handle products array
              };
              handleSave(data);
            }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nom de la liste
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="Ex: Prix Détail 2025"
                    defaultValue={editingPriceList?.name}
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
                    defaultValue={editingPriceList?.type}
                    required
                  >
                    <option value="retail">Vente au détail</option>
                    <option value="wholesale">Vente en gros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="Description de la liste de prix..."
                  defaultValue={editingPriceList?.description}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Valide à partir du
                  </label>
                  <input
                    type="date"
                    name="validFrom"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    defaultValue={editingPriceList?.validFrom}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Valide jusqu'au
                  </label>
                  <input
                    type="date"
                    name="validTo"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    defaultValue={editingPriceList?.validTo}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-3">Produits</h3>
                <div className="space-y-4">
                  {(editingPriceList?.products || []).map((product, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Produit
                        </label>
                        <select 
                          name={`products[${index}].name`}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          defaultValue={product.name}
                        >
                          <option value="plates">Huîtres Plates</option>
                          <option value="creuses">Huîtres Creuses</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Calibre
                        </label>
                        <select 
                          name={`products[${index}].size`}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          defaultValue={product.size}
                        >
                          <option value="2">N°2</option>
                          <option value="3">N°3</option>
                          <option value="4">N°4</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Prix
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name={`products[${index}].price`}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          defaultValue={product.price}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Qté min.
                        </label>
                        <input
                          type="number"
                          name={`products[${index}].minQuantity`}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          defaultValue={product.minQuantity}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                    onClick={() => {
                      const newProducts = [...(editingPriceList?.products || [])];
                      newProducts.push({
                        name: 'plates',
                        size: '3',
                        price: 0,
                        minQuantity: 1
                      });
                      setEditingPriceList({
                        ...(editingPriceList || {
                          name: '',
                          description: '',
                          type: 'retail',
                          validFrom: '',
                          validTo: '',
                          products: []
                        }),
                        products: newProducts
                      });
                    }}
                  >
                    + Ajouter un produit
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPriceList(false);
                    setEditingPriceList(null);
                  }}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  {editingPriceList ? 'Mettre à jour' : 'Créer la liste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}