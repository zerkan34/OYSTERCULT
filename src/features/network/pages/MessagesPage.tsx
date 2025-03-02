import React from 'react';
import { MessageList } from '../components/MessageList';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function MessagesPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background text-white">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="p-2 mr-3 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-white">Messagerie</h2>
        </div>
      </div>
      <div className="flex-1 flex">
        <MessageList />
      </div>
    </div>
  );
}
