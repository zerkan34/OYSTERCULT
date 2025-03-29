import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './auth.css';

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
  const [showAuth, setShowAuth] = useState(false);

  const handleDemoAccess = () => {
    setShowAuth(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="auth-background">
      {/* Barre de chargement */}
      <div className="wave-loading" />

      {/* Conteneur des vagues */}
      <div className="wave-container">
        <div className="wave" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          key="logo"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-5xl mx-auto px-4 mb-8"
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
                        lineHeight: '0.8'
                      }}
                    >
                      OYSTER
                    </span>
                  </div>
                  <span 
                    className="text-[3rem] md:text-[4rem] mt-4"
                    style={{ 
                      fontFamily: "'TT Modernoir', sans-serif",
                      fontWeight: 300,
                      letterSpacing: '0.2em'
                    }}
                  >
                    CULT
                  </span>
                </motion.h1>
              </div>
            </motion.div>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="mt-8 text-xl text-white/80 max-w-2xl mx-auto"
          >
            Bienvenue dans votre espace de gestion
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.button
            variants={itemVariants}
            onClick={handleDemoAccess}
            className={`w-full px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm ${showAuth ? 'scale-0 h-0 opacity-0 mt-0 mb-0' : ''}`}
          >
            Connexion
          </motion.button>

          {/* Conteneur d'authentification */}
          <div className={`auth-form-container ${showAuth ? 'visible' : ''}`}>
            <div className="auth-form bg-white/10 backdrop-blur-sm">
              <form onSubmit={handleLogin} className="space-y-6">
                <h2 className="text-2xl font-light text-white mb-6 text-center tracking-wide">
                  Pour les pros, par les pros.
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="auth-input bg-white/5"
                      defaultValue="demo@oystercult.com"
                      readOnly
                      aria-label="Email de démonstration"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      className="auth-input bg-white/5"
                      defaultValue="demo123"
                      readOnly
                      aria-label="Mot de passe de démonstration"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm"
                >
                  Se connecter
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}