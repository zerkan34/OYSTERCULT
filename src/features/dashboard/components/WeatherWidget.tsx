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
  CloudRain,
  Calendar,
  ChevronRight
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
  dailyForecast: Array<{
    day: string;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
    tempMin: number;
    tempMax: number;
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
  ],
  dailyForecast: [
    { day: 'Demain', condition: 'sunny', tempMin: 16, tempMax: 21, windSpeed: 12, windDirection: 45, waveHeight: 0.5 },
    { day: 'Mercredi', condition: 'partly-cloudy', tempMin: 15, tempMax: 19, windSpeed: 14, windDirection: 90, waveHeight: 0.6 },
    { day: 'Jeudi', condition: 'rainy', tempMin: 14, tempMax: 17, windSpeed: 18, windDirection: 135, waveHeight: 0.7 },
    { day: 'Vendredi', condition: 'cloudy', tempMin: 15, tempMax: 20, windSpeed: 10, windDirection: 225, waveHeight: 0.5 }
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
    <div className="weather-widget-container w-full" style={{ width: '100%', margin: 0, padding: 0, position: 'relative', boxSizing: 'border-box' }}>
      <div className="weather-widget w-full flex flex-col glass-effect rounded-xl p-5" style={{ width: '100%', maxWidth: '100%', margin: 0, boxSizing: 'border-box' }}>
        {/* En-tête avec titre et icône */}
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="flex items-center">
            <span aria-hidden="true"><ThermometerSun size={20} className="text-cyan-400 mr-2" /></span>
            <h2 className="text-lg font-medium bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent whitespace-nowrap">
              Météo & Conditions Maritimes Actuelles
            </h2>
          </div>
          <h1 className="text-2xl font-bold text-cyan-300 absolute left-1/2 transform -translate-x-1/2">
            Bouzigues
          </h1>
          <div className="text-sm text-white/60 whitespace-nowrap">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        {/* Desktop layout avec 4 widgets alignés */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-4 md:mb-6">
          <WeatherCard
            title="Température"
            icon={<ThermometerSun size={20} />}
            className="h-full shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30"
          >
            <div className="flex items-center">
              <div className="text-3xl font-bold text-white">{mockWeather.temperature}°</div>
              <div className="text-white/60 ml-2">C</div>
            </div>
            <div className="text-white/60 mt-1">Ressenti 19°C</div>
            <div className="flex items-center mt-3">
              <Droplets size={16} className="text-cyan-400 mr-2" />
              <span className="text-white/80">Humidité {mockWeather.humidity}%</span>
            </div>
          </WeatherCard>
          
          <WeatherCard
            title="Vent"
            icon={<Wind size={20} />}
            className="h-full shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30"
          >
            <div className="flex items-center mb-1">
              <div className="text-2xl font-bold text-white">{mockWeather.windSpeed}</div>
              <div className="text-white/60 ml-1">km/h</div>
            </div>
            <div className="flex items-center mb-3">
              <Navigation 
                size={16} 
                className="text-cyan-400 mr-2"
                style={{ transform: `rotate(${mockWeather.windDirection}deg)` }}
              />
              <span className="text-white/80">{getWindDirection(mockWeather.windDirection)}</span>
            </div>
            <div className="text-sm text-white/60">
              Rafales jusqu'à {mockWeather.windGust} km/h
            </div>
          </WeatherCard>
          
          <WeatherCard
            title="Mer"
            icon={<Waves size={20} />}
            className="h-full shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30"
          >
            <div className="flex items-center mb-1">
              <div className="text-2xl font-bold text-white">{mockWeather.waveHeight}</div>
              <div className="text-white/60 ml-1">mètres</div>
            </div>
            <div className="flex items-center mb-3">
              <Compass className="text-cyan-400 mr-2" size={16} />
              <span className="text-white/80">{getWindDirection(mockWeather.waveDirection)}</span>
            </div>
            <div className="text-sm text-white/60">
              Température de l'eau: 16°C
            </div>
          </WeatherCard>
          
          <WeatherCard
            title="Marées"
            icon={<Compass size={20} />}
            className="h-full shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ArrowUp size={16} className="text-cyan-400 mr-2" />
                  <span className="text-white/80">Marée haute</span>
                </div>
                <div className="text-white font-medium">{mockWeather.nextHighTide}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ArrowDown size={16} className="text-cyan-400 mr-2" />
                  <span className="text-white/80">Marée basse</span>
                </div>
                <div className="text-white font-medium">{mockWeather.nextLowTide}</div>
              </div>
            </div>
          </WeatherCard>
        </div>

        {/* Prévisions horaires en bas */}
        <div className="border-t border-white/10 p-6 relative">
          <h3 className="text-white font-medium mb-4">Prévisions horaires</h3>
          <div className="forecast-container">
            <div className="forecast-scroll-container hide-scrollbar">
              {[
                { time: '12:00', temp: 18, windSpeed: 15, windDirection: 315, waveHeight: 0.8 },
                { time: '15:00', temp: 19, windSpeed: 18, windDirection: 320, waveHeight: 0.9 },
                { time: '18:00', temp: 17, windSpeed: 20, windDirection: 310, waveHeight: 1.0 },
                { time: '21:00', temp: 16, windSpeed: 16, windDirection: 305, waveHeight: 0.9 },
                { time: '00:00', temp: 15, windSpeed: 14, windDirection: 300, waveHeight: 0.7 },
                { time: '03:00', temp: 14, windSpeed: 12, windDirection: 290, waveHeight: 0.6 },
                { time: '06:00', temp: 15, windSpeed: 10, windDirection: 280, waveHeight: 0.5 },
                { time: '09:00', temp: 16, windSpeed: 12, windDirection: 270, waveHeight: 0.4 }
              ].map((forecast, index) => (
                <div 
                  key={index} 
                  className="forecast-item bg-white/5 rounded-lg p-3 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                >
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

        {/* Prévisions des prochains jours */}
        <div className="border-t border-white/10 p-6 relative">
          <h3 className="text-white font-medium mb-4">Prévisions des prochains jours</h3>
          <div className="forecast-container">
            <div className="forecast-scroll-container hide-scrollbar overflow-x-auto">
              {/* Premières prévisions quotidiennes */}
              {mockWeather.dailyForecast.map((forecast, index) => (
                <div key={index} className="forecast-item bg-white/5 rounded-lg p-3 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                  <div className="text-sm text-white/60 mb-2">{forecast.day}</div>
                  <div className="flex justify-center mb-2">
                    <WeatherIcon condition={forecast.condition} />
                  </div>
                  <div className="text-lg font-medium text-white mb-2">{forecast.tempMin}° - {forecast.tempMax}°</div>
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
                      <span>{forecast.waveHeight || '0.5'}m</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Prévisions quotidiennes supplémentaires */}
              <div className="forecast-item bg-white/5 rounded-lg p-3 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                <div className="text-sm text-white/60 mb-2">Samedi</div>
                <div className="flex justify-center mb-2">
                  <WeatherIcon condition="sunny" />
                </div>
                <div className="text-lg font-medium text-white mb-2">21° - 26°</div>
                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex items-center">
                    <Navigation
                      className="w-4 h-4 text-brand-burgundy mr-1"
                      style={{ transform: `rotate(240deg)` }}
                    />
                    <span>10 km/h</span>
                  </div>
                  <div className="flex items-center">
                    <Waves className="w-4 h-4 text-brand-burgundy mr-1" />
                    <span>0.5m</span>
                  </div>
                </div>
              </div>
              
              <div className="forecast-item bg-white/5 rounded-lg p-3 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                <div className="text-sm text-white/60 mb-2">Dimanche</div>
                <div className="flex justify-center mb-2">
                  <WeatherIcon condition="partly-cloudy" />
                </div>
                <div className="text-lg font-medium text-white mb-2">19° - 24°</div>
                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex items-center">
                    <Navigation
                      className="w-4 h-4 text-brand-burgundy mr-1"
                      style={{ transform: `rotate(225deg)` }}
                    />
                    <span>12 km/h</span>
                  </div>
                  <div className="flex items-center">
                    <Waves className="w-4 h-4 text-brand-burgundy mr-1" />
                    <span>0.6m</span>
                  </div>
                </div>
              </div>
              
              <div className="forecast-item bg-white/5 rounded-lg p-3 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                <div className="text-sm text-white/60 mb-2">Lundi</div>
                <div className="flex justify-center mb-2">
                  <WeatherIcon condition="cloudy" />
                </div>
                <div className="text-lg font-medium text-white mb-2">18° - 22°</div>
                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex items-center">
                    <Navigation
                      className="w-4 h-4 text-brand-burgundy mr-1"
                      style={{ transform: `rotate(180deg)` }}
                    />
                    <span>15 km/h</span>
                  </div>
                  <div className="flex items-center">
                    <Waves className="w-4 h-4 text-brand-burgundy mr-1" />
                    <span>0.7m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex flex-col space-y-4 w-full" style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0, boxSizing: 'border-box' }}>
          {/* Résumé météo mobile */}
          <div className="mobile-weather-main w-full glass-effect rounded-xl p-3" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', margin: 0 }}>
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
          
          {/* Widgets météo mobile */}
          <div className="w-full flex flex-wrap justify-center" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', margin: 0 }}>
            {/* Card 1: Marées */}
            <div className="mobile-weather-card shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30 transition-all duration-300 m-2">
              <div className="mobile-weather-card-header">
                <span aria-hidden="true"><Waves size={20} className="mobile-weather-card-icon" /></span>
                <div className="mobile-weather-card-title">Marées</div>
              </div>
              <div className="mobile-weather-card-content">
                <div className="mobile-weather-card-row">
                  <span aria-hidden="true"><ArrowUp size={16} className="text-brand-burgundy" /></span>
                  <div className="mobile-weather-card-label">Haute</div>
                  <div className="mobile-weather-card-value">{mockWeather.nextHighTide}</div>
                </div>
                <div className="mobile-weather-card-row">
                  <span aria-hidden="true"><ArrowDown size={16} className="text-brand-burgundy" /></span>
                  <div className="mobile-weather-card-label">Basse</div>
                  <div className="mobile-weather-card-value">{mockWeather.nextLowTide}</div>
                </div>
              </div>
            </div>
            
            {/* Card 2: Vent */}
            <div className="mobile-weather-card shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30 transition-all duration-300 m-2">
              <div className="mobile-weather-card-header">
                <span aria-hidden="true"><Wind size={20} className="mobile-weather-card-icon" /></span>
                <div className="mobile-weather-card-title">Vent</div>
              </div>
              <div className="mobile-weather-card-content">
                <div className="mobile-weather-card-row">
                  <span aria-hidden="true"><Navigation size={16} className="text-brand-burgundy" style={{ transform: `rotate(${mockWeather.windDirection}deg)` }} /></span>
                  <div className="mobile-weather-card-label">Direction</div>
                  <div className="mobile-weather-card-value">{getWindDirection(mockWeather.windDirection)}</div>
                </div>
                <div className="mobile-weather-card-row">
                  <span aria-hidden="true"><Wind size={16} className="text-brand-burgundy" /></span>
                  <div className="mobile-weather-card-label">Rafales</div>
                  <div className="mobile-weather-card-value">{mockWeather.windGust} km/h</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile forecast */}
          <div className="mobile-forecast-section w-full shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
            <div className="mobile-forecast-header">
              <span aria-hidden="true"><Calendar size={20} className="mobile-forecast-icon" /></span>
              <div className="mobile-forecast-title">Prévisions</div>
            </div>
            <div className="mobile-forecast-content overflow-x-auto">
              <div className="flex" style={{ minWidth: "100%" }}>
                {mockWeather.forecast.map((forecast, index) => (
                  <div key={index} className="mobile-forecast-item" style={{ minWidth: "80px" }}>
                    <div className="mobile-forecast-time">{forecast.time}</div>
                    <div className="mobile-forecast-temp">{forecast.temp}°</div>
                    <div className="mobile-forecast-wind">
                      <Navigation size={14} className="mobile-forecast-wind-icon" style={{ transform: `rotate(${forecast.windDirection}deg)` }} />
                      <span>{forecast.windSpeed}</span>
                    </div>
                    <div className="mobile-forecast-waves">
                      <Waves size={14} className="mobile-forecast-waves-icon" />
                      <span>{forecast.waveHeight}m</span>
                    </div>
                  </div>
                ))}
                {/* Prévisions supplémentaires pour permettre le défilement horizontal */}
                <div className="mobile-forecast-item" style={{ minWidth: "80px" }}>
                  <div className="mobile-forecast-time">00:00</div>
                  <div className="mobile-forecast-temp">15°</div>
                  <div className="mobile-forecast-wind">
                    <Navigation size={14} className="mobile-forecast-wind-icon" style={{ transform: `rotate(300deg)` }} />
                    <span>14</span>
                  </div>
                  <div className="mobile-forecast-waves">
                    <Waves size={14} className="mobile-forecast-waves-icon" />
                    <span>0.7m</span>
                  </div>
                </div>
                <div className="mobile-forecast-item" style={{ minWidth: "80px" }}>
                  <div className="mobile-forecast-time">03:00</div>
                  <div className="mobile-forecast-temp">14°</div>
                  <div className="mobile-forecast-wind">
                    <Navigation size={14} className="mobile-forecast-wind-icon" style={{ transform: `rotate(290deg)` }} />
                    <span>12</span>
                  </div>
                  <div className="mobile-forecast-waves">
                    <Waves size={14} className="mobile-forecast-waves-icon" />
                    <span>0.6m</span>
                  </div>
                </div>
                <div className="mobile-forecast-item" style={{ minWidth: "80px" }}>
                  <div className="mobile-forecast-time">06:00</div>
                  <div className="mobile-forecast-temp">15°</div>
                  <div className="mobile-forecast-wind">
                    <Navigation size={14} className="mobile-forecast-wind-icon" style={{ transform: `rotate(295deg)` }} />
                    <span>13</span>
                  </div>
                  <div className="mobile-forecast-waves">
                    <Waves size={14} className="mobile-forecast-waves-icon" />
                    <span>0.5m</span>
                  </div>
                </div>
                <div className="mobile-forecast-item" style={{ minWidth: "80px" }}>
                  <div className="mobile-forecast-time">09:00</div>
                  <div className="mobile-forecast-temp">16°</div>
                  <div className="mobile-forecast-wind">
                    <Navigation size={14} className="mobile-forecast-wind-icon" style={{ transform: `rotate(300deg)` }} />
                    <span>15</span>
                  </div>
                  <div className="mobile-forecast-waves">
                    <Waves size={14} className="mobile-forecast-waves-icon" />
                    <span>0.6m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}