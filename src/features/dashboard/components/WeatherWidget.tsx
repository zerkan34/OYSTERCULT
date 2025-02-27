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
  children 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div 
      className={`bg-white/5 rounded-lg p-4 transition-all duration-200 relative overflow-hidden ${
        isHovered ? 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' : ''
      }`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
    >
      {/* Effet de surbrillance bleu */}
      <motion.div
        className="absolute inset-0 bg-blue-500/10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.2 }}
      />
      
      <div className="flex items-center space-x-3 mb-4 relative z-10">
        <div className={`text-brand-burgundy transition-all duration-200 ${isHovered ? 'text-blue-400' : ''}`}>
          {icon}
        </div>
        <h3 className="text-white font-medium">{title}</h3>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export function WeatherWidget() {
  return (
    <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 border border-white/10 rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Conditions actuelles */}
        <div className="space-y-6">
          <WeatherCard 
            title="Conditions actuelles" 
            icon={<ThermometerSun size={20} />}
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
            icon={<Wind size={20} />}
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
            icon={<Wave size={20} />}
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
            icon={<Wave size={20} />}
          >
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
          </WeatherCard>
        </div>
      </div>

      {/* Prévisions horaires en bas */}
      <div className="border-t border-white/10 p-6">
        <h3 className="text-white font-medium mb-4">Prévisions horaires</h3>
        <div className="grid grid-cols-4 gap-4">
          {mockWeather.forecast.map((forecast, index) => (
            <motion.div 
              key={index} 
              className="bg-white/5 rounded-lg p-3 transition-all duration-200 relative overflow-hidden"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)"
              }}
              onHoverStart={(e) => {
                // Ajouter une classe pour l'effet de surbrillance si nécessaire
              }}
            >
              {/* Effet de surbrillance au survol */}
              <motion.div
                className="absolute inset-0 bg-blue-500/10 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.2 }}
              />
              
              <div className="relative z-10">
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
                    <Wave className="w-4 h-4 text-brand-burgundy mr-1" />
                    <span>{forecast.waveHeight}m</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}