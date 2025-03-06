import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, role = 'user' } = req.body;
    
    // Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role
        }
      }
    });
    
    if (authError) throw authError;
    
    // Créer un profil utilisateur dans la table profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        role
      })
      .select()
      .single();
      
    if (profileError) {
      // Si la création du profil échoue, on log l'erreur mais on continue
      logger.error(`Erreur lors de la création du profil: ${profileError.message}`);
    }

    res.status(201).json({
      success: true,
      message: 'Inscription réussie, vérifiez votre email pour confirmer votre compte',
      data: {
        user: authData.user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Déconnexion d'un utilisateur
 */
export const logout = async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer l'utilisateur actuellement connecté
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    // Vérifier si un utilisateur est connecté
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }
    
    // Récupérer les informations supplémentaires du profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 est l'erreur "aucune ligne trouvée", qu'on peut ignorer ici
      logger.error(`Erreur lors de la récupération du profil: ${profileError.message}`);
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile: profile || {}
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour le profil utilisateur
 */
export const updateProfile = async (req, res, next) => {
  try {
    // Vérifier si un utilisateur est connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }
    
    const updates = req.body;
    
    // Mettre à jour le profil dans la table profiles
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;

    // Mettre à jour les métadonnées de l'utilisateur dans Auth
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        full_name: updates.full_name,
        avatar_url: updates.avatar_url
      }
    });
    
    if (metadataError) {
      logger.error(`Erreur lors de la mise à jour des métadonnées: ${metadataError.message}`);
    }

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Réinitialiser le mot de passe
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`
    });
    
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Si cette adresse email est associée à un compte, vous recevrez un email pour réinitialiser votre mot de passe'
    });
  } catch (error) {
    // Ne pas révéler si l'email existe ou non
    res.status(200).json({
      success: true,
      message: 'Si cette adresse email est associée à un compte, vous recevrez un email pour réinitialiser votre mot de passe'
    });
  }
};

/**
 * Mettre à jour le mot de passe
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    const { error } = await supabase.auth.updateUser({
      password
    });
    
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    next(error);
  }
};
