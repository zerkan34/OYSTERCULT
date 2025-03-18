import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();
const dashboardController = new DashboardController();

// Route pour obtenir toutes les tables
router.get('/tables', dashboardController.getAllTables);

// Route pour obtenir les détails d'une table spécifique
router.get('/tables/:tableId', dashboardController.getTableById);

// Route pour obtenir les statistiques globales pour le dashboard
router.get('/stats', dashboardController.getDashboardStats);

export default router;
