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
import { useStore } from '@/lib/store';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type NetworkTab = 'feed' | 'contacts' | 'directory' | 'forum' | 'messages' | 'suppliers';

interface NetworkPageProps {
  messageView?: boolean;
}

export function NetworkPage({ messageView = false }: NetworkPageProps) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<NetworkTab>(messageView ? 'messages' : 'feed');
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
    if (messageView) {
      setActiveTab('messages');
    }
  }, [messageView]);

  useEffect(() => {
    if (location.pathname === '/network/messages' && activeTab !== 'messages') {
      setActiveTab('messages');
    }
  }, [location.pathname, activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Entre Pro</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddFriend(true)}
            className="relative flex items-center px-4 py-2 bg-brand-primary/20 rounded-lg text-brand-primary hover:bg-brand-primary/30 transition-colors"
          >
            <UserPlus size={20} className="mr-2" />
            Ajouter un contact
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className="relative flex items-center px-4 py-2 bg-brand-primary/20 rounded-lg text-brand-primary hover:bg-brand-primary/30 transition-colors"
          >
            <MessageCircle size={20} className="mr-2" />
            Messagerie
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-brand-primary rounded-full flex items-center justify-center px-1 text-xs font-medium text-white shadow-lg">
                {unreadCount}
              </span>
            )}
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
          onClick={() => setActiveTab('messages')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'messages'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <MessageSquare size={16} className="mr-2" />
            Messagerie
            {unreadCount > 0 && (
              <span className="ml-2 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
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
            Mon Réseau
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
            Annuaire
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

      {activeTab !== 'messages' && (
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
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {activeTab === 'feed' && <NetworkFeed />}
      {activeTab === 'messages' && (
        <NetworkChat 
          contactId={selectedContactId || 'default'} 
          onClose={() => setActiveTab('feed')} 
        />
      )}
      {activeTab === 'contacts' && (
        <NetworkContacts 
          searchQuery={searchQuery}
          onSelectContact={(contactId) => {
            setSelectedContactId(contactId);
            setActiveTab('messages');
          }}
        />
      )}
      {activeTab === 'directory' && (
        <ProDirectory 
          searchQuery={searchQuery} 
          selectedSkill={selectedSkill}
        />
      )}
      {activeTab === 'forum' && <Forum searchQuery={searchQuery} />}
      {activeTab === 'suppliers' && <FriendSuppliers />}

      {showNewPost && (
        <NewPostModal onClose={() => setShowNewPost(false)} type={activeTab} />
      )}

      {showAddFriend && (
        <AddFriendModal onClose={() => setShowAddFriend(false)} />
      )}
    </div>
  );
}