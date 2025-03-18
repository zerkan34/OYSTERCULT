import React from 'react';
import { motion } from 'framer-motion';
import { ModernCardBase } from '@/components/ui/ModernCardBase';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useStore } from '@/lib/store';
import { OtherLocations } from '../components/OtherLocations';

interface Stock {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  lastUpdate: Date;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    transform: 'translateY(20px)'
  },
  visible: { 
    opacity: 1,
    transform: 'translateY(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.25, 0, 1]
    }
  }
};

const mockStocks: Stock[] = [
  { id: '1', name: 'Huîtres N°3', quantity: 1000, unit: 'pièces', location: 'Bassin A', lastUpdate: new Date() },
  { id: '2', name: 'Huîtres N°2', quantity: 500, unit: 'pièces', location: 'Bassin B', lastUpdate: new Date() },
  { id: '3', name: 'Huîtres N°1', quantity: 300, unit: 'pièces', location: 'Bassin C', lastUpdate: new Date() }
];

export const StockPage: React.FC = () => {
  const [stocks, setStocks] = React.useState<Stock[]>(mockStocks);
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full space-y-6"
    >
      <ModernCardBase>
        <div className="glass-effect rounded-xl p-6 border border-white/10">
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Stock</h2>
              <p className="text-sm text-white/60 mt-1">Gérez votre inventaire d'huîtres</p>
            </div>
            <Button className="bg-brand-burgundy hover:bg-brand-burgundy/90 text-white px-4 py-2 rounded-lg transition-all duration-200 ease-out transform hover:-translate-y-px">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau stock
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Rechercher un stock..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white"
              />
            </div>
            <Button variant="outline" className="px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-all duration-200 ease-out transform hover:-translate-y-px">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <motion.div
                key={stock.id}
                variants={itemVariants}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">{stock.name}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-burgundy/20 text-brand-burgundy">
                    {stock.location}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-white/60">
                  <p>Quantité: {stock.quantity} {stock.unit}</p>
                  <p>Dernière mise à jour: {stock.lastUpdate.toLocaleDateString()}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Button variant="outline" className="w-full px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-all duration-200 ease-out transform hover:-translate-y-px">
                    Voir les détails
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ModernCardBase>

      <ModernCardBase>
        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Autres emplacements</h2>
            <p className="text-sm text-white/60 mt-1">Gérez vos espaces de stockage additionnels</p>
          </div>
          <OtherLocations />
        </motion.div>
      </ModernCardBase>
    </motion.div>
  );
};
