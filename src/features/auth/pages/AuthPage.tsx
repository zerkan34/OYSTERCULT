import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { AuthForm } from '../components/AuthForm';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export function AuthPage() {
  const [showLogo, setShowLogo] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
      setShowForm(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-purple/20 to-brand-burgundy/20" />
      
      {/* Effet de grain */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="512" height="512" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")'
      }} />

      {/* Cercles décoratifs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-burgundy/30 rounded-full filter blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-purple/30 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {showLogo && (
            <motion.div
              key="logo"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              className="text-center max-w-4xl mx-auto px-4"
            >
              <motion.div variants={itemVariants} className="text-center">
                <Settings className="w-24 h-24 md:w-32 md:h-32 text-brand-burgundy animate-spin-slow mx-auto" />
                <motion.h1 
                  variants={itemVariants}
                  className="text-3xl md:text-4xl font-industry text-white mt-4 animate-pulse"
                >
                  OYSTER CULT
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-lg md:text-xl text-white/60 mt-4"
                >
                  Des données claires pour des coquillages d'exception
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full animate-fade-in"
            >
              <AuthForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}