import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Wind, 
  Droplets, 
  Sun, 
  CloudRain, 
  Navigation, 
  ThermometerSun, 
  Compass, 
  Waves as Wave, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
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

  return (
    <motion.div 
      className={`
        bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)]
        -webkit-backdrop-filter backdrop-filter backdrop-blur-[20px]
        rounded-lg p-4 
        shadow-[rgba(0,0,0,0.2)_0px_5px_20px_-5px,rgba(0,200,200,0.1)_0px_5px_12px_-5px,rgba(255,255,255,0.07)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.05)_0px_0px_12px_inset,rgba(0,0,0,0.1)_0px_0px_8px_inset]
        transition-all duration-200 relative overflow-hidden
        ${isHovered ? 'shadow-[rgba(0,0,0,0.25)_0px_8px_20px,rgba(0,210,200,0.15)_0px_0px_10px_inset]' : ''}
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
        <h3 className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent font-medium">{title}</h3>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export function WeatherWidget() {
  return (
    <div className="weather-widget">
      {/* En-tête avec titre et icône */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ThermometerSun size={20} className="text-cyan-400 mr-2" />
          <h2 className="text-lg font-medium bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Météo & Conditions Maritimes
          </h2>
        </div>
        <div className="text-sm text-white/60">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Layout Paysage en deux sections principales */}
      <div className="grid grid-cols-4 gap-4">
        {/* Section 1: Conditions actuelles et prévisions */}
        <div className="col-span-2 flex flex-col space-y-4">
          {/* Conditions actuelles */}
          <div className="bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)] -webkit-backdrop-filter backdrop-filter backdrop-blur-[20px] rounded-lg p-4 shadow-[rgba(0,0,0,0.2)_0px_5px_20px_-5px,rgba(0,200,200,0.1)_0px_5px_12px_-5px,rgba(255,255,255,0.07)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.05)_0px_0px_12px_inset,rgba(0,0,0,0.1)_0px_0px_8px_inset]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <WeatherIcon condition={mockWeather.conditions} />
                <div>
                  <div className="text-3xl font-bold text-white">{mockWeather.temperature}°C</div>
                  <div className="text-white/60">Partiellement nuageux</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/60 mb-1">Min/Max</div>
                <div className="flex items-center justify-end space-x-3">
                  <div className="flex items-center">
                    <ArrowDown className="w-3 h-3 text-blue-400 mr-1" />
                    <span className="text-white">16°</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowUp className="w-3 h-3 text-red-400 mr-1" />
                    <span className="text-white">19°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prévisions horaires */}
          <div className="relative rounded-lg p-4 overflow-hidden bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)] backdrop-blur-[20px] shadow-[rgba(0,0,0,0.2)_0px_5px_20px_-5px,rgba(0,200,200,0.1)_0px_5px_12px_-5px,rgba(255,255,255,0.07)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.05)_0px_0px_12px_inset,rgba(0,0,0,0.1)_0px_0px_8px_inset] transition-all duration-200 flex-1">
            <div className="flex items-center space-x-3 mb-3 relative z-10">
              <div className="text-cyan-400">
                <Cloud size={18} />
              </div>
              <h3 className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent font-medium">
                Prévisions
              </h3>
            </div>
            <div className="weather-widget">
              <div className="weather-forecast">
                {mockWeather.forecast.map((forecast, index) => (
                  <div key={index} className="forecast-item">
                    <div className="forecast-time">{forecast.time}</div>
                    <div className="forecast-temp">{forecast.temp}°</div>
                    <div className="forecast-wind">
                      <Navigation 
                        className="weather-icon" 
                        size={14}
                        style={{ transform: `rotate(${forecast.windDirection}deg)` }}
                      />
                      <span className="forecast-wind-speed">{forecast.windSpeed}</span>
                    </div>
                    <div className="forecast-wave">{forecast.waveHeight}m</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Grille d'informations météo: vent, mer, marées, etc. */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {/* Conditions du vent */}
          <WeatherCard 
            title="Conditions du vent" 
            icon={<Wind size={18} />}
          >
            <div className="grid grid-cols-2 gap-1">
              <div>
                <div className="text-sm text-white/60">Vitesse</div>
                <div className="text-base font-medium text-white">{mockWeather.windSpeed} km/h</div>
              </div>
              <div>
                <div className="text-sm text-white/60">Rafales</div>
                <div className="text-base font-medium text-white">{mockWeather.windGust} km/h</div>
              </div>
              <div className="col-span-2 mt-2">
                <div className="text-sm text-white/60">Direction</div>
                <div className="flex items-center">
                  <Navigation 
                    className="text-cyan-400 mr-2" 
                    size={16}
                    style={{ transform: `rotate(${mockWeather.windDirection}deg)` }}
                  />
                  <span className="text-base font-medium text-white">
                    {getWindDirection(mockWeather.windDirection)}
                  </span>
                </div>
              </div>
            </div>
          </WeatherCard>

          {/* État de la mer */}
          <WeatherCard 
            title="État de la mer"
            icon={<Wave size={18} />}
          >
            <div className="grid grid-cols-2 gap-1">
              <div>
                <div className="text-sm text-white/60">Hauteur vagues</div>
                <div className="text-base font-medium text-white">{mockWeather.waveHeight} m</div>
              </div>
              <div>
                <div className="text-sm text-white/60">Direction</div>
                <div className="flex items-center">
                  <Navigation 
                    className="text-cyan-400 mr-2" 
                    size={16}
                    style={{ transform: `rotate(${mockWeather.waveDirection}deg)` }}
                  />
                  <span className="text-base font-medium text-white">Nord-Est</span>
                </div>
              </div>
            </div>
          </WeatherCard>

          {/* Marées */}
          <WeatherCard 
            title="Marées" 
            icon={<Compass size={18} />}
          >
            <div className="grid grid-cols-2 gap-1">
              <div>
                <div className="text-sm text-white/60">Niveau actuel</div>
                <div className="text-base font-medium text-white">{mockWeather.tideLevel} m</div>
              </div>
              <div>
                <div className="flex items-center text-sm text-white/60">
                  <ArrowUp className="w-3 h-3 mr-1 text-cyan-400" />
                  Prochaine marée haute
                </div>
                <div className="text-base font-medium text-white">{mockWeather.nextHighTide}</div>
              </div>
              <div className="col-span-2 mt-1">
                <div className="flex items-center text-sm text-white/60">
                  <ArrowDown className="w-3 h-3 mr-1 text-cyan-400" />
                  Prochaine marée basse
                </div>
                <div className="text-base font-medium text-white">{mockWeather.nextLowTide}</div>
              </div>
            </div>
          </WeatherCard>

          {/* Humidité et visibilité */}
          <WeatherCard 
            title="Conditions" 
            icon={<Droplets size={18} />}
          >
            <div className="grid grid-cols-2 gap-1">
              <div>
                <div className="text-sm text-white/60">Humidité</div>
                <div className="text-base font-medium text-white">{mockWeather.humidity}%</div>
              </div>
              <div>
                <div className="text-sm text-white/60">Visibilité</div>
                <div className="text-base font-medium text-white">{mockWeather.visibility} km</div>
              </div>
              <div className="col-span-2 mt-1">
                <div className="text-sm text-white/60">Qualité de l'eau</div>
                <div className="text-base font-medium text-white flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                  Excellente
                </div>
              </div>
            </div>
          </WeatherCard>
        </div>
      </div>
    </div>
  );
}