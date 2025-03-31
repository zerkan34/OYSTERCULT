import React from 'react';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';
import { WeatherAccordion } from './WeatherAccordion';

export function WeatherForecast() {
  return (
    <div className="space-y-3">
      <WeatherAccordion title="Prévisions horaires">
        <div className="space-y-4">
          {/* Exemple de prévisions horaires */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun size={16} className="text-yellow-400" />
              <span>14:00</span>
            </div>
            <div className="flex items-center gap-4">
              <span>22°C</span>
              <div className="flex items-center gap-1">
                <Wind size={14} className="text-cyan-400" />
                <span>12 km/h</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud size={16} className="text-gray-400" />
              <span>15:00</span>
            </div>
            <div className="flex items-center gap-4">
              <span>21°C</span>
              <div className="flex items-center gap-1">
                <Wind size={14} className="text-cyan-400" />
                <span>15 km/h</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CloudRain size={16} className="text-blue-400" />
              <span>16:00</span>
            </div>
            <div className="flex items-center gap-4">
              <span>19°C</span>
              <div className="flex items-center gap-1">
                <Wind size={14} className="text-cyan-400" />
                <span>18 km/h</span>
              </div>
            </div>
          </div>
        </div>
      </WeatherAccordion>

      <WeatherAccordion title="Prévisions des prochains jours">
        <div className="space-y-4">
          {/* Exemple de prévisions journalières */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun size={16} className="text-yellow-400" />
              <span>Demain</span>
            </div>
            <div className="flex items-center gap-4">
              <span>24°C</span>
              <span className="text-sm text-white/50">16°C</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud size={16} className="text-gray-400" />
              <span>Mercredi</span>
            </div>
            <div className="flex items-center gap-4">
              <span>22°C</span>
              <span className="text-sm text-white/50">15°C</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CloudRain size={16} className="text-blue-400" />
              <span>Jeudi</span>
            </div>
            <div className="flex items-center gap-4">
              <span>20°C</span>
              <span className="text-sm text-white/50">14°C</span>
            </div>
          </div>
        </div>
      </WeatherAccordion>
    </div>
  );
}
