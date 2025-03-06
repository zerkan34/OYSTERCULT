import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validator.js';

const router = express.Router();

// Inscription
router.post('/register',
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('full_name').notEmpty().withMessage('Le nom complet est requis'),
  validateRequest,
  authController.register
);

// Connexion
router.post('/login',
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
  validateRequest,
  authController.login
);

// Déconnexion
router.post('/logout', authController.logout);

// Récupérer l'utilisateur actuel
router.get('/me', authController.getCurrentUser);

// Mise à jour du profil
router.put('/profile',
  body('full_name').optional().notEmpty().withMessage('Le nom complet ne peut pas être vide'),
  body('avatar_url').optional(),
  validateRequest,
  authController.updateProfile
);

// Réinitialisation du mot de passe
router.post('/reset-password',
  body('email').isEmail().withMessage('Email invalide'),
  validateRequest,
  authController.resetPassword
);

// Mettre à jour le mot de passe
router.post('/update-password',
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  validateRequest,
  authController.updatePassword
);

export default router;
