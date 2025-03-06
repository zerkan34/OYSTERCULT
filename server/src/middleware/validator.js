import { validationResult } from 'express-validator';

/**
 * Middleware qui valide les requêtes en utilisant express-validator
 * Renvoie une erreur 400 avec les erreurs de validation si la validation échoue
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};
