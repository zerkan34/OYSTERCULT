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
      return <Sun className="w-12 h-12 text-yellow-400" aria-hidden="true" role="img" aria-label="Ensoleillé" />;
    case 'cloudy':
      return <Cloud className="w-12 h-12 text-white/60" aria-hidden="true" role="img" aria-label="Nuageux" />;
    case 'rainy':
      return <CloudRain className="w-12 h-12 text-blue-400" aria-hidden="true" role="img" aria-label="Pluvieux" />;
    case 'partly-cloudy':
      return (
        <div className="relative" role="img" aria-label="Partiellement nuageux">
          <Sun className="w-12 h-12 text-yellow-400" aria-hidden="true" />
          <Cloud className="w-8 h-8 text-white/60 absolute -bottom-2 -right-2" aria-hidden="true" />
        </div>
      );
  }
};

// Composant de carte météo réutilisable avec effet de surbrillance
const WeatherCard = ({ 
  title, 
  icon, 
  children 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const cardId = `weather-card-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <motion.div 
      className={`bg-white/5 rounded-lg p-4 transition-all duration-200 relative overflow-hidden ${
        isHovered ? 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' : ''
      }`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      role="region"
      aria-labelledby={cardId}
    >
      {/* Effet de surbrillance bleu */}
      <motion.div
        className="absolute inset-0 bg-blue-500/10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.2 }}
        aria-hidden="true"
      />
      
      <div className="flex items-center space-x-3 mb-4 relative z-10">
        <div className={`text-brand-burgundy transition-all duration-200 ${isHovered ? 'text-blue-400' : ''}`} aria-hidden="true">
          {icon}
        </div>
        <h3 id={cardId} className="text-white font-medium">{title}</h3>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export function WeatherWidget() {
  return (
    <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 border border-white/10 rounded-lg overflow-hidden" role="complementary" aria-label="Conditions météorologiques et maritimes">
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Conditions actuelles */}
        <div className="space-y-6">
          <WeatherCard 
            title="Conditions actuelles" 
            icon={<ThermometerSun size={20} aria-hidden="true" />}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <WeatherIcon condition={mockWeather.conditions} />
                <div>
                  <div className="text-3xl font-bold text-white">{mockWeather.temperature}°C</div>
                  <div className="text-white/60">Partiellement nuageux</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-sm text-white/60">Humidité</div>
                <div className="text-lg font-medium text-white">{mockWeather.humidity}%</div>
              </div>
              <div>
                <div className="text-sm text-white/60">Visibilité</div>
                <div className="text-lg font-medium text-white">{mockWeather.visibility} km</div>
              </div>
            </div>
          </WeatherCard>

          {/* Conditions du vent */}
          <WeatherCard 
            title="Conditions du vent" 
            icon={<Wind size={20} aria-hidden="true" />}
          >
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
                    aria-hidden="true"
                    title={`Direction du vent: ${getWindDirection(mockWeather.windDirection)}`}
                  />
                  <span className="text-lg font-medium text-white">
                    {getWindDirection(mockWeather.windDirection)}
                  </span>
                </div>
              </div>
            </div>
          </WeatherCard>
        </div>

        {/* Mer et marées */}
        <div className="space-y-6">
          {/* État de la mer */}
          <WeatherCard 
            title="État de la mer"
            icon={<Wave size={20} aria-hidden="true" />}
          >
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
                    aria-hidden="true"
                    title={`Direction des vagues: ${getWindDirection(mockWeather.waveDirection)}`}
                  />
                  <span className="text-lg font-medium text-white">
                    {getWindDirection(mockWeather.waveDirection)}
                  </span>
                </div>
              </div>
            </div>
          </WeatherCard>

          {/* Marées */}
          <WeatherCard 
            title="Marées"
            icon={<Compass size={20} aria-hidden="true" />}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-white">Niveau actuel</div>
              <div className="text-lg font-medium text-white">{mockWeather.tideLevel}m</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <ArrowUp className="text-blue-400 mr-2" size={16} aria-hidden="true" />
                <div>
                  <div className="text-sm text-white/60">Marée haute</div>
                  <div className="text-lg font-medium text-white">{mockWeather.nextHighTide}</div>
                </div>
              </div>
              <div className="flex items-center">
                <ArrowDown className="text-amber-400 mr-2" size={16} aria-hidden="true" />
                <div>
                  <div className="text-sm text-white/60">Marée basse</div>
                  <div className="text-lg font-medium text-white">{mockWeather.nextLowTide}</div>
                </div>
              </div>
            </div>
          </WeatherCard>
        </div>
      </div>

      {/* Prévisions */}
      <div className="border-t border-white/10 p-6">
        <h3 className="text-lg font-medium text-white mb-4">Prévisions</h3>
        <div className="grid grid-cols-4 gap-2">
          {mockWeather.forecast.map((f, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3 text-center" role="region" aria-label={`Prévision pour ${f.time}`}>
              <div className="text-sm text-white/80 mb-2">{f.time}</div>
              <div className="flex items-center justify-center mb-2">
                <ThermometerSun className="text-brand-burgundy mr-1" size={14} aria-hidden="true" />
                <span className="text-white">{f.temp}°C</span>
              </div>
              <div className="flex items-center justify-center mb-2">
                <Wind className="text-brand-burgundy mr-1" size={14} aria-hidden="true" />
                <span className="text-white">{f.windSpeed}km/h</span>
              </div>
              <div className="flex items-center justify-center">
                <Wave className="text-brand-burgundy mr-1" size={14} aria-hidden="true" />
                <span className="text-white">{f.waveHeight}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}