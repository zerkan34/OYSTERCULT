import React, { useRef, useEffect } from 'react';

// Composant pour la carte marine GPS en 3D
const MarineGPS: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cette fonction sera utilisée pour initialiser la visualisation 3D
    // lorsque le fichier Blender sera chargé
    const initializeMap = () => {
      // Le code d'initialisation du modèle 3D ira ici
      // Pour l'instant, c'est un placeholder jusqu'à ce que vous fournissiez le fichier Blender
    };

    if (containerRef.current) {
      initializeMap();
    }

    return () => {
      // Nettoyage au démontage du composant
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map text-brand-burgundy mr-3">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
            <line x1="9" x2="9" y1="3" y2="18"></line>
            <line x1="15" x2="15" y1="6" y2="21"></line>
          </svg>
          GPS Marin
        </h1>
        <p className="text-white/60 mt-2">
          Visualisation 3D des parcelles et données marines
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="glass-effect rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-500/20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-anchor text-blue-400">
                  <circle cx="12" cy="5" r="3"></circle>
                  <line x1="12" x2="12" y1="22" y2="8"></line>
                  <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
                </svg>
              </div>
              <h2 className="text-lg font-medium text-white">Carte marine interactive</h2>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers inline-block mr-1.5">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                Couches
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-locate inline-block mr-1.5">
                  <line x1="2" x2="5" y1="12" y2="12"></line>
                  <line x1="19" x2="22" y1="12" y2="12"></line>
                  <line x1="12" x2="12" y1="2" y2="5"></line>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                  <circle cx="12" cy="12" r="7"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Ma position
              </button>
            </div>
          </div>

          {/* Conteneur pour la carte 3D */}
          <div 
            ref={containerRef}
            className="w-full h-[500px] bg-gradient-to-b from-blue-900/50 to-blue-950/80 rounded-lg border border-white/10 relative flex items-center justify-center"
          >
            <div className="text-center text-white/60">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map mx-auto mb-4 opacity-60">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                <line x1="9" x2="9" y1="3" y2="18"></line>
                <line x1="15" x2="15" y1="6" y2="21"></line>
              </svg>
              <p className="text-lg">En attente du modèle 3D...</p>
              <p className="mt-2">Veuillez fournir le fichier Blender pour charger la carte</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <div className="flex-1 bg-white/5 rounded-lg p-3">
              <div className="text-sm text-white/60 mb-1">Coordonnées</div>
              <div className="text-white font-medium">47°12'24"N, 2°13'48"W</div>
            </div>
            <div className="flex-1 bg-white/5 rounded-lg p-3">
              <div className="text-sm text-white/60 mb-1">Marée</div>
              <div className="text-white font-medium">Montante (75%)</div>
            </div>
            <div className="flex-1 bg-white/5 rounded-lg p-3">
              <div className="text-sm text-white/60 mb-1">Profondeur</div>
              <div className="text-white font-medium">4.2m</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-green-500/20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-green-400">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2 className="text-lg font-medium text-white">Parcelles actives</h2>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-white">Parcelle A-12</div>
                  <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Visible sur carte</div>
                </div>
                <div className="text-sm text-white/60 mt-1">47°13'05"N, 2°12'48"W</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-white">Parcelle B-03</div>
                  <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Visible sur carte</div>
                </div>
                <div className="text-sm text-white/60 mt-1">47°12'32"N, 2°14'11"W</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-white">Parcelle C-07</div>
                  <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Visible sur carte</div>
                </div>
                <div className="text-sm text-white/60 mt-1">47°11'59"N, 2°13'22"W</div>
              </div>
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-amber-500/20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info text-amber-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <h2 className="text-lg font-medium text-white">Informations de navigation</h2>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60 mb-1">Météo marine</div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-sun mr-2 text-white">
                    <path d="M12 2v2"></path>
                    <path d="m4.93 4.93 1.41 1.41"></path>
                    <path d="M20 12h2"></path>
                    <path d="m19.07 4.93-1.41 1.41"></path>
                    <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path>
                    <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path>
                  </svg>
                  <span className="text-white font-medium">Partiellement nuageux, 15°C</span>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60 mb-1">Vent</div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wind mr-2 text-white">
                    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path>
                    <path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path>
                    <path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>
                  </svg>
                  <span className="text-white font-medium">Nord-Ouest, 12 km/h</span>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60 mb-1">Prochaines marées</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up text-blue-400 mr-1">
                        <path d="m5 12 7-7 7 7"></path>
                        <path d="M12 19V5"></path>
                      </svg>
                      <span className="text-white">Haute: 14h30</span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">Coefficient: 95</div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down text-blue-400 mr-1">
                        <path d="M12 5v14"></path>
                        <path d="m19 12-7 7-7-7"></path>
                      </svg>
                      <span className="text-white">Basse: 20h45</span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">Hauteur: 0.8m</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarineGPS;
