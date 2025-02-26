import React, { useState } from 'react';
import { Truck, Plus, Edit2, Trash2, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  type: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: string;
  products: string[];
  status: 'active' | 'inactive';
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Naissain Express',
    type: 'Naissain',
    contact: {
      name: 'Jean Martin',
      email: 'jean.martin@naissain-express.fr',
      phone: '01 23 45 67 89'
    },
    address: '123 Route de la Mer, 17000 La Rochelle',
    products: ['Naissain d\'huîtres plates', 'Naissain d\'huîtres creuses'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Emballages Océan',
    type: 'Emballages',
    contact: {
      name: 'Marie Dubois',
      email: 'contact@emballages-ocean.fr',
      phone: '02 34 56 78 90'
    },
    address: '456 Avenue du Port, 44000 Nantes',
    products: ['Bourriches', 'Cagettes', 'Étiquettes'],
    status: 'active'
  }
];

export function SupplierConfig() {
  const [showNewSupplier, setShowNewSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState(mockSuppliers);

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowNewSupplier(true);
  };

  const handleDelete = (supplierId: string) => {
    setSuppliers(suppliers.filter(s => s.id !== supplierId));
    setShowDeleteConfirm(null);
  };

  const handleSave = (data: Partial<Supplier>) => {
    if (editingSupplier) {
      // Update existing supplier
      setSuppliers(suppliers.map(s => 
        s.id === editingSupplier.id ? { ...s, ...data } : s
      ));
    } else {
      // Create new supplier
      const newSupplier = {
        id: crypto.randomUUID(),
        ...data as Supplier
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setShowNewSupplier(false);
    setEditingSupplier(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Fournisseurs</h2>
        <button
          onClick={() => {
            setEditingSupplier(null);
            setShowNewSupplier(true);
          }}
          className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nouveau fournisseur
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-brand-primary/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                  <Truck size={20} className="text-brand-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-white">{supplier.name}</h3>
                    <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/70">
                      {supplier.type}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-white/60">
                        <Mail size={16} className="mr-2" />
                        {supplier.contact.email}
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <Phone size={16} className="mr-2" />
                        {supplier.contact.phone}
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <MapPin size={16} className="mr-2" />
                        {supplier.address}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">Produits fournis</h4>
                      <div className="flex flex-wrap gap-2">
                        {supplier.products.map((product, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/70"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(supplier)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Edit2 size={20} className="text-white/60" />
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(supplier.id)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="text-white/60" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewSupplier && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('name') as string,
                type: formData.get('type') as string,
                contact: {
                  name: formData.get('contactName') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                },
                address: formData.get('address') as string,
                products: formData.getAll('products') as string[],
                status: 'active' as const
              };
              handleSave(data);
            }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nom du fournisseur
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="Ex: Naissain Express"
                    defaultValue={editingSupplier?.name}
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
                    defaultValue={editingSupplier?.type}
                    required
                  >
                    <option value="naissain">Naissain</option>
                    <option value="emballages">Emballages</option>
                    <option value="materiels">Matériels</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-3">Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">
                      Nom du contact
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      defaultValue={editingSupplier?.contact.name}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      defaultValue={editingSupplier?.contact.email}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      defaultValue={editingSupplier?.contact.phone}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Adresse
                </label>
                <textarea
                  name="address"
                  rows={2}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="Adresse complète..."
                  defaultValue={editingSupplier?.address}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Produits fournis
                </label>
                <div className="space-y-2">
                  {['Naissain', 'Bourriches', 'Matériel d\'élevage'].map((product) => (
                    <label key={product} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="products"
                        value={product}
                        className="w-4 h-4 bg-white/5 border border-white/10 rounded"
                        defaultChecked={editingSupplier?.products.includes(product)}
                      />
                      <span className="text-white">{product}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewSupplier(false);
                    setEditingSupplier(null);
                  }}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  {editingSupplier ? 'Mettre à jour' : 'Créer le fournisseur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible.
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
    </div>
  );
}