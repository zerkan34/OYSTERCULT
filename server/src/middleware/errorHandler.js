import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Log l'erreur
  logger.error(`${err.name}: ${err.message}`, { 
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Déterminer le statut de l'erreur
  const statusCode = err.statusCode || 500;
  
  // Renvoyer une réponse appropriée
  res.status(statusCode).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Une erreur est survenue sur le serveur'
        : err.message,
      code: err.code || 'SERVER_ERROR'
    }
  });
};
