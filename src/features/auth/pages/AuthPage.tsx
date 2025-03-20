import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleDemoAccess = () => {
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

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
                      className="text-[10rem] md:text-[12rem]"
                      style={{ 
                        fontFamily: "'TT Modernoir', sans-serif",
                        fontWeight: 300,
                        letterSpacing: '0.08em',
                        display: 'block',
                        lineHeight: '0.8',
                        transform: 'translate3d(0, -4rem, 0)',
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
                    <div className="flex items-center" style={{ transform: 'translate3d(2.9rem, 0, 0)', willChange: 'transform', backfaceVisibility: 'hidden' }}>
                      <div className="flex flex-col items-center text-white relative">
                        <div className="absolute" style={{ top: '-6rem', left: '-6rem', width: '12rem', height: '12rem' }}>
                          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 20 Q25 14, 35 20 T55 20 T75 20 T95 20" stroke="white" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
                            <path d="M15 40 Q25 34, 35 40 T55 40 T75 40 T95 40" stroke="white" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
                            <path d="M15 60 Q25 54, 35 60 T55 60 T75 60 T95 60" stroke="white" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
                            <path d="M15 80 Q25 74, 35 80 T55 80 T75 80 T95 80" stroke="white" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
                          </svg>
                        </div>
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
                        className="text-[10.5rem] md:text-[12.5rem] text-white"
                        style={{ 
                          fontFamily: "'TT Modernoir', sans-serif",
                          fontWeight: 400,
                          letterSpacing: '0.1em',
                          lineHeight: '0.8',
                          display: 'block',
                          transform: 'translate3d(-1.7rem, 0rem, -30cm)',
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
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-full max-w-md mt-12"
        >
          <div className="w-full max-w-md p-8 rounded-2xl bg-gray-800/50 backdrop-blur-xl border border-gray-700">
            <h2 className="text-2xl font-light text-white mb-6 text-center tracking-wide">Pour les pros, par les pros.</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600"
                  readOnly
                  value="demo@oystercult.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600"
                  readOnly
                  value="demo123"
                />
              </div>
              <button 
                onClick={handleDemoAccess}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center font-medium transition-colors"
              >
                Accéder à la démo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}