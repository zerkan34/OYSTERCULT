import React from 'react';
import { motion } from 'framer-motion';
import { Table } from './types';

interface AnimatedTableProps {
  table: Table;
  onClick: () => void;
  style: React.CSSProperties;
}

export function AnimatedTable({ table, onClick, style }: AnimatedTableProps) {
  const cellVariants = {
    initial: { opacity: 0.6, scale: 0.95 },
    animate: (custom: number) => ({
      opacity: [0.6, 1, 0.6],
      scale: [0.95, 1, 0.95],
      transition: {
        duration: 3,
        repeat: Infinity,
        delay: custom * 0.1,
        ease: "easeInOut"
      }
    })
  };

  const filledCellVariants = {
    initial: { opacity: 0.8, scale: 0.95 },
    animate: (custom: number) => ({
      opacity: [0.8, 1, 0.8],
      scale: [0.95, 1.05, 0.95],
      transition: {
        duration: 4,
        repeat: Infinity,
        delay: custom * 0.2,
        ease: "easeInOut"
      }
    })
  };

  return (
    <motion.div
      className="absolute cursor-pointer overflow-hidden"
      style={style}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 glass-effect px-3 py-1 rounded-full">
        <span className="text-white text-sm font-medium">{table.tableNumber}</span>
      </div>

      <div className={`relative h-full rounded-lg border ${
        table.status === 'optimal' ? 'border-green-500/30 bg-green-500/10' :
        table.status === 'warning' ? 'border-yellow-500/30 bg-yellow-500/10' :
        'border-red-500/30 bg-red-500/10'
      }`}>
        <div className="grid grid-cols-4 gap-1 p-2">
          {table.cells.map((cell, index) => (
            <motion.div
              key={cell.id}
              className={`aspect-square rounded-sm ${
                cell.filled
                  ? cell.type === 'triplo'
                    ? 'bg-brand-burgundy shadow-neon'
                    : cell.type === 'diplo'
                    ? 'bg-brand-primary shadow-neon'
                    : 'bg-brand-tertiary shadow-neon'
                  : 'bg-white/10'
              }`}
              variants={cell.filled ? filledCellVariants : cellVariants}
              initial="initial"
              animate="animate"
              custom={index}
            />
          ))}
        </div>
      </div>

      {/* Effet de surbrillance au survol */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/5 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Anneau lumineux */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ 
          opacity: 1,
          boxShadow: '0 0 0 2px rgb(var(--color-brand-burgundy) / 0.3)'
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
