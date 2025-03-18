/**
 * Configuration du serveur et des environnements
 */
export default {
  // Port du serveur
  port: process.env.PORT || 5000,
  
  // Environnement (development, production, test)
  env: process.env.NODE_ENV || 'development',
  
  // Préfixe des routes API
  apiPrefix: '/api',
  
  // Configuration CORS pour le frontend
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
