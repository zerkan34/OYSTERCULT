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

export function WeatherWidget() {
  return (
    <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 border border-white/10 rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Conditions actuelles */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-4">
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
          </div>

          {/* Conditions du vent */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Wind className="text-brand-burgundy" size={20} />
              <h3 className="text-white font-medium">Conditions du vent</h3>
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
            </div>
          </div>
        </div>

        {/* Mer et marées */}
        <div className="space-y-6">
          {/* État de la mer */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Wave className="text-brand-burgundy" size={20} />
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
              <Wave className="text-brand-burgundy" size={20} />
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
                  <Wave className="w-4 h-4 text-brand-burgundy mr-1" />
                  <span>{forecast.waveHeight}m</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}