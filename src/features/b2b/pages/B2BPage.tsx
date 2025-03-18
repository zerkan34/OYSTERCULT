import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Building, Truck, Users, BadgePercent, PhoneCall, Waves } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';

const features = [
  {
    title: "Commandes en gros",
    description: "Accédez à nos tarifs professionnels et passez vos commandes en gros directement en ligne.",
    icon: Building
  },
  {
    title: "Facturation simplifiée",
    description: "Gérez vos factures et accédez à votre historique de commandes en un clic.",
    icon: BadgePercent
  },
  {
    title: "Support dédié",
    description: "Bénéficiez d'un accompagnement personnalisé avec notre équipe commerciale.",
    icon: PhoneCall
  }
];

const services = [
  {
    items: [
      "Livraison express garantie",
      "Tarifs préférentiels",
      "Suivi qualité personnalisé"
    ],
    icon: Truck
  },
  {
    items: [
      "Accès prioritaire aux nouveautés",
      "Événements exclusifs",
      "Formation et conseil"
    ],
    icon: Users
  }
];

export function B2BPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 space-y-8"
    >
      <PageTitle 
        icon={<Building2 size={28} className="text-white" />}
        title="Espace Pro"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index}
              className="bg-[#1a1c25] p-6 rounded-xl border border-[#2a2d3a] hover:border-cyan-800 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[rgba(0,128,128,0.2)] to-[rgba(0,60,100,0.2)]">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              </div>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-6">
          Nos services professionnels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="bg-[#1a1c25] p-6 rounded-xl border border-[#2a2d3a] hover:border-cyan-800 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[rgba(0,128,128,0.2)] to-[rgba(0,60,100,0.2)]">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <ul className="space-y-4 text-gray-400">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <div className="glass-effect rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Waves className="mr-2 text-blue-400" size={18} />
            Occupation de la table
          </h3>
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-white">85%</div>
            <div className="text-sm text-white/60">9/10 unités</div>
          </div>
          <div className="grid grid-cols-10 gap-1 w-full mt-2" style={{ backgroundColor: "rgb(7, 26, 64)" }}>
            <div className="w-full h-7 rounded-sm border border-white/10 bg-transparent"></div>
            <div className="w-full h-7 rounded-sm border border-white/10 bg-[#a02648]"></div>
            <div className="w-full h-7 rounded-sm border border-white/10 bg-[#a02648]"></div>
            <div className="w-full h-7 rounded-sm border border-white/10 bg-[#a02648]"></div>
            <div className="w-full h-7 rounded-sm border border-white/10 bg-[#a02648]"></div>
            <div className="w-full h-7 rounded-sm border border-white/10 bg-[#a02648]"></div>
            <div className="w-full h-7 rounded-sm border border-white/10 bg-[#a02648]"></div>
            <div className="w-full h-7 rounded-sm border border-white/10 bg-[#a02648]"></div>
            <div className="w-full h-7 rounded-sm border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 bg-[#a02648]" style={{ width: "50%" }}></div>
            </div>
            <div className="w-full h-7 rounded-sm border border-white/10 bg-transparent"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
