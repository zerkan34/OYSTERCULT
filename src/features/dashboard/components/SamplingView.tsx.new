import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FilePlus, Save, Shell, AlertTriangle } from 'lucide-react';

interface SamplingViewProps {
  tableName: string;
  currentSize?: string;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export function SamplingView({ tableName, currentSize, onCancel, onSubmit }: SamplingViewProps) {
  // Animation optimisée utilisant transform
  const fadeIn = {
    initial: { opacity: 0, transform: 'translateY(20px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
    transition: { duration: 0.4 }
  };
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    size: currentSize || 'N°4',
    weight: '',
    quantity: '',
    notes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <motion.div 
      {...fadeIn}
      className="space-y-6 transform-gpu"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
          <FilePlus size={20} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-white">Nouvel échantillonnage</h3>
          <p className="text-sm text-white/70">Enregistrez un nouvel échantillonnage pour {tableName}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-white/80 mb-1">
              Date d'échantillonnage
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="glass-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-white/80 mb-1">
              Calibre actuel
            </label>
            <select
              name="size"
              id="size"
              value={formData.size}
              onChange={handleChange}
              required
              className="glass-input w-full"
            >
              <option value="T15">T15</option>
              <option value="N°5">N°5</option>
              <option value="N°4">N°4</option>
              <option value="N°3">N°3</option>
              <option value="N°2">N°2</option>
              <option value="N°1">N°1</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-white/80 mb-1">
              Poids moyen (g)
            </label>
            <input
              type="number"
              name="weight"
              id="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="glass-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-white/80 mb-1">
              Quantité échantillonnée
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              required
              className="glass-input w-full"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-white/80 mb-1">
            Observations
          </label>
          <textarea
            name="notes"
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="glass-input w-full"
            placeholder="Observations sur la qualité et l'état des huîtres..."
          ></textarea>
        </div>
        
        <div className="glass-effect rounded-lg p-4 bg-blue-500/10 mt-5">
          <div className="flex items-start">
            <Shell size={20} className="text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <div className="text-white font-medium mb-1">Informations sur l'échantillonnage</div>
              <div className="text-sm text-white/80">
                Les données d'échantillonnage sont essentielles pour suivre la croissance et la qualité des huîtres. 
                Effectuez un échantillonnage régulier pour optimiser votre production.
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center"
          >
            <Save size={18} className="mr-2" />
            Enregistrer
          </button>
        </div>
      </form>
    </motion.div>
  );
}
