import React from 'react';
import { MessageCircle } from 'lucide-react';

export function MessagesPage() {
  const unreadMessages = 6;

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,128,128,0.9)] to-[rgba(0,160,160,0.7)] blur-xl opacity-70 rounded-full"></div>
          <div className="relative z-10 p-3 rounded-full bg-gradient-to-br from-[rgba(0,128,128,0.3)] to-[rgba(0,60,100,0.3)] shadow-[rgba(0,0,0,0.3)_0px_5px_15px,rgba(0,210,200,0.15)_0px_0px_10px_inset]">
            <MessageCircle size={28} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Messagerie</h1>
      </div>

      {/* Contenu de la messagerie */}
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
        <p className="text-white/70">Contenu de la messagerie à venir...</p>
      </div>
    </div>
  );
}
