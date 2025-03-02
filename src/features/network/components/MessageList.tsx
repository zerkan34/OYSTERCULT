import React, { useState } from 'react';
import { Search, MessageSquare, Plus, X } from 'lucide-react';
import { NetworkChat } from './NetworkChat';

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  online: boolean;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    lastMessage: 'Parfait, merci !',
    lastMessageTime: '10:30',
    unreadCount: 2,
    online: true
  },
  {
    id: '2',
    name: 'Marie Martin',
    lastMessage: 'Je vous recontacte demain',
    lastMessageTime: '09:15',
    online: false
  },
  {
    id: '3',
    name: 'Pierre Durand',
    lastMessage: 'Pouvez-vous me donner les prix pour...',
    lastMessageTime: 'Hier',
    online: true
  },
  {
    id: '4',
    name: 'Sophie Dubois',
    lastMessage: 'Je vous envoie les documents',
    lastMessageTime: 'Lun',
    unreadCount: 1,
    online: false
  },
  {
    id: '5',
    name: 'Luc Moreau',
    lastMessage: 'Merci pour votre réponse',
    lastMessageTime: '23/02',
    online: true
  }
];

export function MessageList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const filteredContacts = mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 h-full w-full max-w-full overflow-hidden">
      {selectedContactId ? (
        <NetworkChat 
          contactId={selectedContactId} 
          onClose={() => setSelectedContactId(null)} 
        />
      ) : (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Messagerie</h2>
            <button 
              className="p-1.5 sm:p-2 bg-brand-burgundy rounded-full text-white hover:bg-brand-burgundy/80 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="p-3 sm:p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 pl-9 sm:pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm sm:text-base"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length > 0 ? (
              <div className="space-y-0.5">
                {filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className="p-2 sm:p-3 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="relative">
                          {contact.avatar ? (
                            <img src={contact.avatar} alt={contact.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center">
                              <span className="text-brand-primary text-base sm:text-lg font-medium">
                                {contact.name.substring(0, 1)}
                              </span>
                            </div>
                          )}
                          {contact.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm sm:text-base">{contact.name}</h3>
                          {contact.lastMessage && (
                            <p className="text-xs sm:text-sm text-white/60 truncate max-w-[150px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[280px]">{contact.lastMessage}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right pl-2 flex flex-col items-end">
                        {contact.lastMessageTime && (
                          <p className="text-xs text-white/40 mb-1">{contact.lastMessageTime}</p>
                        )}
                        {contact.unreadCount && (
                          <div className="bg-brand-burgundy text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {contact.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/40 p-4">
                <MessageSquare size={36} className="mb-3 opacity-30" />
                <p className="text-sm">Aucune conversation trouvée</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
