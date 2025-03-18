import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-lg rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(10, 30, 50, 0.95) 0%, rgba(20, 100, 100, 0.85) 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 8px 24px -2px, rgba(0, 200, 200, 0.1) 0px 4px 12px -2px, rgba(255, 255, 255, 0.05) 0px -1px 2px 0px inset"
        }}
      >
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-cyan-500/10 transition-colors"
          >
            <X className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
