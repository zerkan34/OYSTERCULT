import React from 'react';
import { motion } from 'framer-motion';
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-purple/20 to-brand-burgundy/20">
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          key="logo"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto px-4 mb-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <motion.div 
              animate={{ 
                rotate: 360 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: "linear" 
              }}
            >
              <Settings className="w-24 h-24 md:w-32 md:h-32 text-brand-burgundy mx-auto" />
            </motion.div>
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-full max-w-md"
        >
          <AuthForm />
        </motion.div>
      </div>
    </div>
  );
}