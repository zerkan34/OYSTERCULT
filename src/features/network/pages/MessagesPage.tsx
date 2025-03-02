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
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="p-1.5 sm:p-2 mr-2 sm:mr-3 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold text-white">Messagerie</h2>
        </div>
      </div>
      <div className="flex-1 flex w-full">
        <MessageList />
      </div>
    </div>
  );
}
