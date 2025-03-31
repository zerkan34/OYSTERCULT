export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  online: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isMe: boolean;
}

export const mockContacts: Contact[] = [
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

export const mockMessagesByContact: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      content: 'Bonjour, comment allez-vous ?',
      sender: 'Jean Dupont',
      timestamp: '10:00',
      isMe: false
    },
    {
      id: '2',
      content: 'Très bien, merci ! Et vous ?',
      sender: 'Moi',
      timestamp: '10:15',
      isMe: true
    },
    {
      id: '3',
      content: 'Parfait, merci !',
      sender: 'Jean Dupont',
      timestamp: '10:30',
      isMe: false
    }
  ],
  '2': [
    {
      id: '1',
      content: 'Hey, on se voit demain ?',
      sender: 'Marie Martin',
      timestamp: '09:15',
      isMe: false
    }
  ],
  '3': [
    {
      id: '1',
      content: 'Bonjour, pouvez-vous me donner les prix pour vos services ?',
      sender: 'Pierre Durand',
      timestamp: 'Hier',
      isMe: false
    }
  ],
  '4': [
    {
      id: '1',
      content: 'Je vous envoie les documents demandés en pièce jointe.',
      sender: 'Sophie Dubois',
      timestamp: 'Lun',
      isMe: false
    }
  ],
  '5': [
    {
      id: '1',
      content: 'Merci pour votre réponse rapide !',
      sender: 'Luc Moreau',
      timestamp: '23/02',
      isMe: false
    }
  ]
};

export const findContactById = (id: string): Contact | undefined => {
  return mockContacts.find(contact => contact.id === id);
};
