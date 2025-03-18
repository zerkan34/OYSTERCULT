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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

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
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 p-6"
    >
      {/* En-tête avec titre */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
          padding: "1.5rem",
          borderRadius: "1rem",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "rgba(0, 0, 0, 0.3) 0px 10px 25px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset"
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#00D1FF]/20 blur-xl rounded-full" />
            <Settings size={24} className="text-[#00D1FF] relative z-10" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent" 
            style={{ backgroundImage: "linear-gradient(90deg, #ffffff, #a5f3fc)" }}>
            Configuration
          </h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Menu latéral */}
        <motion.div 
          variants={itemVariants}
          className="col-span-3 rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
          }}
        >
          <nav className="p-4 space-y-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-start p-4 rounded-lg transition-all duration-300 group relative overflow-hidden
                  ${activeSection === section.id 
                    ? 'bg-[#00D1FF]/10 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: activeSection === section.id 
                    ? "linear-gradient(135deg, rgba(0, 209, 255, 0.15) 0%, rgba(0, 209, 255, 0.05) 100%)"
                    : "transparent"
                }}
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
                {activeSection === section.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#00D1FF]/10 to-transparent"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Contenu principal */}
        <motion.div 
          variants={itemVariants}
          className="col-span-9 rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
          }}
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
    </motion.div>
  );
}