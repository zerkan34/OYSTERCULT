import React, { useState, useEffect } from 'react';
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Surveiller la largeur de la fenêtre pour les ajustements responsifs
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDemoAccess = () => {
    setShowAuth(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  // Ajuster la taille du logo en fonction de la taille de l'écran
  const logoSize = windowWidth < 480 ? 180 : windowWidth < 768 ? 250 : 350;

  return (
    <div className="auth-page">
      {/* Barre de chargement */}
      <div className="wave-loading" />

      {/* Conteneur des vagues */}
      <div className="wave-container">
        <div className="wave" />
      </div>

      <div className="auth-content-wrapper">
        <motion.div
          className="auth-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="auth-logo-container">
            <NewAuthLogo size={logoSize} />
          </motion.div>

          {/* Zone de contenu dynamique */}
          <div className="auth-form-area">
            {/* Texte de bienvenue et bouton connexion */}
            <motion.div
              className="auth-welcome"
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
                className="auth-welcome-text"
              >
                Bienvenue dans votre espace de gestion
              </motion.p>

              <motion.button
                variants={itemVariants}
                className="auth-button"
                onClick={handleDemoAccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Connexion
              </motion.button>
            </motion.div>

            {/* Conteneur d'authentification */}
            <motion.div 
              className="auth-form-container"
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
              <div className="auth-form-wrapper group">
                {/* Effet de glow */}
                <div className="auth-form-glow" />
                
                {/* Conteneur principal */}
                <div className="auth-form">
                  <form onSubmit={handleLogin} className="auth-form-inner">
                    {/* En-tête avec effet de gradient */}
                    <div className="auth-form-header">
                      <motion.div
                        className="auth-form-title"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        Pour les pros, par les pros.
                      </motion.div>
                    </div>

                    {/* Champs de formulaire */}
                    <div className="auth-form-fields">
                      <div className="auth-input-group group">
                        <div className="auth-input-highlight" />
                        <div className="auth-input-icon">
                          <User2 
                            size={18} 
                            className="text-white"
                            color="white"
                            strokeWidth={2}
                          />
                        </div>
                        <input
                          type="email"
                          defaultValue="nicolasd34@gmail.com"
                          readOnly
                          className="auth-input"
                        />
                      </div>
                      <div className="auth-input-group group">
                        <div className="auth-input-highlight" />
                        <div className="auth-input-icon">
                          <Lock 
                            size={18} 
                            className="text-white"
                            color="white"
                            strokeWidth={2}
                          />
                        </div>
                        <input
                          type="password"
                          readOnly
                          className="auth-input"
                          value="demo123"
                        />
                      </div>
                    </div>

                    {/* Bouton de connexion */}
                    <button
                      type="submit"
                      className="auth-submit-button"
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