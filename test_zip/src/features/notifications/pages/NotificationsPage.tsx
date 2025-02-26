import React, { useState } from 'react';
import { Bell, Filter, Search, BarChart2, CheckCircle2, AlertTriangle, Clock, Settings } from 'lucide-react';
import { NotificationList } from '../components/NotificationList';
import { NotificationStats } from '../components/NotificationStats';
import { NotificationSettings } from '../components/NotificationSettings';

export function NotificationsPage() {
  const [showStats, setShowStats] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'important'>('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <BarChart2 size={20} className="mr-2" />
            Statistiques
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <Settings size={20} className="mr-2" />
            Paramètres
          </button>
        </div>
      </div>

      {showStats && <NotificationStats />}

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans les notifications..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'all'
                ? 'bg-brand-burgundy text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'unread'
                ? 'bg-brand-burgundy text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Non lues
          </button>
          <button
            onClick={() => setActiveFilter('important')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'important'
                ? 'bg-brand-burgundy text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Importantes
          </button>
        </div>
      </div>

      <NotificationList 
        searchQuery={searchQuery} 
        filter={activeFilter}
      />

      {showSettings && (
        <NotificationSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}