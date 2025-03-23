import React from 'react';

export const CompactWeatherCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 border border-white/10 rounded-lg overflow-hidden text-sm">
      <div className="grid grid-cols-2 gap-3 p-3">
        <div className="space-y-3">
          {/* Section Météo */}
          <div className="bg-white/5 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sun w-6 h-6 text-yellow-400">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-cloud w-4 h-4 text-white/60 absolute -bottom-1 -right-1">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                </svg>
              </div>
              <div>
                <div className="text-base font-bold text-white">18°C</div>
                <div className="text-white/60 text-xs">Partiellement nuageux</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <div className="text-xs text-white/60">Humidité</div>
                <div className="text-sm font-medium text-white">75%</div>
              </div>
              <div>
                <div className="text-xs text-white/60">Visibilité</div>
                <div className="text-sm font-medium text-white">12 km</div>
              </div>
            </div>
          </div>
          
          {/* Section Vent */}
          <div className="bg-white/5 rounded-lg p-2">
            <div className="flex items-center space-x-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-wind text-brand-burgundy">
                <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path>
                <path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path>
                <path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>
              </svg>
              <h3 className="text-white text-xs font-medium">Vent</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-white/60">Vitesse</div>
                <div className="text-sm font-medium text-white">15 km/h</div>
              </div>
              <div>
                <div className="text-xs text-white/60">Direction</div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-navigation text-brand-burgundy mr-1" style={{ transform: 'rotate(315deg)' }}>
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  </svg>
                  <span className="text-sm font-medium text-white">NO</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-white/60">Rafales</div>
                <div className="text-sm font-medium text-white">25 km/h</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Section État de la mer */}
          <div className="bg-white/5 rounded-lg p-2">
            <div className="flex items-center space-x-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-waves text-brand-burgundy">
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
              </svg>
              <h3 className="text-white text-xs font-medium">État de la mer</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-white/60">Hauteur</div>
                <div className="text-sm font-medium text-white">0.8m</div>
              </div>
              <div>
                <div className="text-xs text-white/60">Direction</div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-navigation text-brand-burgundy mr-1" style={{ transform: 'rotate(290deg)' }}>
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  </svg>
                  <span className="text-sm font-medium text-white">O</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section Marées */}
          <div className="bg-white/5 rounded-lg p-2">
            <div className="flex items-center space-x-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-waves text-brand-burgundy">
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
              </svg>
              <h3 className="text-white text-xs font-medium">Marées</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-white/60">Niveau</div>
                <div className="text-sm font-medium text-white">4.2m</div>
              </div>
              <div>
                <div className="text-xs text-white/60">Coefficient</div>
                <div className="text-sm font-medium text-white">95</div>
              </div>
              <div>
                <div className="text-xs text-white/60">Prochaine PM</div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-up w-3 h-3 text-brand-burgundy mr-1">
                    <path d="m5 12 7-7 7 7"></path>
                    <path d="M12 19V5"></path>
                  </svg>
                  <span className="text-sm font-medium text-white">14:30</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-white/60">Prochaine BM</div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-down w-3 h-3 text-brand-burgundy mr-1">
                    <path d="M12 5v14"></path>
                    <path d="m19 12-7 7-7-7"></path>
                  </svg>
                  <span className="text-sm font-medium text-white">20:45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section Prévisions horaires */}
      <div className="border-t border-white/10 p-3">
        <h3 className="text-white text-xs font-medium mb-2">Prévisions horaires</h3>
        <div className="grid grid-cols-4 gap-2">
          {['12:00', '15:00', '18:00', '21:00'].map((time, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-2">
              <div className="text-xs text-white/60 mb-1">{time}</div>
              <div className="text-sm font-medium text-white mb-1">
                {index === 0 ? '18°C' : index === 1 ? '19°C' : index === 2 ? '17°C' : '16°C'}
              </div>
              <div className="space-y-1 text-xs text-white/60">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-navigation w-3 h-3 text-brand-burgundy mr-1" style={{ transform: `rotate(${315 - index * 5}deg)` }}>
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  </svg>
                  <span>{15 + index * (index === 2 ? 5 : 3) - (index === 3 ? 4 : 0)} km/h</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-waves w-3 h-3 text-brand-burgundy mr-1">
                    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                  </svg>
                  <span>{index === 0 ? '0.8m' : index === 1 ? '0.9m' : index === 2 ? '1m' : '0.9m'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompactWeatherCard;
