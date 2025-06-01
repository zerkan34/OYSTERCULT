import React from 'react';
import { motion } from 'framer-motion';
import { X, Package, Calendar, MapPin, ArrowRight, Info, Percent as PercentIcon, History } from 'lucide-react';

type LotStatus = 'EN_TRANSIT' | 'TERMINE' | 'PROBLEME';

interface Lot {
  id: string;
  nom: string;
  numeroLot: string;
  statut: LotStatus;
  origine?: string;
  destination?: string;
  quantite?: number;
  estimationRemplissage?: number;
  unite?: string;
  mortalite?: number;
  datePrevue?: string;
}

const LotsEnCoursPanel = () => {
  const containerStyle = {
    paddingBottom: '60rem' // Ajoute beaucoup d'espace en bas
  };
  // Données de démonstration
  const demoLots: Lot[] = [
    {
      id: '1',
      nom: 'Lot Huîtres Triploïdes #NORD-101',
      numeroLot: 'NORD-101',
      statut: 'EN_TRANSIT',
      origine: 'Charente Maritime',
      destination: 'Trempe',
      quantite: 10,
      estimationRemplissage: 15,
      unite: 'pochons',
      mortalite: 16.9,
      datePrevue: '2025-05-02T11:00:00'
    },
    {
      id: '2',
      nom: 'Lot Huîtres Triploïdes #NORD-202',
      numeroLot: 'NORD-202',
      statut: 'EN_TRANSIT',
      origine: 'Arcachon',
      destination: 'Trempe',
      quantite: 8,
      estimationRemplissage: 12,
      unite: 'pochons',
      mortalite: 15.7,
      datePrevue: '2025-05-02T13:00:00'
    },
    {
      id: '3',
      nom: 'Lot Huîtres Triploïdes #TREMPE-301',
      numeroLot: 'TREMPE-301',
      statut: 'EN_TRANSIT',
      origine: 'Arcachon',
      destination: 'Bassins',
      quantite: 15,
      estimationRemplissage: 130,
      unite: 'kg',
      mortalite: 24,
      datePrevue: '2025-05-02T15:00:00'
    }
  ];

  return (
    <div
      className="lots-panel-position"
      style={{
        position: 'fixed',
        top: '116px',
        right: '1rem',
        zIndex: 50,
        transition: 'top 0.3s ease'
      }}
    >
      <div 
        className="lots-en-cours-panel fixed top-16 bottom-0 right-0 z-50 md:rounded-l-xl flex flex-col focus:outline-none bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-[10px] border border-white/10 shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset] focus:outline-none focus:ring-2 focus:ring-cyan-500/40" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="lots-en-cours-title" 
        tabIndex={-1} 
        style={{ 
          width: '380px', 
          height: 'calc(-64px + 100vh)',
          right: '16px',
          top: '116px !important'
        }}
      >
        <div className="h-full flex flex-col">
          {/* En-tête */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-br from-[rgba(15,23,42,0.5)] to-[rgba(20,80,100,0.5)]">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg -z-10"></div>
          <div className="absolute -bottom-1 left-0 right-0 flex justify-center space-x-1">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="text-cyan-400 text-[10px] font-mono"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 1.8, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  delay: i * 0.2
                }}
              >
                ≈
              </motion.div>
            ))}
          </div>
            <div className="flex justify-center items-center my-2 relative">
              <div className="absolute left-0">
                <div className="relative">
                  <div className="relative">
                    <Package className="text-cyan-400" />
                    <span className="absolute -bottom-2 -left-1 text-[10px] font-medium text-cyan-400">N°3</span>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-[0_0_4px_rgba(0,180,180,0.3)]">3</span>
                </div>
              </div>
              <h2 id="lots-en-cours-title" className="text-3xl font-bold text-white whitespace-nowrap">Lots en cours</h2>
              <div className="absolute right-0 flex items-center">
                <button 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white/60 hover:text-cyan-400 ml-2" 
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-4 bg-gradient-to-br from-[rgba(15,23,42,0.4)] to-[rgba(20,90,90,0.4)] border-b border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <History className="text-cyan-400" />
              <h3 className="text-lg font-medium text-white">Mouvement des lots</h3>
            </div>
            <div className="text-sm text-white/70">
              Suivez le parcours de vos lots en cours. Chaque mouvement validé sera automatiquement enregistré dans les modules Stocks et Traçabilité, permettant une mise à jour complète de votre inventaire et de l'historique de production.
            </div>
          </div>

          {/* Liste des lots */}
          <div className="flex-1 p-6" style={{ position: 'relative' }}>
            <div className="space-y-4" style={containerStyle}>
              {demoLots.map((lot) => (
                <LotItem key={lot.id} lot={lot} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant LotItem pour afficher chaque lot
const LotItem = ({ lot }: { lot: Lot }) => {
  return (
    <div 
      className="group/card p-5 mb-5 relative cursor-pointer rounded-xl transform hover:-translate-y-1 transition-all duration-500 bg-gradient-to-br from-[rgba(15,23,42,0.7)] via-[rgba(20,80,100,0.5)] to-[rgba(15,23,42,0.7)] backdrop-filter backdrop-blur-[12px] shadow-[0_10px_50px_-12px_rgba(0,240,255,0.15)] border border-cyan-500/10 hover:border-cyan-400/30 hover:shadow-[0_20px_50px_-12px_rgba(0,240,255,0.25)]" 
      tabIndex={0} 
      role="button" 
      aria-label={`Lot: ${lot.nom}. Non lu`}
    >
      <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)] z-50 group-hover/card:shadow-[0_0_25px_rgba(34,211,238,0.8)] group-hover/card:scale-110 transition-all duration-500" title="Non lu"></div>
      <div className="flex-1 space-y-4">
        <div className="flex flex-col">
          <div>
            <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 p-4 rounded-xl border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_15px_rgba(34,211,238,0.1)_inset] mb-4 relative overflow-hidden group/inner hover:border-cyan-500/20 transition-all duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-cyan-500/10 opacity-0 group-hover/inner:opacity-100 blur-2xl transition-opacity duration-500"></div>
              <div className="flex items-center justify-between relative z-10 gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-x group-hover/inner:from-cyan-200 group-hover/inner:via-blue-300 group-hover/inner:to-cyan-200 transition-colors duration-300 mb-1.5">{lot.nom}</h3>
                  <div className="h-[2px] w-32 bg-gradient-to-r from-cyan-400/0 via-cyan-400 to-cyan-400/0 rounded-full group-hover/inner:from-cyan-400 group-hover/inner:via-blue-400 group-hover/inner:to-cyan-400 transition-all duration-500"></div>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-blue-900/30 to-cyan-950/40 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-400/20 shadow-[0_0_25px_rgba(0,210,238,0.15)] min-w-[44px] min-h-[32px] flex items-center gap-3 group hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(0,210,238,0.25)]">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_10px_rgba(34,211,238,0.6)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.8)] group-hover:scale-110 transition-all duration-300"></div>
                  <span className="font-medium relative cursor-pointer">
                    <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-x group-hover:from-cyan-200 group-hover:via-blue-300 group-hover:to-cyan-200 transition-all duration-300">
                      entre pro
                    </span>
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400/0 via-cyan-400 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-0 group-hover:scale-x-100"></span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Détails du lot */}
          <div className="flex flex-col space-y-4 mt-4 text-white/60">
            <div className="grid grid-cols-2 gap-4 text-sm w-full">
              <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300">
                <MapPin className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate" title={`Origine: ${lot.origine}`}>{lot.origine}</span>
              </div>
              
              <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300">
                <ArrowRight className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate" title={`${lot.quantite} ${lot.unite}`}>{lot.quantite} {lot.unite}</span>
              </div>
              
              <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300">
                <Info className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate" title={`N°${lot.numeroLot}`}>N°{lot.numeroLot}</span>
              </div>
              
              <div className="flex items-center bg-gradient-to-r from-green-500/20 to-green-400/10 rounded-lg p-3 border border-green-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,200,100,0.2)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,200,100,0.25)]">
                <PercentIcon className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-white/70 mb-0.5">Estimation remplissage</span>
                  <span className="font-bold text-base text-white" title={`${lot.estimationRemplissage} ${lot.unite}`}>
                    {lot.estimationRemplissage} <span className="text-green-400">{lot.unite}</span>
                  </span>
                </div>
              </div>
              
              <div className="bg-white/5 p-3 rounded-lg border border-white/10 col-span-2 transition-all duration-300 hover:border-cyan-400/20">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <h4 className="text-sm font-medium text-white">Mortalité</h4>
                  </div>
                  <span className="text-base font-medium text-green-400">{lot.mortalite}%</span>
                </div>
                <div className="relative h-4 w-full bg-gray-700/50 rounded-md overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-green-500" 
                    style={{ width: `${lot.mortalite}%` }}
                  ></div>
                  <div className="absolute top-0 bottom-0 left-[10%] w-px bg-white/20"></div>
                  <div className="absolute top-0 bottom-0 left-[15%] w-px bg-white/20"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between w-full mt-2">
              <div className="flex items-center bg-white/5 rounded-md px-2 py-1.5 border border-white/10">
                <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                <span className="text-sm text-white/80 font-medium">
                  {new Date(lot.datePrevue).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex items-center bg-white/5 rounded-md px-2 py-1.5 border border-white/10">
                <Package className="w-4 h-4 mr-2 text-cyan-400" />
                <span className="text-sm text-white/80 font-medium">Huîtres N°3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotsEnCoursPanel;
