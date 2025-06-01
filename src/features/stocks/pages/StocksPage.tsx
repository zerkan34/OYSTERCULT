import { useState } from "react";
import { Plus, Filter, Search, Edit2, Trash2, Eye, X, Package2, CircleDot, Scale, MapPin, FileText } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

type Stock = Doc<"stocks">;

export function StocksPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "",
    quantity: 0,
    location: {
      latitude: 0,
      longitude: 0,
    },
    description: "",
  });

  const stocks = useQuery(api.stocks.getAll) || [];
  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Ajouter la logique de soumission du formulaire ici
  };

  const handleDelete = () => {
    // Ajouter la logique de suppression du stock ici
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      {/* Header - Fixed */}
      <div className="flex-none p-6 space-y-8 bg-[rgba(0,10,40,0.97)]">
        <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Gestion des Stocks
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
        >
          <Plus size={20} />
          <span>Ajouter un stock</span>
        </button>
      </div>

        {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
          <input
            type="text"
            placeholder="Rechercher un stock..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 min-h-[44px]"
          />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
        >
          <Filter size={20} />
          <span>Filtrer</span>
        </button>
      </div>

      </div>
      {/* Stocks Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 pb-96">
        <div className="relative grid grid-cols-2 gap-4 transform rotate-0">
        {filteredStocks.map((stock, index) => (
          <button
            key={stock._id}
            onClick={() => {
              setSelectedStock(stock);
              setIsViewModalOpen(true);
            }}
            className="relative rounded-md transition-all duration-300 group bg-brand-burgundy shadow-neon"
            style={{ opacity: 0.6, transform: `scale(${0.95 + (index * 0.005)})` }}
          >
            <div className="absolute inset-0 rounded-md border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute top-0 right-0 bottom-0 bg-[#22c55e]" 
                  style={{ width: `${(stock.quantity / 100) * 100}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-white font-bold relative z-10">{index + 1}</span>
              </div>
            </div>
            <div className="absolute bottom-1 right-1 text-[8px] text-white/60">{stock.type}</div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-md transition-opacity">
              <Edit2 className="text-white" size={16} />
            </div>
          </button>
        ))}
        </div>
        {/* Spacer pour forcer le défilement */}
        <div className="h-[200vh]"></div>
      </div>

      {/* Modal de visualisation */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center lg:ml-[4.5rem]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedStock(null)} />
          <div className="w-full max-w-2xl glass-effect rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Package2 size={20} className="mr-2 text-brand-burgundy" />
                {selectedStock.name}
              </h3>
              <button 
                onClick={() => setSelectedStock(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center text-white/80 mb-2">
                    <CircleDot size={20} className="mr-2 text-brand-burgundy" />
                    Type
                  </div>
                  <div className="text-2xl font-bold text-white">{selectedStock.type}</div>
                </div>
                
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center text-white/80 mb-2">
                    <CircleDot size={20} className="mr-2 text-brand-primary" />
                    Status
                  </div>
                  <div className="text-2xl font-bold text-white">{selectedStock.status}</div>
                </div>
                
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center text-white/80 mb-2">
                    <Scale size={20} className="mr-2 text-brand-tertiary" />
                    Quantité
                  </div>
                  <div className="text-2xl font-bold text-white">{selectedStock.quantity}</div>
                </div>
              </div>

              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center text-white/80 mb-4">
                  <MapPin size={20} className="mr-2 text-brand-burgundy" />
                  Localisation
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Latitude</span>
                    <span className="text-white font-medium">{selectedStock.location.latitude}°</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Longitude</span>
                    <span className="text-white font-medium">{selectedStock.location.longitude}°</span>
                  </div>
                </div>
              </div>

              {selectedStock.description && (
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center text-white/80 mb-4">
                    <FileText size={20} className="mr-2 text-brand-tertiary" />
                    Description
                  </div>
                  <p className="text-white/80">{selectedStock.description}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  onClick={() => {
                    setSelectedStock(null);
                    setIsEditModalOpen(true);
                  }}
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  Modifier
                </button>
                <button 
                  onClick={() => setSelectedStock(null)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout/édition */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center lg:ml-[4.5rem]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }} />
          <div className="w-full max-w-2xl glass-effect rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Plus size={20} className="mr-2 text-brand-burgundy" />
                {isEditModalOpen ? "Modifier le stock" : "Ajouter un stock"}
              </h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-effect rounded-lg p-4">
                  <label className="block text-white/80 mb-2" htmlFor="name">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 rounded-lg px-3 py-2 text-white border border-white/20 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50"
                    required
                  />
                </div>

                <div className="glass-effect rounded-lg p-4">
                  <label className="block text-white/80 mb-2" htmlFor="type">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 rounded-lg px-3 py-2 text-white border border-white/20 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50"
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="Matériel">Matériel</option>
                    <option value="Consommable">Consommable</option>
                    <option value="Équipement">Équipement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-effect rounded-lg p-4">
                  <label className="block text-white/80 mb-2" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 rounded-lg px-3 py-2 text-white border border-white/20 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50"
                    required
                  >
                    <option value="">Sélectionner un status</option>
                    <option value="En stock">En stock</option>
                    <option value="Faible">Faible</option>
                    <option value="Épuisé">Épuisé</option>
                  </select>
                </div>

                <div className="glass-effect rounded-lg p-4">
                  <label className="block text-white/80 mb-2" htmlFor="quantity">
                    Quantité
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 rounded-lg px-3 py-2 text-white border border-white/20 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center text-white/80 mb-4">
                  <MapPin size={20} className="mr-2 text-brand-burgundy" />
                  Localisation
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 mb-2" htmlFor="latitude">
                      Latitude
                    </label>
                    <input
                      type="number"
                      id="latitude"
                      name="location.latitude"
                      value={formData.location.latitude}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 rounded-lg px-3 py-2 text-white border border-white/20 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50"
                      required
                      step="any"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-2" htmlFor="longitude">
                      Longitude
                    </label>
                    <input
                      type="number"
                      id="longitude"
                      name="location.longitude"
                      value={formData.location.longitude}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 rounded-lg px-3 py-2 text-white border border-white/20 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50"
                      required
                      step="any"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-lg p-4">
                <label className="block text-white/80 mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 rounded-lg px-3 py-2 text-white border border-white/20 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 min-h-[100px]"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  {isEditModalOpen ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {isDeleteModalOpen && selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center lg:ml-[4.5rem]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="w-full max-w-md glass-effect rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Trash2 size={20} className="mr-2 text-red-400" />
                Supprimer le stock
              </h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-white/80">
                Êtes-vous sûr de vouloir supprimer le stock "{selectedStock.name}" ? Cette action est irréversible.
              </p>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="relative rounded-md transition-all duration-300 group bg-brand-burgundy shadow-neon" style={{ opacity: 0.6 }}
                >
                  <div className="absolute inset-0 rounded-md border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-0 right-0 bottom-0 bg-[#22c55e]" style={{ width: '76%' }}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-white font-bold relative z-10">1</span>
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 text-[8px] text-white/60"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-md transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen text-white">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"></path>
                    </svg>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-full h-full">
                    Supprimer
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
