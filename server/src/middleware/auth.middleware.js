import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 */
export const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé, jeton d\'authentification manquant'
      });
    }
    
    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé, jeton d\'authentification invalide'
      });
    }
    
    // Ajouter l'utilisateur à la requête
    req.user = user;
    
    next();
  } catch (error) {
    logger.error(`Erreur d'authentification: ${error.message}`);
    
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé'
    });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur a un rôle spécifique
 */
export const authorize = (roles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Accès non autorisé, utilisateur non authentifié'
        });
      }
      
      // Récupérer le profil de l'utilisateur
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();
        
      if (error) throw error;
      
      // Vérifier si l'utilisateur a le rôle requis
      if (!profile || !roles.includes(profile.role)) {
        return res.status(403).json({
          success: false,
          message: 'Accès interdit, vous n\'avez pas les permissions nécessaires'
        });
      }
      
      next();
    } catch (error) {
      logger.error(`Erreur d'autorisation: ${error.message}`);
      
      return res.status(403).json({
        success: false,
        message: 'Accès interdit'
      });
    }
  };
};
