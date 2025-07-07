import React from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';

interface AdBannerProps {
  isCollapsed?: boolean;
}

const adTexts = [
  { type: 'text', content: 'ESPACE PUBLICITAIRE' },
  { type: 'text', content: 'VOTRE PUB ICI' },
  { type: 'text', content: 'CONTACTEZ-NOUS' },
  { type: 'text', content: 'RÉSERVEZ CET ESPACE' },
  { type: 'logo', content: 'OYSTER CULT' }
];

export function AdBanner({ isCollapsed = false }: AdBannerProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const controls = useAnimationControls();
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % adTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
      onHoverStart={() => {
        setIsHovered(true);
        controls.start({
          scale: [1, 1.02, 1],
          transition: { duration: 0.4, ease: 'easeInOut' }
        });
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        controls.start({ scale: 1 });
      }}
      animate={controls}
      whileHover={{ 
        y: -4,
        boxShadow: '0 8px 32px rgba(0,200,200,0.15)',
        transition: { duration: 0.2 }
      }}
    >
      {/* Effet de surbrillance au survol */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(0,128,128,0.05)] via-[rgba(0,200,200,0.08)] to-transparent pointer-events-none"
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          x: isHovered ? '100%' : '-100%'
        }}
        transition={{ 
          duration: 1.2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 0.5
        }}
      />
      {/* Effet de bordure animée */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.1), transparent)',
          maskImage: 'linear-gradient(to right, transparent 25%, black 50%, transparent 75%)'
        }}
        animate={{
          x: ['100%', '-100%']
        }}
        transition={{
          duration: 3,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 1
        }}
      />
      
      {/* Contenu */}
      <div className="relative flex flex-col justify-center h-full p-6">
        {!isCollapsed ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTextIndex}
              className="text-center relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {adTexts[currentTextIndex].type === 'text' ? (
                <motion.h3 
                  className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent font-medium text-xl tracking-wide"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  style={{ backgroundSize: '200% 100%' }}
                >
                  {adTexts[currentTextIndex].content}
                </motion.h3>
              ) : (
                <motion.div
                  className="flex flex-col items-center gap-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      filter: [
                        'brightness(1) drop-shadow(0 0 0 rgba(0,255,255,0))',
                        'brightness(1.2) drop-shadow(0 0 8px rgba(0,255,255,0.3))',
                        'brightness(1) drop-shadow(0 0 0 rgba(0,255,255,0))'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="64" 
                      height="64" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-cyan-400"
                      style={{ opacity: 0.9, transform: 'translateY(2px)' }}
                    >
                      <path d="M2 4c.6.5 1.2 1 2.5 1C7 5 7 3 9.5 3c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                      <path d="M2 9c.6.5 1.2 1 2.5 1C7 10 7 8 9.5 8c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" style={{ stroke: 'white' }} />
                      <path d="M2 14c.6.5 1.2 1 2.5 1C7 15 7 13 9.5 13c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                      <path d="M2 19c.6.5 1.2 1 2.5 1C7 20 7 18 9.5 18c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                    </svg>
                  </motion.div>
                  <motion.h3 
                    className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    style={{ 
                      backgroundSize: '200% 100%',
                      fontFamily: "'TT Modernoir', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.08em",
                      lineHeight: "0.8",
                      fontSize: "1.5rem",
                      transform: "translate3d(0, 0, 0)",
                      willChange: "transform"
                    }}
                  >
                    {adTexts[currentTextIndex].content}
                  </motion.h3>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex items-center justify-center">
            <motion.div
              className="text-cyan-400/80 font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [0.95, 1.05, 0.95],
                filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
              }}
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
