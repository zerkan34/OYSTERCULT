import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NewAuthLogo } from '../../../components/ui/NewAuthLogo';
import { User2, Lock } from 'lucide-react';
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

      <div className="relative min-h-screen flex flex-col items-center justify-center -mt-32">
        <motion.div
          className="w-full max-w-2xl flex flex-col items-center gap-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <NewAuthLogo size={400} />
          </motion.div>

          {/* Zone de contenu dynamique - position relative */}
          <div className="relative w-full flex justify-center">
            {/* Texte de bienvenue et bouton connexion */}
            <motion.div
              className="flex flex-col items-center space-y-8 w-[400px] absolute"
              initial={{ opacity: 1, y: 0 }}
              animate={showAuth ? 
                { opacity: 0, y: -20, transitionEnd: { display: 'none' }} : 
                { opacity: 1, y: 0, display: 'flex' }
              }
              transition={{ 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{ pointerEvents: showAuth ? 'none' : 'auto' }}
            >
              <motion.p 
                variants={itemVariants}
                className="text-2xl font-light text-white/90 text-center tracking-wide"
              >
                Bienvenue dans votre espace de gestion
              </motion.p>

              <motion.button
                variants={itemVariants}
                className="px-8 py-3 text-lg font-light tracking-wider text-white/90 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300"
                onClick={handleDemoAccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Connexion
              </motion.button>
            </motion.div>

            {/* Conteneur d'authentification */}
            <motion.div 
              className="w-[400px] absolute"
              initial={{ opacity: 0, y: 20 }}
              animate={showAuth ? 
                { opacity: 1, y: 0, display: 'block' } : 
                { opacity: 0, y: 20, transitionEnd: { display: 'none' } }
              }
              transition={{ 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.3 }
              }}
              style={{ pointerEvents: showAuth ? 'auto' : 'none' }}
            >
              <div className="relative group">
                {/* Effet de glow */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500/20 via-white/5 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500" />
                
                {/* Conteneur principal */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[rgba(15,23,42,0.2)] via-[rgba(20,80,100,0.15)] to-[rgba(20,100,100,0.2)] backdrop-filter backdrop-blur-[12px] p-8 rounded-xl border border-white/10 group-hover:border-cyan-500/20 transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_0_20px_rgba(0,150,255,0.05)]">
                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* En-tête avec effet de gradient */}
                    <div className="relative text-center mb-8">
                      <motion.div
                        className="text-2xl font-light tracking-wider text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        Pour les pros, par les pros.
                      </motion.div>
                    </div>

                    {/* Champs de formulaire */}
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                          <User2 
                            size={18} 
                            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                            color="white"
                            strokeWidth={2.5}
                          />
                        </div>
                        <input
                          type="email"
                          defaultValue="nicolasd34@gmail.com"
                          readOnly
                          className="w-full pl-10 pr-4 py-3 bg-[rgba(0,180,255,0.15)] rounded-lg outline-none text-white/90 backdrop-blur-md border-l-2 border-l-transparent group-hover:border-l-cyan-500/30 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_-1px_2px_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_-1px_2px_rgba(255,255,255,0.2),0_2px_3px_rgba(0,0,0,0.4)]"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                          <Lock 
                            size={18} 
                            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                            color="white"
                            strokeWidth={2.5}
                          />
                        </div>
                        <input
                          type="password"
                          readOnly
                          className="w-full pl-10 pr-4 py-3 bg-[rgba(0,180,255,0.15)] rounded-lg outline-none text-white/90 backdrop-blur-md border-l-2 border-l-transparent group-hover:border-l-cyan-500/30 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_-1px_2px_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_-1px_2px_rgba(255,255,255,0.2),0_2px_3px_rgba(0,0,0,0.4)]"
                          value="demo123"
                        />
                      </div>
                    </div>

                    {/* Bouton de connexion */}
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/20 via-cyan-400/20 to-cyan-500/20 hover:from-cyan-500/30 hover:via-cyan-400/30 hover:to-cyan-500/30 text-cyan-300 rounded-lg border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 font-light tracking-wide shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] transform hover:-translate-y-0.5"
                    >
                      Se connecter
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}