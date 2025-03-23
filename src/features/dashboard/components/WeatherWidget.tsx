import React from 'react';
import { 
  Cloud, 
  Wind, 
  Droplets, 
  Navigation, 
  ThermometerSun, 
  Compass, 
  Waves, 
  ArrowUp, 
  ArrowDown,
  Sun,
  CloudRain
} from 'lucide-react';
import { motion } from 'framer-motion';
import './weather-widget.css';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  conditions: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  waveHeight: number;
  waveDirection: number;
  tideLevel: number;
  nextHighTide: string;
  nextLowTide: string;
  visibility: number;
  forecast: Array<{
    time: string;
    temp: number;
    windSpeed: number;
    windDirection: number;
    waveHeight: number;
  }>;
}

const mockWeather: WeatherData = {
  temperature: 18,
  humidity: 75,
  windSpeed: 15,
  windDirection: 315,
  windGust: 25,
  conditions: 'partly-cloudy',
  waveHeight: 0.8,
  waveDirection: 290,
  tideLevel: 4.2,
  nextHighTide: '14:30',
  nextLowTide: '20:45',
  visibility: 12,
  forecast: [
    { time: '12:00', temp: 18, windSpeed: 15, windDirection: 315, waveHeight: 0.8 },
    { time: '15:00', temp: 19, windSpeed: 18, windDirection: 320, waveHeight: 0.9 },
    { time: '18:00', temp: 17, windSpeed: 20, windDirection: 310, waveHeight: 1.0 },
    { time: '21:00', temp: 16, windSpeed: 16, windDirection: 305, waveHeight: 0.9 }
  ]
};

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

const WeatherIcon = ({ condition }: { condition: WeatherData['conditions'] }) => {
  switch (condition) {
    case 'sunny':
      return <Sun className="w-12 h-12 text-yellow-400" />;
    case 'cloudy':
      return <Cloud className="w-12 h-12 text-white/60" />;
    case 'rainy':
      return <CloudRain className="w-12 h-12 text-blue-400" />;
    case 'partly-cloudy':
      return (
        <div className="relative">
          <Sun className="w-12 h-12 text-yellow-400" />
          <Cloud className="w-8 h-8 text-white/60 absolute -bottom-2 -right-2" />
        </div>
      );
  }
};

// Composant de carte météo réutilisable avec effet de surbrillance
const WeatherCard = ({ 
  title, 
  icon, 
  children,
  className
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Détection du mobile au chargement du composant
  React.useEffect(() => {
    const checkIfMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };
    
    // Vérification initiale
    checkIfMobile();
    
    // Ajouter un écouteur pour les changements de taille d'écran
    window.addEventListener('resize', checkIfMobile);
    
    // Nettoyer l'écouteur lorsque le composant est démonté
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <motion.div 
      className={`
        ${isMobile ? '' : 'bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)]'}
        ${isMobile ? '' : '-webkit-backdrop-filter backdrop-filter backdrop-blur-[20px]'}
        rounded-lg p-4 
        ${isMobile ? '' : 'shadow-[rgba(0,0,0,0.2)_0px_5px_20px_-5px,rgba(0,200,200,0.1)_0px_5px_12px_-5px,rgba(255,255,255,0.07)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.05)_0px_0px_12px_inset,rgba(0,0,0,0.1)_0px_0px_8px_inset]'}
        transition-all duration-200 relative overflow-hidden
        ${isMobile ? '' : isHovered ? 'shadow-[rgba(0,0,0,0.25)_0px_8px_20px,rgba(0,210,200,0.15)_0px_0px_10px_inset]' : ''}
        ${className || ''}
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      {/* Effet de surbrillance au survol */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(0,128,128,0.05)] to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      
      <div className="flex items-center space-x-3 mb-3 relative z-10">
        <div className="text-cyan-400">
          {icon}
        </div>
        <h3 className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent font-medium whitespace-nowrap">{title}</h3>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export function WeatherWidget() {
  return (
    <div className="weather-widget-container w-full mobile-full-width" style={{ width: '100vw', margin: '0 auto', padding: 0, left: 0, right: 0, maxWidth: '100vw', position: 'relative', boxSizing: 'border-box' }}>
      <div className="weather-widget w-full flex flex-col mobile-full-width" style={{ width: '100%', maxWidth: '100%', margin: 0, padding: '15px', boxSizing: 'border-box' }}>
        {/* En-tête avec titre et icône */}
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="flex items-center">
            <span aria-hidden="true"><ThermometerSun size={20} className="text-cyan-400 mr-2" /></span>
            <h2 className="text-lg font-medium bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent whitespace-nowrap">
              Météo & Conditions Maritimes
            </h2>
          </div>
          <div className="text-sm text-white/60 whitespace-nowrap">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        {/* Desktop layout - restauration de la version originale */}
        <div className="hidden md:block w-full mb-6">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 border border-white/10 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 gap-6 p-6">
              {/* Conditions actuelles */}
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Sun className="w-8 h-8 text-yellow-400" />
                      <Cloud className="w-5 h-5 text-white/60 absolute -bottom-1 -right-1" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{mockWeather.temperature}°C</div>
                      <div className="text-white/60 text-sm">Partiellement nuageux</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-sm text-white/60">Humidité</div>
                      <div className="text-lg font-medium text-white">{mockWeather.humidity}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Visibilité</div>
                      <div className="text-lg font-medium text-white">{mockWeather.visibility} km</div>
                    </div>
                  </div>
                </div>

                {/* Conditions du vent */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Wind className="text-brand-burgundy" size={20} />
                    <h3 className="text-white font-medium">Vent</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-white/60">Vitesse</div>
                      <div className="text-lg font-medium text-white">{mockWeather.windSpeed} km/h</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Direction</div>
                      <div className="flex items-center">
                        <Navigation
                          className="text-brand-burgundy mr-2"
                          size={16}
                          style={{ transform: `rotate(${mockWeather.windDirection}deg)` }}
                        />
                        <span className="text-lg font-medium text-white">
                          {getWindDirection(mockWeather.windDirection)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Rafales</div>
                      <div className="text-lg font-medium text-white">{mockWeather.windGust} km/h</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mer et marées */}
              <div className="space-y-6">
                {/* État de la mer */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Waves className="text-brand-burgundy" size={20} />
                    <h3 className="text-white font-medium">État de la mer</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-white/60">Hauteur</div>
                      <div className="text-lg font-medium text-white">{mockWeather.waveHeight}m</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Direction</div>
                      <div className="flex items-center">
                        <Navigation
                          className="text-brand-burgundy mr-2"
                          size={16}
                          style={{ transform: `rotate(${mockWeather.waveDirection}deg)` }}
                        />
                        <span className="text-lg font-medium text-white">
                          {getWindDirection(mockWeather.waveDirection)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marées */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Waves className="text-brand-burgundy" size={20} />
                    <h3 className="text-white font-medium">Marées</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-white/60">Niveau actuel</div>
                      <div className="text-lg font-medium text-white">{mockWeather.tideLevel}m</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Coefficient</div>
                      <div className="text-lg font-medium text-white">95</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Prochaine PM</div>
                      <div className="flex items-center">
                        <ArrowUp className="w-4 h-4 text-brand-burgundy mr-1" />
                        <span className="text-lg font-medium text-white">{mockWeather.nextHighTide}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Prochaine BM</div>
                      <div className="flex items-center">
                        <ArrowDown className="w-4 h-4 text-brand-burgundy mr-1" />
                        <span className="text-lg font-medium text-white">{mockWeather.nextLowTide}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prévisions horaires en bas */}
            <div className="border-t border-white/10 p-6">
              <h3 className="text-white font-medium mb-4">Prévisions horaires</h3>
              <div className="grid grid-cols-4 gap-4">
                {mockWeather.forecast.map((forecast, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="text-sm text-white/60 mb-2">{forecast.time}</div>
                    <div className="text-lg font-medium text-white mb-2">{forecast.temp}°C</div>
                    <div className="space-y-2 text-sm text-white/60">
                      <div className="flex items-center">
                        <Navigation
                          className="w-4 h-4 text-brand-burgundy mr-1"
                          style={{ transform: `rotate(${forecast.windDirection}deg)` }}
                        />
                        <span>{forecast.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center">
                        <Waves className="w-4 h-4 text-brand-burgundy mr-1" />
                        <span>{forecast.waveHeight}m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout - conservée telle quelle */}
        <div className="md:hidden flex flex-col space-y-4 w-full mobile-full-width" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', margin: 0, padding: 0 }}>
          {/* Résumé météo mobile */}
          <div className="mobile-weather-main w-full mobile-full-width" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', margin: 0 }}>
            <div className="mobile-weather-header w-full">
              <div className="mobile-current-temp">{mockWeather.temperature}°C</div>
              <WeatherIcon condition={mockWeather.conditions} />
            </div>
            <div className="mobile-weather-details w-full">
              <div className="mobile-weather-detail-item" aria-label="Conditions de vent" title="Conditions de vent">
                <span aria-hidden="true"><Wind size={20} className="mobile-weather-detail-icon" /></span>
                <div className="mobile-weather-detail-label">Vent</div>
                <div className="mobile-weather-detail-value">{mockWeather.windSpeed} km/h</div>
              </div>
              <div className="mobile-weather-detail-item" aria-label="Niveau d'humidité" title="Niveau d'humidité">
                <span aria-hidden="true"><Droplets size={20} className="mobile-weather-detail-icon" /></span>
                <div className="mobile-weather-detail-label">Humidité</div>
                <div className="mobile-weather-detail-value">{mockWeather.humidity}%</div>
              </div>
              <div className="mobile-weather-detail-item" aria-label="Hauteur des vagues" title="Hauteur des vagues">
                <span aria-hidden="true"><Waves size={20} className="mobile-weather-detail-icon" /></span>
                <div className="mobile-weather-detail-label">Vagues</div>
                <div className="mobile-weather-detail-value">{mockWeather.waveHeight} m</div>
              </div>
            </div>
            <div className="mobile-weather-status">
              {mockWeather.conditions === 'sunny' ? 'Ensoleillé' : 
              mockWeather.conditions === 'cloudy' ? 'Nuageux' : 
              mockWeather.conditions === 'rainy' ? 'Pluvieux' : 'Partiellement nuageux'}
            </div>
          </div>

          {/* Prévisions météo mobile - défilable horizontalement */}
          <div className="weather-forecast-container w-full mobile-full-width" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', margin: 0 }}>
            <h3 className="text-white/80 text-sm font-medium mb-2">Prévisions 24h</h3>
            <div className="weather-forecast">
              {mockWeather.forecast.map((item, index) => (
                <div key={index} className="forecast-item touch-target">
                  <div className="forecast-time">{item.time}</div>
                  <div className="forecast-temp">{item.temp}°</div>
                  <div className="forecast-wind">
                    <span aria-hidden="true">
                      <Navigation 
                        size={14} 
                        style={{ transform: `rotate(${item.windDirection}deg)` }} 
                      />
                    </span>
                    <span className="forecast-wind-speed">{item.windSpeed}</span>
                  </div>
                  <div className="forecast-wave">{item.waveHeight}m</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cartes d'informations horizontales pour mobile */}
          <div className="grid grid-cols-1 gap-3 w-full mobile-full-width" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', margin: 0, padding: 0 }}>
            <WeatherCard 
              title="Détails du vent" 
              icon={<Wind size={18} />}
              className="mobile-full-width-card mobile-compact-weather-card"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-white/60 text-xs">Direction</div>
                  <div className="flex items-center mt-1">
                    <Navigation size={16} style={{ transform: `rotate(${mockWeather.windDirection}deg)` }} />
                    <span className="ml-1">{getWindDirection(mockWeather.windDirection)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-white/60 text-xs">Vitesse</div>
                  <div className="flex items-center mt-1">
                    <span>{mockWeather.windSpeed} km/h</span>
                  </div>
                </div>
                <div>
                  <div className="text-white/60 text-xs">Rafales</div>
                  <div className="flex items-center mt-1">
                    <span>{mockWeather.windGust} km/h</span>
                  </div>
                </div>
              </div>
            </WeatherCard>

            <WeatherCard 
              title="Conditions maritimes" 
              icon={<Waves size={18} />}
              className="mobile-full-width-card mobile-compact-weather-card"
            >
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <div className="text-sm text-white/60 whitespace-nowrap">Hauteur vagues</div>
                  <div className="text-base font-medium text-white whitespace-nowrap">{mockWeather.waveHeight} m</div>
                </div>
                <div>
                  <div className="text-sm text-white/60 whitespace-nowrap">Direction</div>
                  <div className="flex items-center">
                    <span aria-label={`Direction des vagues: Nord-Est`}>
                      <Navigation 
                        className="text-cyan-400 mr-2" 
                        size={18}
                        style={{ transform: `rotate(${mockWeather.waveDirection}deg)` }}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-base font-medium text-white whitespace-nowrap">Nord-Est</span>
                  </div>
                </div>
              </div>
            </WeatherCard>

            <WeatherCard
              icon={<span aria-hidden="true"><Compass size={18} /></span>}
              title="Marées"
              className="mobile-full-width-card mobile-compact-weather-card"
            >
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <div className="text-sm text-white/60 whitespace-nowrap">Niveau actuel</div>
                  <div className="text-base font-medium text-white whitespace-nowrap">{mockWeather.tideLevel} m</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-white/60 whitespace-nowrap">
                    <span aria-label="Marée montante">
                      <ArrowUp className="w-3 h-3 mr-1 text-cyan-400" aria-hidden="true" />
                    </span>
                    Prochaine marée haute
                  </div>
                  <div className="text-base font-medium text-white whitespace-nowrap">{mockWeather.nextHighTide}</div>
                </div>
                <div className="col-span-2 mt-1">
                  <div className="flex items-center text-sm text-white/60 whitespace-nowrap">
                    <span aria-label="Marée descendante">
                      <ArrowDown className="w-3 h-3 mr-1 text-cyan-400" aria-hidden="true" />
                    </span>
                    Prochaine marée basse
                  </div>
                  <div className="text-base font-medium text-white whitespace-nowrap">{mockWeather.nextLowTide}</div>
                </div>
              </div>
            </WeatherCard>

            <WeatherCard
              icon={<span aria-hidden="true"><Droplets size={18} /></span>}
              title="Conditions générales"
              className="mobile-full-width-card mobile-compact-weather-card"
            >
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <div className="text-sm text-white/60 whitespace-nowrap">Humidité</div>
                  <div className="text-base font-medium text-white whitespace-nowrap">{mockWeather.humidity}%</div>
                </div>
                <div>
                  <div className="text-sm text-white/60 whitespace-nowrap">Visibilité</div>
                  <div className="text-base font-medium text-white whitespace-nowrap">{mockWeather.visibility} km</div>
                </div>
                <div className="col-span-2 mt-1">
                  <div className="text-sm text-white/60 whitespace-nowrap">Qualité de l'eau</div>
                  <div className="text-base font-medium text-white flex items-center whitespace-nowrap">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2" aria-hidden="true"></span>
                    Excellente
                  </div>
                </div>
              </div>
            </WeatherCard>
          </div>
        </div>
      </div>
    </div>
  );
}