import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ModernSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function ModernSearch({ value, onChange, placeholder = "Rechercher...", onClear }: ModernSearchProps) {
  return (
    <div className="relative">
      <SearchIcon 
        size={20} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="modern-input pl-10 pr-10 w-full"
      />
      {value && onClear && (
        <motion.button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={16} className="text-white/40" />
        </motion.button>
      )}
    </div>
  );
}