import { useState, useEffect } from 'react';

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  online: boolean;
}

// Mock data, à remplacer ultérieurement par des données réelles d'API
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

export function useMessages() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);

  // Calculer le nombre total de messages non lus
  useEffect(() => {
    const count = contacts.reduce((total, contact) => {
      return total + (contact.unreadCount || 0);
    }, 0);
    setTotalUnreadCount(count);
  }, [contacts]);

  const markAsRead = (contactId: string) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, unreadCount: 0 } 
          : contact
      )
    );
  };

  const addMessage = (contactId: string, message: string, isFromUser: boolean = false) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { 
              ...contact, 
              lastMessage: message,
              lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unreadCount: isFromUser ? contact.unreadCount || 0 : (contact.unreadCount || 0) + 1
            } 
          : contact
      )
    );
  };

  return {
    contacts,
    totalUnreadCount,
    markAsRead,
    addMessage
  };
}
