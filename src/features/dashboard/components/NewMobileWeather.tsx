import React from 'react';
import { 
  Cloud, 
  Wind, 
  Droplets, 
  Navigation, 
  ThermometerSun, 
  Waves, 
  Sun,
  CloudRain,
  ArrowUp,
  ArrowDown,
  Clock,
  Moon,
  CloudSun,
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';

// Types
interface WeatherData {
  temperature: number;
  feelsLike: number;
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
    conditions: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  }>;
  dailyForecast: Array<{
    day: string;
    highTemp: number;
    lowTemp: number;
    conditions: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
    windSpeed: number;
    waveHeight: number;
    precipitation: number;
  }>;
  sunrise: string;
  sunset: string;
}

// Données mock pour l'affichage
const mockWeather: WeatherData = {
  temperature: 18,
  feelsLike: 16,
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
  visibility: 15,
  sunrise: '06:45',
  sunset: '20:35',
  forecast: [
    { time: '12:00', temp: 18, windSpeed: 15, windDirection: 315, waveHeight: 0.8, conditions: 'partly-cloudy' },
    { time: '15:00', temp: 19, windSpeed: 18, windDirection: 320, waveHeight: 0.9, conditions: 'sunny' },
    { time: '18:00', temp: 17, windSpeed: 20, windDirection: 300, waveHeight: 1.0, conditions: 'partly-cloudy' },
    { time: '21:00', temp: 16, windSpeed: 15, windDirection: 280, waveHeight: 0.7, conditions: 'cloudy' },
    { time: '00:00', temp: 15, windSpeed: 12, windDirection: 270, waveHeight: 0.5, conditions: 'cloudy' },
    { time: '03:00', temp: 14, windSpeed: 10, windDirection: 260, waveHeight: 0.4, conditions: 'partly-cloudy' },
    { time: '06:00', temp: 15, windSpeed: 12, windDirection: 280, waveHeight: 0.6, conditions: 'partly-cloudy' },
    { time: '09:00', temp: 17, windSpeed: 14, windDirection: 290, waveHeight: 0.7, conditions: 'sunny' }
  ],
  dailyForecast: [
    { day: 'Aujourd\'hui', highTemp: 19, lowTemp: 14, conditions: 'partly-cloudy', windSpeed: 20, waveHeight: 1.0, precipitation: 10 },
    { day: 'Demain', highTemp: 20, lowTemp: 15, conditions: 'sunny', windSpeed: 15, waveHeight: 0.8, precipitation: 0 },
    { day: 'Lundi', highTemp: 22, lowTemp: 16, conditions: 'sunny', windSpeed: 12, waveHeight: 0.6, precipitation: 0 },
    { day: 'Mardi', highTemp: 21, lowTemp: 17, conditions: 'partly-cloudy', windSpeed: 14, waveHeight: 0.7, precipitation: 5 },
    { day: 'Mercredi', highTemp: 19, lowTemp: 15, conditions: 'cloudy', windSpeed: 18, waveHeight: 0.9, precipitation: 30 },
    { day: 'Jeudi', highTemp: 18, lowTemp: 14, conditions: 'rainy', windSpeed: 20, waveHeight: 1.2, precipitation: 80 },
    { day: 'Vendredi', highTemp: 17, lowTemp: 13, conditions: 'cloudy', windSpeed: 15, waveHeight: 1.0, precipitation: 40 }
  ]
};

// Fonction utilitaire pour convertir les degrés en direction cardinale
const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return directions[Math.round(degrees / 45) % 8];
};

// Composant pour l'icône météo
const WeatherIcon: React.FC<{ condition: WeatherData['conditions']; size?: number; className?: string }> = ({ 
  condition, 
  size = 32,
  className = ""
}) => {
  switch (condition) {
    case 'sunny':
      return <Sun size={size} className={`text-yellow-400 ${className}`} />;
    case 'cloudy':
      return <Cloud size={size} className={`text-gray-300 ${className}`} />;
    case 'rainy':
      return <CloudRain size={size} className={`text-blue-300 ${className}`} />;
    case 'partly-cloudy':
      return <CloudSun size={size} className={`text-gray-200 ${className}`} />;
    default:
      return <CloudSun size={size} className={`text-gray-200 ${className}`} />;
  }
};

// Composant de vignette pour les prévisions
const ForecastCard: React.FC<{ forecast: WeatherData['forecast'][0] }> = ({ forecast }) => {
  return (
    <div className="forecast-card">
      <p className="forecast-time">{forecast.time}</p>
      <WeatherIcon condition={forecast.conditions} size={24} className="my-2" />
      <p className="forecast-temp">{forecast.temp}°</p>
      <div className="forecast-wind-indicator">
        <Navigation size={12} style={{ transform: `rotate(${forecast.windDirection}deg)` }} />
        <span>{forecast.windSpeed}</span>
      </div>
      <p className="forecast-waves">{forecast.waveHeight} m</p>
    </div>
  );
};

// Composant de vignette pour les prévisions quotidiennes
const DailyForecastCard: React.FC<{ forecast: WeatherData['dailyForecast'][0] }> = ({ forecast }) => {
  return (
    <div className="daily-forecast-row">
      <div className="daily-forecast-day">{forecast.day}</div>
      <div className="daily-forecast-icon">
        <WeatherIcon condition={forecast.conditions} size={20} />
      </div>
      <div className="daily-forecast-precip">
        <Droplets size={14} className="text-blue-300" />
        <span>{forecast.precipitation}%</span>
      </div>
      <div className="daily-forecast-temp">
        <span className="high-temp">{forecast.highTemp}°</span>
        <span className="low-temp">{forecast.lowTemp}°</span>
      </div>
    </div>
  );
};

export const MobileWeatherWidget: React.FC = () => {
  return (
    <div className="mobile-weather-container">
      {/* Header: contient le titre et l'emplacement */}
      <header className="weather-header">
        <h1 className="weather-location-title">Météo & Marée</h1>
        <div className="weather-update-time">
          <Clock size={14} className="text-cyan-300" />
          <span>Mise à jour {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </header>

      {/* Section principale: température actuelle et conditions */}
      <section className="current-weather">
        <div className="primary-info">
          <div className="temp-display">
            <span className="current-temp">{mockWeather.temperature}°</span>
            <span className="feels-like">Ressenti {mockWeather.feelsLike}°</span>
          </div>
          <div className="weather-icon-large">
            <WeatherIcon condition={mockWeather.conditions} size={80} />
          </div>
        </div>
        
        <div className="weather-condition-text">
          {mockWeather.conditions === 'sunny' ? 'Ensoleillé' : 
           mockWeather.conditions === 'cloudy' ? 'Nuageux' : 
           mockWeather.conditions === 'rainy' ? 'Pluvieux' : 'Partiellement nuageux'}
        </div>
      </section>

      {/* Section des indicateurs actuels */}
      <section className="current-indicators">
        <div className="indicator-item">
          <Wind size={18} className="indicator-icon" />
          <div className="indicator-label">Vent</div>
          <div className="indicator-value">{mockWeather.windSpeed} km/h</div>
          <div className="indicator-detail">{getWindDirection(mockWeather.windDirection)}</div>
        </div>
        
        <div className="indicator-item">
          <Waves size={18} className="indicator-icon" />
          <div className="indicator-label">Vagues</div>
          <div className="indicator-value">{mockWeather.waveHeight} m</div>
          <div className="indicator-detail">{getWindDirection(mockWeather.waveDirection)}</div>
        </div>
        
        <div className="indicator-item">
          <Droplets size={18} className="indicator-icon" />
          <div className="indicator-label">Humidité</div>
          <div className="indicator-value">{mockWeather.humidity}%</div>
        </div>
        
        <div className="indicator-item">
          <motion.div
            className="tide-indicator"
            animate={{
              height: `${(mockWeather.tideLevel / 10) * 100}%`
            }}
            transition={{ duration: 1 }}
          >
            <div className="indicator-label">Marée</div>
            <div className="indicator-value">{mockWeather.tideLevel} m</div>
            <div className="tide-times">
              <div><ArrowUp size={12} /> {mockWeather.nextHighTide}</div>
              <div><ArrowDown size={12} /> {mockWeather.nextLowTide}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section des prévisions horaires */}
      <section className="hourly-forecast">
        <h2 className="section-title">Prévisions horaires</h2>
        <div className="forecast-scroll-container">
          {mockWeather.forecast.map((item, index) => (
            <ForecastCard key={index} forecast={item} />
          ))}
        </div>
      </section>

      {/* Section des prévisions quotidiennes */}
      <section className="daily-forecast">
        <h2 className="section-title">Prévisions 7 jours</h2>
        <div className="daily-forecast-container">
          {mockWeather.dailyForecast.map((day, index) => (
            <DailyForecastCard key={index} forecast={day} />
          ))}
        </div>
      </section>

      {/* Section détails vent et vagues */}
      <section className="wind-detail-section">
        <h2 className="section-title">Détails du vent</h2>
        <div className="wind-detail-container">
          <div className="wind-compass">
            <Compass size={100} className="wind-compass-base" />
            <div 
              className="wind-direction-indicator" 
              style={{ transform: `rotate(${mockWeather.windDirection}deg)` }}
            >
              <Navigation size={40} className="text-cyan-400" />
            </div>
          </div>
          <div className="wind-stats">
            <div className="wind-stat-row">
              <span>Direction</span>
              <span>{getWindDirection(mockWeather.windDirection)} ({mockWeather.windDirection}°)</span>
            </div>
            <div className="wind-stat-row">
              <span>Vitesse</span>
              <span>{mockWeather.windSpeed} km/h</span>
            </div>
            <div className="wind-stat-row">
              <span>Rafales</span>
              <span>{mockWeather.windGust} km/h</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Lever/Coucher du soleil */}
      <section className="sun-times">
        <div className="sun-time-container">
          <div className="sunrise">
            <Sun size={18} className="text-yellow-400" />
            <span className="sun-time-label">Lever</span>
            <span className="sun-time-value">{mockWeather.sunrise}</span>
          </div>
          <div className="sun-path">
            <div className="sun-path-line"></div>
          </div>
          <div className="sunset">
            <Moon size={18} className="text-blue-300" />
            <span className="sun-time-label">Coucher</span>
            <span className="sun-time-value">{mockWeather.sunset}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileWeatherWidget;
