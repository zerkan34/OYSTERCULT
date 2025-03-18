import React from 'react';
import { motion } from 'framer-motion';
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
    <div style={{ 
      background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
      backdropFilter: "blur(20px)",
      minHeight: "100vh"
    }}>
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          key="logo"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-5xl mx-auto px-4 mb-8"
          style={{
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: 1000,
            WebkitFontSmoothing: 'antialiased'
          }}
        >
          <motion.div variants={itemVariants} className="text-center">
            <motion.div className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <motion.h1 
                  variants={itemVariants}
                  className="flex flex-col items-center text-white whitespace-nowrap"
                >
                  <div className="flex flex-col items-center">
                    <span 
                      className="text-[9.5rem] md:text-[11.5rem]"
                      style={{ 
                        fontFamily: "'TT Modernoir', sans-serif",
                        fontWeight: 400,
                        letterSpacing: '0.2em',
                        display: 'block',
                        lineHeight: '0.8',
                        transform: 'translate3d(0, 0, 0)',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      O
                      Y
                      S
                      T
                      E
                      R
                    </span>
                  </div>
                  <div 
                    className="flex items-center justify-center" 
                    style={{ 
                      transform: 'translate3d(0, -2.75rem, 0)',
                      willChange: 'transform',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="flex items-center" style={{ transform: 'translate3d(20rem, 0, 0)', willChange: 'transform', backfaceVisibility: 'hidden' }}>
                      <div className="flex flex-col items-center text-white">
                        <svg 
                          width="180" 
                          height="1" 
                          viewBox="0 0 100 1" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            transform: 'translate3d(-8%, 0, 0)',
                            willChange: 'transform',
                            backfaceVisibility: 'hidden',
                            opacity: 0.6
                          }}
                        >
                          <g>
                            <path d="M5 0.5 Q20 0, 30 0.5 T55 0.5 T80 0.5 T105 0.5 T130 0.5" stroke="white" strokeWidth={0.03} strokeLinecap="round" fill="none" />
                          </g>
                        </svg>
                      </div>
                      <span 
                        className="text-[9.5rem] md:text-[11.5rem] text-white"
                        style={{ 
                          fontFamily: "'TT Modernoir', sans-serif",
                          fontWeight: 400,
                          letterSpacing: '0.2em',
                          lineHeight: 0.8,
                          display: 'block',
                          transform: 'translate3d(0, 0, 0)',
                          willChange: 'transform',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        C
                        U
                        L
                        T
                      </span>
                    </div>
                  </div>
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-white text-xl md:text-2xl mt-8 tracking-wide font-light"
                >
                  Pour les pros, par les pros.
                </motion.p>
              </div>
            </motion.div>
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