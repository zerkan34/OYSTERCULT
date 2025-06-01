import React from 'react';
import { motion } from 'framer-motion';

interface AdBannerProps {
  isCollapsed?: boolean;
}

export function AdBanner({ isCollapsed = false }: AdBannerProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div 
      className={`
        mx-2 my-4 rounded-xl overflow-hidden relative group
        ${isCollapsed ? 'h-24' : 'h-[120px]'}
        bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)]
        backdrop-blur-[20px]
        shadow-[rgba(0,0,0,0.2)_0px_5px_20px_-5px,rgba(0,200,200,0.1)_0px_5px_12px_-5px,rgba(255,255,255,0.07)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.05)_0px_0px_12px_inset,rgba(0,0,0,0.1)_0px_0px_8px_inset]
        transition-all duration-200
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      {/* Effet de surbrillance au survol */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(0,128,128,0.05)] to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Contenu */}
      <div className="relative flex flex-col justify-center h-full p-6">
        {!isCollapsed ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h3 className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent font-medium text-xl tracking-wide">
              ESPACE PUBLICITAIRE
            </h3>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center">
            <motion.div
              className="text-cyan-400/80 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              AD
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
