import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useClickOutside } from '@/lib/hooks';

// Compteur global pour suivre le niveau d'imbrication des modales
let modalCounter = 0;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
};

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md',
  showCloseButton = true,
  className = ''
}: ModalProps) {
  const modalRef = useClickOutside(onClose);
  
  // Référence pour stocker le niveau de z-index de cette modale
  const zIndexRef = useRef<number>(0);
  
  // Générer un z-index unique pour cette modale lors de son ouverture
  useEffect(() => {
    if (isOpen) {
      modalCounter += 1;
      zIndexRef.current = 9000 + modalCounter;
    }
    
    return () => {
      if (isOpen) {
        modalCounter -= 1;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      // Ne fermer que la modale de plus haut niveau lorsqu'on appuie sur Escape
      if (e.key === 'Escape' && zIndexRef.current === 9000 + modalCounter) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0" style={{ zIndex: zIndexRef.current }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className={`modal-container w-full ${sizeClasses[size]} bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md rounded-lg shadow-xl ${className}`}
                onClick={(e) => e.stopPropagation()}
              >
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    {title && (
                      <h2 className="text-xl font-bold text-white">{title}</h2>
                    )}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <X size={24} />
                      </button>
                    )}
                  </div>
                )}
                
                <div className="p-6">
                  {children}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}