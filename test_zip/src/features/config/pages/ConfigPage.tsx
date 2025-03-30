import React, { useState } from 'react';
import { Settings, Building2, Users, Package, Truck, DollarSign, Map, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompanySettings } from '../components/CompanySettings';
import { UserRoles } from '../components/UserRoles';
import { ProductConfig } from '../components/ProductConfig';
import { SupplierConfig } from '../components/SupplierConfig';
import { PricingConfig } from '../components/PricingConfig';
import { LocationConfig } from '../components/LocationConfig';
import { UnitConfig } from '../components/UnitConfig';
import { OysterLogo } from '@/components/ui/OysterLogo';

type ConfigSection = 'company' | 'roles' | 'products' | 'suppliers' | 'pricing' | 'locations' | 'units';

const sections: { id: ConfigSection; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    id: 'company', 
    label: 'Entreprise', 
    icon: <Building2 size={20} />,
    description: 'Informations et paramètres de l\'entreprise'
  },
  { 
    id: 'roles', 
    label: 'Rôles & Permissions', 
    icon: <Users size={20} />,
    description: 'Gestion des accès et des droits utilisateurs'
  },
  { 
    id: 'products', 
    label: 'Produits', 
    icon: <Package size={20} />,
    description: 'Configuration des produits et du catalogue'
  },
  { 
    id: 'suppliers', 
    label: 'Fournisseurs', 
    icon: <Truck size={20} />,
    description: 'Gestion des fournisseurs et partenaires'
  },
  { 
    id: 'pricing', 
    label: 'Tarification', 
    icon: <DollarSign size={20} />,
    description: 'Configuration des prix et remises'
  },
  { 
    id: 'locations', 
    label: 'Emplacements', 
    icon: <Map size={20} />,
    description: 'Gestion des zones et emplacements'
  },
  { 
    id: 'units', 
    label: 'Unités & Mesures', 
    icon: <Scale size={20} />,
    description: 'Configuration des unités de mesure'
  }
];

export function ConfigPage() {
  const [activeSection, setActiveSection] = useState<ConfigSection>('company');

  const renderSection = () => {
    switch (activeSection) {
      case 'company':
        return <CompanySettings />;
      case 'roles':
        return <UserRoles />;
      case 'products':
        return <ProductConfig />;
      case 'suppliers':
        return <SupplierConfig />;
      case 'pricing':
        return <PricingConfig />;
      case 'locations':
        return <LocationConfig />;
      case 'units':
        return <UnitConfig />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg" />
          <Settings size={24} className="text-[#00D1FF] relative z-10" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Configuration
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Menu latéral */}
        <motion.div 
          className="col-span-3 rounded-xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.3) 0%, rgba(20,100,100,0.3) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 20px -5px, rgba(0, 150, 255, 0.1) 0px 8px 16px -8px, rgba(255, 255, 255, 0.07) 0px -1px 2px 0px inset, rgba(0, 65, 255, 0.05) 0px 0px 8px inset, rgba(0, 0, 0, 0.05) 0px 0px 1px inset'
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <nav className="space-y-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-start p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                  activeSection === section.id 
                    ? 'bg-[#00D1FF]/10 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-shrink-0 mt-1">
                  {section.icon}
                </div>
                <div className="ml-3 text-left">
                  <span className="block font-medium">{section.label}</span>
                  <span className={`text-sm ${
                    activeSection === section.id ? 'text-white/80' : 'text-white/40'
                  }`}>
                    {section.description}
                  </span>
                </div>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Contenu principal */}
        <motion.div 
          className="col-span-9 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.3) 0%, rgba(20,100,100,0.3) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 20px -5px, rgba(0, 150, 255, 0.1) 0px 8px 16px -8px, rgba(255, 255, 255, 0.07) 0px -1px 2px 0px inset, rgba(0, 65, 255, 0.05) 0px 0px 8px inset, rgba(0, 0, 0, 0.05) 0px 0px 1px inset'
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}