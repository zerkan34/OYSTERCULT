import { Router } from 'express';
import dashboardRoutes from './dashboard.routes';
import taskRoutes from './task.routes';
import inventoryRoutes from './inventory.routes';

const router = Router();

// Route racine pour vérifier que l'API est opérationnelle
router.get('/', (req, res) => {
  res.json({ message: "API OYSTER CULT opérationnelle" });
});

// Enregistrement des routes du dashboard
router.use('/dashboard', dashboardRoutes);

// Enregistrement des routes des tâches
router.use('/tasks', taskRoutes);

// Enregistrement des routes d'inventaire
router.use('/inventory', inventoryRoutes);

export default router;
