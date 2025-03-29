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
import './config.css';

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
    id: 'pricing', 
    label: 'Tarification', 
    icon: <DollarSign size={20} />,
    description: 'Configuration des prix et remises'
  },
  { 
    id: 'locations', 
    label: 'Emplacements', 
    icon: <Map size={20} />,
    description: 'Configuration des tables'
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
    <div className="max-w-7xl mx-auto space-y-8 p-6 animate-fadeIn">
      {/* En-tête avec titre */}
      <div className="config-container">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-lg" />
            <Settings size={24} className="text-cyan-400 relative z-10" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Configuration
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Menu latéral */}
        <nav className="col-span-3">
          <div className="config-container space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all duration-300
                  ${activeSection === section.id 
                    ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'}
                  min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40
                `}
                aria-selected={activeSection === section.id}
                role="tab"
              >
                <span className="flex items-center justify-center w-5 h-5">
                  {section.icon}
                </span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{section.label}</span>
                  <span className="text-sm text-white/70">{section.description}</span>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="col-span-9">
          <div className="config-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}