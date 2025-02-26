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
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-purple/20 to-brand-burgundy/20">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <AnimatePresence>
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