import React, { useState } from 'react';
import { UserCircle, Mail, Phone, Key, Download, Bell, Shield, History, Users } from 'lucide-react';
import { ProfileInfo } from '../components/ProfileInfo';
import { SecuritySettings } from '../components/SecuritySettings';
import { ActivityHistory } from '../components/ActivityHistory';
import { ExportData } from '../components/ExportData';
import { FriendCode } from '../components/FriendCode';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'friend-code' | 'security' | 'activity' | 'export'>('info');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Mon Espace</h1>
      </div>

      <div className="flex items-center space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('info')}
          className={`py-4 text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'info'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserCircle size={16} />
          Informations
        </button>
        <button
          onClick={() => setActiveTab('friend-code')}
          className={`py-4 text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'friend-code'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users size={16} />
          Code ami
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-4 text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'security'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield size={16} />
          Sécurité
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`py-4 text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'activity'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <History size={16} />
          Activité
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`py-4 text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'export'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {activeTab === 'info' && <ProfileInfo />}
      {activeTab === 'friend-code' && <FriendCode />}
      {activeTab === 'security' && <SecuritySettings />}
      {activeTab === 'activity' && <ActivityHistory />}
      {activeTab === 'export' && <ExportData />}
    </div>
  );
}