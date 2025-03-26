import React from 'react';

interface SaleFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function SaleForm({ onSubmit, onCancel }: SaleFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    onSubmit({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="client" className="block text-sm font-medium text-white/70 mb-2">
          Client
        </label>
        <input
          type="text"
          id="client"
          name="client"
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors"
          placeholder="Nom du client"
        />
      </div>

      <div>
        <label htmlFor="products" className="block text-sm font-medium text-white/70 mb-2">
          Produits
        </label>
        <select
          id="products"
          name="products"
          multiple
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors"
        >
          <option value="huitres-speciales">Huîtres Spéciales N°2</option>
          <option value="huitres-fines">Huîtres Fines N°3</option>
          <option value="huitres-plates">Huîtres Plates</option>
        </select>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-white/70 mb-2">
          Quantité
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors"
          placeholder="Nombre de douzaines"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-white/70 mb-2">
          Prix unitaire (€)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          step="0.01"
          min="0"
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors"
          placeholder="29.90"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-white/70 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors"
          placeholder="Informations complémentaires..."
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
        >
          Créer la vente
        </button>
      </div>
    </form>
  );
}
