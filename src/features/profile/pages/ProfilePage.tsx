import React, { useState } from 'react';
import { UserCircle, Mail, Phone, Key, Download, Bell, Shield, History, Users, Settings, FileText } from 'lucide-react';
import { ProfileInfo } from '../components/ProfileInfo';
import { SecuritySettings } from '../components/SecuritySettings';
import { ActivityHistory } from '../components/ActivityHistory';
import { ExportData } from '../components/ExportData';
import { FriendCode } from '../components/FriendCode';
import { motion } from 'framer-motion';
import { PageTitle } from '@/components/ui/PageTitle';
import { ConfigPage } from '@/features/config/pages/ConfigPage';
import { ActionLog } from '../components/ActionLog';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'action-log' | 'friend-code' | 'security' | 'activity' | 'export' | 'config'>('info');

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageTitle 
        icon={<UserCircle size={28} className="text-white" />}
        title="Mon Espace"
      />
      <div className="flex items-center justify-between">
      </div>

      <div className="flex items-center space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('config')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'config'
              ? 'border-brand-burgundy text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Settings size={16} className="mr-2" />
            Configuration
          </div>
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'info'
              ? 'border-brand-burgundy text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <UserCircle size={16} className="mr-2" />
            Informations
          </div>
        </button>
        <button
          onClick={() => setActiveTab('action-log')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'action-log'
              ? 'border-brand-burgundy text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <FileText size={16} className="mr-2" />
            Journal d'actions
          </div>
        </button>
        <button
          onClick={() => setActiveTab('friend-code')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'friend-code'
              ? 'border-brand-burgundy text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Users size={16} className="mr-2" />
            Code ami
          </div>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-brand-burgundy text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Shield size={16} className="mr-2" />
            Sécurité
          </div>
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-brand-burgundy text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <History size={16} className="mr-2" />
            Activité
          </div>
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'export'
              ? 'border-brand-burgundy text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </div>
        </button>
      </div>

      {activeTab === 'info' && <ProfileInfo />}
      {activeTab === 'action-log' && <ActionLog />}
      {activeTab === 'friend-code' && <FriendCode />}
      {activeTab === 'security' && <SecuritySettings />}
      {activeTab === 'activity' && <ActivityHistory />}
      {activeTab === 'export' && <ExportData />}
      {activeTab === 'config' && <ConfigPage />}
    </motion.div>
  );
}