import express from 'express';
import tablesRoutes from './tables.routes.js';
import inventoryRoutes from './inventory.routes.js';
import suppliersRoutes from './suppliers.routes.js';
import authRoutes from './auth.routes.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route de santé pour vérifier que l'API fonctionne
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API opérationnelle',
    timestamp: new Date()
  });
});

// Routes d'authentification (pas besoin d'authentification)
router.use('/auth', authRoutes);

// Routes protégées (nécessitent une authentification)
router.use('/tables', authenticate, tablesRoutes);
router.use('/inventory', authenticate, inventoryRoutes);
router.use('/suppliers', authenticate, suppliersRoutes);

export default router;
