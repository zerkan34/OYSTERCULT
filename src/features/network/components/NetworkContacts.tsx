import React from 'react';
import { User, MessageSquare, Star, Phone, Mail, MapPin, MoreVertical } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  company: string;
  position: string;
  avatar?: string;
  email: string;
  phone: string;
  location: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
  favorite: boolean;
  tags: string[];
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    company: 'Huîtres Dupont & Fils',
    position: 'Directeur Commercial',
    email: 'jean.dupont@example.com',
    phone: '06 12 34 56 78',
    location: 'La Rochelle',
    status: 'online',
    favorite: true,
    tags: ['Fournisseur', 'Huîtres']
  },
  {
    id: '2',
    name: 'Marie Martin',
    company: 'Ostréiculture Martin',
    position: 'Responsable Production',
    email: 'marie.martin@example.com',
    phone: '06 23 45 67 89',
    location: 'Marennes',
    status: 'offline',
    lastActive: '2025-02-19T09:15:00',
    favorite: false,
    tags: ['Client', 'Production']
  }
];

interface NetworkContactsProps {
  searchQuery: string;
  onSelectContact: (contactId: string) => void;
}

export function NetworkContacts({ searchQuery, onSelectContact }: NetworkContactsProps) {
  const [selectedContact, setSelectedContact] = React.useState<string | null>(null);

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContacts.map((contact) => (
        <div
          key={contact.id}
          className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-brand-burgundy rounded-full flex items-center justify-center">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <User size={24} className="text-white" />
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-brand-dark ${
                    contact.status === 'online' ? 'bg-green-500' :
                    contact.status === 'away' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{contact.name}</h3>
                  <p className="text-sm text-white/60">{contact.position}</p>
                  <p className="text-sm text-white/40">{contact.company}</p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setSelectedContact(selectedContact === contact.id ? null : contact.id)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <MoreVertical size={20} className="text-white/60" />
                </button>
                {selectedContact === contact.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => onSelectContact(contact.id)}
                      className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Message
                    </button>
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center">
                      <Star size={16} className="mr-2" />
                      {contact.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-white/60">
                <Mail size={16} className="mr-2" />
                {contact.email}
              </div>
              <div className="flex items-center text-sm text-white/60">
                <Phone size={16} className="mr-2" />
                {contact.phone}
              </div>
              <div className="flex items-center text-sm text-white/60">
                <MapPin size={16} className="mr-2" />
                {contact.location}
              </div>
            </div>

            {contact.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {contact.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/5 rounded-full text-sm text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => onSelectContact(contact.id)}
                className="flex-1 px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
              >
                Message
              </button>
              <button className="px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                Profil
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}