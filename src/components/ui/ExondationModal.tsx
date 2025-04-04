import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ExondationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastExondationTime: Date;
  nextNotificationTime: Date;
}

const modalVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { 
    opacity: 0,
    x: 100,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

export const ExondationModal: React.FC<ExondationModalProps> = ({
  isOpen,
  onClose,
  lastExondationTime,
  nextNotificationTime,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50" onClick={onClose}>
        <motion.div
          className="absolute top-20 right-4 w-80 bg-gradient-to-br from-[rgba(15,23,42,0.9)] to-[rgba(20,100,100,0.9)] backdrop-blur-md rounded-lg p-6 shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Table Exondée</h2>
              <p className="text-sm text-white/70">Table Nord 128</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white/70" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/70">Dernière exondation</p>
              <p className="text-white font-medium">
                {lastExondationTime.toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70">Prochaine notification</p>
              <p className="text-white font-medium">
                {nextNotificationTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
