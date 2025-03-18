import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MessageSquare, 
  Globe, 
  Bell, 
  Rss, 
  MessageCircle, 
  UserPlus 
} from 'lucide-react';
import { ProDirectory } from '../components/ProDirectory';
import { Forum } from '../components/Forum';
import { NetworkFeed } from '../components/NetworkFeed';
import { NetworkContacts } from '../components/NetworkContacts';
import { NetworkChat } from '../components/NetworkChat';
import { NewPostModal } from '../components/NewPostModal';
import { AddFriendModal } from '../components/AddFriendModal';
import { FriendSuppliers } from '../components/FriendSuppliers';
import { MessageList } from '../components/MessageList';
import { useStore } from '@/lib/store';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type NetworkTab = 'feed' | 'contacts' | 'directory' | 'forum' | 'messages' | 'suppliers';

interface NetworkPageProps {
  messageView?: boolean;
  activeTab?: NetworkTab;
}

export function NetworkPage({ messageView = false, activeTab: initialActiveTab }: NetworkPageProps) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<NetworkTab>(initialActiveTab || messageView ? 'messages' : 'feed');
  const [showNewPost, setShowNewPost] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const { unreadCount } = useStore();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    } else if (messageView) {
      setActiveTab('messages');
    }
  }, [messageView, initialActiveTab]);

  useEffect(() => {
    if (location.pathname === '/network/messages' && activeTab !== 'messages') {
      setActiveTab('messages');
    }
  }, [location.pathname, activeTab]);

  return (
    <div className="p-6 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-8"
      >
        <div className="relative mr-4">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,128,128,0.9)] to-[rgba(0,160,160,0.7)] blur-xl opacity-70 rounded-full" />
          <div className="relative z-10 p-3 rounded-full bg-gradient-to-br from-[rgba(0,128,128,0.3)] to-[rgba(0,60,100,0.3)] shadow-[rgba(0,0,0,0.3)_0px_5px_15px,rgba(0,210,200,0.15)_0px_0px_10px_inset]">
            <Users size={28} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
          Entre Pro
        </h1>
      </motion.div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddFriend(true)}
            className="relative flex items-center px-4 py-2 bg-brand-primary/20 rounded-lg text-brand-primary hover:bg-brand-primary/30 transition-colors"
          >
            <UserPlus size={20} className="mr-2" />
            Ajouter un contact
          </button>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center px-4 py-2 bg-brand-primary/20 rounded-lg text-brand-primary hover:bg-brand-primary/30 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nouvelle publication
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('feed')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'feed'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Rss size={16} className="mr-2" />
            Fil d'actualités
          </div>
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'contacts'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Users size={16} className="mr-2" />
            Contacts
          </div>
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'directory'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Globe size={16} className="mr-2" />
            Annuaire Prestataires
          </div>
        </button>
        <button
          onClick={() => setActiveTab('forum')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'forum'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <MessageSquare size={16} className="mr-2" />
            Forum
          </div>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'messages'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <MessageCircle size={16} className="mr-2" />
            Messagerie
          </div>
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'suppliers'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Users size={16} className="mr-2" />
            Fournisseurs Amis
          </div>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
          <Filter size={20} className="mr-2" />
          Filtres
        </button>
        <button className="relative p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
          <Bell size={20} className="text-amber-500 drop-shadow-[0_0_3px_rgba(245,158,11,0.5)]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'feed' && <NetworkFeed />}
      {activeTab === 'contacts' && (
        <NetworkContacts 
          searchQuery={searchQuery}
          onSelectContact={(contactId) => {
            setSelectedContactId(contactId);
            setActiveTab('feed');
          }}
        />
      )}
      {activeTab === 'directory' && (
        <ProDirectory 
          searchQuery={searchQuery} 
          selectedSkill={selectedSkill}
        />
      )}
      {activeTab === 'forum' && (
        <Forum searchQuery={searchQuery} />
      )}
      {activeTab === 'messages' && (
        <MessageList />
      )}
      {activeTab === 'suppliers' && (
        <FriendSuppliers />
      )}

      {showNewPost && (
        <NewPostModal onClose={() => setShowNewPost(false)} />
      )}

      {showAddFriend && (
        <AddFriendModal onClose={() => setShowAddFriend(false)} />
      )}
    </div>
  );
}