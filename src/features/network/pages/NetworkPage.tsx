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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

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
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg" />
          <div className="relative z-10 p-3 rounded-full bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10">
            <Users size={28} className="text-cyan-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Entre Pro
        </h1>
      </motion.div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddFriend(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            <UserPlus size={20} />
            Ajouter un contact
          </button>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus size={20} />
            Nouvelle publication
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 ${
            activeTab === 'feed'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-current={activeTab === 'feed' ? 'page' : undefined}
        >
          <Rss size={16} />
          Fil d'actualités
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 ${
            activeTab === 'contacts'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-current={activeTab === 'contacts' ? 'page' : undefined}
        >
          <Users size={16} />
          Contacts
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 ${
            activeTab === 'directory'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-current={activeTab === 'directory' ? 'page' : undefined}
        >
          <Globe size={16} />
          Annuaire Prestataires
        </button>
        <button
          onClick={() => setActiveTab('forum')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 ${
            activeTab === 'forum'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-current={activeTab === 'forum' ? 'page' : undefined}
        >
          <MessageSquare size={16} />
          Forum
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 ${
            activeTab === 'messages'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-current={activeTab === 'messages' ? 'page' : undefined}
        >
          <MessageCircle size={16} />
          Messagerie
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 ${
            activeTab === 'suppliers'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-current={activeTab === 'suppliers' ? 'page' : undefined}
        >
          <Users size={16} />
          Fournisseurs Amis
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full px-4 py-3 pl-10 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 transition-all text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            aria-label="Rechercher"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 text-white hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300 transform hover:-translate-y-1 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40">
          <Filter size={18} />
          Filtres
        </button>
        <button className="relative p-3 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 text-white hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300 transform hover:-translate-y-1 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40">
          <Bell size={18} className="text-cyan-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(0,210,200,0.5)]">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
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
      </div>

      {showNewPost && (
        <NewPostModal onClose={() => setShowNewPost(false)} type="forum" />
      )}

      {showAddFriend && (
        <AddFriendModal onClose={() => setShowAddFriend(false)} />
      )}
    </div>
  );
}