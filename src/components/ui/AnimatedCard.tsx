import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedCard({ children, onClick, className = '', style }: AnimatedCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden bg-white/5 border border-white/10 ${className}`}
      style={style}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      {children}

      {/* Effet de surbrillance au survol */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-500/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Anneau lumineux */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg border border-blue-500/30"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered ? '0 0 15px 1px rgba(59, 130, 246, 0.3)' : 'none'
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
