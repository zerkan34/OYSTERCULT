import React from 'react';
import { motion } from 'framer-motion';

export const IntroAnimation = () => {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="relative">
        {/* Cercle extérieur avec glow */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,209,255,0.2) 0%, rgba(0,209,255,0) 70%)',
            filter: 'blur(20px)'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Logo principal */}
        <motion.div
          className="relative flex items-center justify-center w-32 h-32"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D1FF] to-[#0047FF] rounded-full opacity-20 blur-xl" />
          <div className="relative bg-gradient-to-r from-[#00D1FF] to-[#0047FF] rounded-full p-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-full h-full text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Texte */}
        <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00D1FF] to-[#0047FF] bg-clip-text text-transparent mb-2">
            OYSTER CULT
          </h1>
          <p className="text-white/60">
            Traçabilité et gestion d'entreprise
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
