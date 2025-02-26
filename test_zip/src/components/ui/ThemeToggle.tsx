import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '@/lib/store';

export function ThemeToggle() {
  const { theme, toggleTheme } = useStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg transition-colors hover:bg-[rgb(var(--color-background-hover))]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'dark' ? 1 : 0,
          opacity: theme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon 
          className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors" 
          size={24} 
        />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: theme === 'light' ? 1 : 0,
          opacity: theme === 'light' ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun 
          className="text-[rgb(var(--color-brand-burgundy))] hover:text-[rgb(var(--color-brand-burgundy)_/_0.8)] transition-colors" 
          size={24} 
        />
      </motion.div>

      <div className="w-6 h-6" />
    </motion.button>
  );
}