import express from 'express';
import { body, param, query } from 'express-validator';
import * as inventoryController from '../controllers/inventory.controller.js';
import { validateRequest } from '../middleware/validator.js';

const router = express.Router();

// Récupérer tout l'inventaire
router.get('/', inventoryController.getAllInventory);

// Récupérer l'inventaire par type (triploid/diploid)
router.get('/by-type/:type', 
  param('type').isIn(['triploid', 'diploid']).withMessage('Le type doit être triploid ou diploid'),
  validateRequest,
  inventoryController.getInventoryByType
);

// Récupérer un élément d'inventaire spécifique
router.get('/:id',
  param('id').isUUID().withMessage('ID d\'inventaire invalide'),
  validateRequest,
  inventoryController.getInventoryById
);

// Ajouter un élément à l'inventaire
router.post('/',
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('type').isIn(['triploid', 'diploid']).withMessage('Le type doit être triploid ou diploid'),
  body('quantity').isInt({ min: 0 }).withMessage('La quantité doit être un entier positif'),
  validateRequest,
  inventoryController.addInventoryItem
);

// Mettre à jour un élément d'inventaire
router.put('/:id',
  param('id').isUUID().withMessage('ID d\'inventaire invalide'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('La quantité doit être un entier positif'),
  validateRequest,
  inventoryController.updateInventoryItem
);

// Supprimer un élément d'inventaire
router.delete('/:id',
  param('id').isUUID().withMessage('ID d\'inventaire invalide'),
  validateRequest,
  inventoryController.deleteInventoryItem
);

// Récupérer les statistiques d'inventaire
router.get('/stats/overview', inventoryController.getInventoryStats);

// Effectuer un transfert entre tables
router.post('/transfer',
  body('sourceTableId').isUUID().withMessage('ID de table source invalide'),
  body('destinationTableId').isUUID().withMessage('ID de table destination invalide'),
  body('quantity').isInt({ min: 1 }).withMessage('La quantité doit être un entier positif'),
  validateRequest,
  inventoryController.transferInventory
);

export default router;
