import React, { useState } from 'react';
import { Send, Paperclip, Image, Smile, Search, ArrowLeft, MessageSquare } from 'lucide-react';
import { mockContacts, mockMessagesByContact, findContactById, Message, Contact } from '../data/mockData';

interface NetworkChatProps {
  contactId: string;
  onClose: () => void;
}

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
    <div className="h-full flex flex-col md:flex-row">
      <div className="hidden md:block w-80 border-r border-white/10">
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
          {mockMessagesByContact[selectedContactIdInternal] ? (
            mockMessagesByContact[selectedContactIdInternal].map((msg) => (
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
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/40 p-4">
              <MessageSquare size={36} className="mb-3 opacity-30" />
              <p className="text-sm">Aucun message disponible</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 md:p-4 border-t border-white/10">
          <div className="flex space-x-2 md:space-x-4">
            <div className="flex-1 relative flex">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="w-full px-3 py-2 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm md:text-base placeholder-white/40 resize-none h-full min-h-[40px] md:min-h-[46px]"
                rows={1}
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-3 flex items-center space-x-1 md:space-x-2">
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
              className="px-3 py-2 md:px-4 md:py-3 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center self-stretch min-h-[40px] md:min-h-[46px]"
            >
              <Send size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}