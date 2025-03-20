import React, { useState } from 'react';
import { Send, Paperclip, Image, Smile, Search, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isMe: boolean;
}

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

// Messages pour chaque contact
const mockMessagesByContact: Record<string, Message[]> = {
  // Jean Dupont
  '1': [
    {
      id: '1-1',
      content: 'Bonjour, avez-vous des huîtres plates disponibles ?',
      sender: 'Jean Dupont',
      timestamp: '10:15',
      isMe: false
    },
    {
      id: '1-2',
      content: 'Oui, nous en avons en stock. Quelle quantité vous intéresse ?',
      sender: 'Moi',
      timestamp: '10:20',
      isMe: true
    },
    {
      id: '1-3',
      content: 'Je cherche environ 500 douzaines pour un événement',
      sender: 'Jean Dupont',
      timestamp: '10:25',
      isMe: false
    },
    {
      id: '1-4',
      content: 'Parfait, merci !',
      sender: 'Jean Dupont',
      timestamp: '10:30',
      isMe: false
    }
  ],
  
  // Marie Martin
  '2': [
    {
      id: '2-1',
      content: 'Bonjour, je souhaite connaître vos tarifs pour une livraison à Paris',
      sender: 'Marie Martin',
      timestamp: '09:00',
      isMe: false
    },
    {
      id: '2-2',
      content: 'Bonjour Marie, pour Paris les frais de livraison sont de 15€ pour les commandes inférieures à 100€, et gratuits au-delà',
      sender: 'Moi',
      timestamp: '09:10',
      isMe: true
    },
    {
      id: '2-3',
      content: 'Je vous recontacte demain pour passer ma commande, merci',
      sender: 'Marie Martin',
      timestamp: '09:15',
      isMe: false
    }
  ],
  
  // Pierre Durand
  '3': [
    {
      id: '3-1',
      content: 'Bonjour, j\'organise un mariage le mois prochain',
      sender: 'Pierre Durand',
      timestamp: '14:20',
      isMe: false
    },
    {
      id: '3-2',
      content: 'Félicitations ! Nous pouvons vous proposer une dégustation d\'huîtres pour votre événement',
      sender: 'Moi',
      timestamp: '14:30',
      isMe: true
    },
    {
      id: '3-3',
      content: 'Pouvez-vous me donner les prix pour 200 personnes ?',
      sender: 'Pierre Durand',
      timestamp: '14:35',
      isMe: false
    }
  ],
  
  // Sophie Dubois
  '4': [
    {
      id: '4-1',
      content: 'J\'ai besoin d\'une facture pour ma dernière commande',
      sender: 'Sophie Dubois',
      timestamp: 'Lun 15:10',
      isMe: false
    },
    {
      id: '4-2',
      content: 'Bien sûr, je vous prépare cela tout de suite',
      sender: 'Moi',
      timestamp: 'Lun 15:20',
      isMe: true
    },
    {
      id: '4-3',
      content: 'Je vous envoie les documents dès que possible',
      sender: 'Sophie Dubois',
      timestamp: 'Lun 15:25',
      isMe: false
    }
  ],
  
  // Luc Moreau
  '5': [
    {
      id: '5-1',
      content: 'Avez-vous des huîtres spéciales de Marennes-Oléron ?',
      sender: 'Luc Moreau',
      timestamp: '23/02 11:05',
      isMe: false
    },
    {
      id: '5-2',
      content: 'Oui, nous avons des spéciales n°2 et n°3, ainsi que des fines de claire',
      sender: 'Moi',
      timestamp: '23/02 11:15',
      isMe: true
    },
    {
      id: '5-3',
      content: 'Je vais prendre deux douzaines de spéciales n°2',
      sender: 'Luc Moreau',
      timestamp: '23/02 11:30',
      isMe: false
    },
    {
      id: '5-4',
      content: 'Merci pour votre réponse',
      sender: 'Luc Moreau',
      timestamp: '23/02 11:35',
      isMe: false
    }
  ]
};

// Ancien mockMessages, maintenu pour compatibilité
const mockMessages: Message[] = mockMessagesByContact['1'];

interface NetworkChatProps {
  contactId: string;
  onClose: () => void;
}

const findContactById = (id: string) => {
  return mockContacts.find((contact) => contact.id === id);
};

export function NetworkChat({ contactId, onClose }: NetworkChatProps) {
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const [selectedContactIdInternal, setSelectedContactIdInternal] = useState<string>(contactId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [mockMessagesByContact[selectedContactIdInternal]]);

  React.useEffect(() => {
    setSelectedContactIdInternal(contactId);
  }, [contactId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log('Message envoyé:', message);
    setMessage('');
  };

  const handleContactChange = (newContactId: string) => {
    setSelectedContactIdInternal(newContactId);
  };

  const selectedContact = findContactById(selectedContactIdInternal);

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col md:flex-row">
      <div className="hidden md:block w-80 border-r border-white/10">
        <div className="p-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une conversation..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {mockContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactChange(contact.id)}
              className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                contact.id === selectedContactIdInternal ? 'bg-white/5' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-brand-burgundy rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {contact.name.charAt(0)}
                    </span>
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-brand-dark" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium truncate">
                      {contact.name}
                    </h3>
                    {contact.lastMessageTime && (
                      <span className="text-xs text-white/40">
                        {contact.lastMessageTime}
                      </span>
                    )}
                  </div>
                  {contact.lastMessage && (
                    <p className="text-sm text-white/60 truncate">
                      {contact.lastMessage}
                    </p>
                  )}
                </div>
                {contact.unreadCount && contact.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-brand-burgundy rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">
                      {contact.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full">
        <div className="p-3 md:p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <button 
                onClick={onClose}
                className="p-1.5 md:p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Retour à la liste des contacts"
              >
                <ArrowLeft size={18} className="md:w-5 md:h-5" />
              </button>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-burgundy rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm md:text-base">
                  {selectedContact?.name.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <h3 className="text-white font-medium text-sm md:text-base">{selectedContact?.name || 'Contact'}</h3>
                <p className="text-xs md:text-sm text-green-400">{selectedContact?.online ? 'En ligne' : 'Hors ligne'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {mockMessagesByContact[selectedContactIdInternal].map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-lg p-2 md:p-3 ${
                  msg.isMe
                    ? 'bg-brand-burgundy text-white'
                    : 'bg-white/5 text-white'
                }`}
              >
                <p className="text-sm md:text-base">{msg.content}</p>
                <div className={`text-[10px] md:text-xs mt-1 ${
                  msg.isMe ? 'text-white/60' : 'text-white/40'
                }`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 md:p-4 border-t border-white/10">
          <div className="flex items-end space-x-2 md:space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="w-full px-3 py-2 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm md:text-base placeholder-white/40 resize-none"
                rows={1}
              />
              <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 flex items-center space-x-1 md:space-x-2">
                <button
                  type="button"
                  className="p-1 text-white/40 hover:text-white transition-colors"
                >
                  <Paperclip size={16} className="md:w-5 md:h-5" />
                </button>
                <button
                  type="button"
                  className="p-1 text-white/40 hover:text-white transition-colors"
                >
                  <Image size={16} className="md:w-5 md:h-5" />
                </button>
                <button
                  type="button"
                  className="p-1 text-white/40 hover:text-white transition-colors"
                >
                  <Smile size={16} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-3 py-2 md:px-4 md:py-3 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}