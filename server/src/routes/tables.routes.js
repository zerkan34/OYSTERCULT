import express from 'express';
import { body, param, query } from 'express-validator';
import * as tablesController from '../controllers/tables.controller.js';
import { validateRequest } from '../middleware/validator.js';

const router = express.Router();

// Récupérer toutes les tables
router.get('/', tablesController.getAllTables);

// Récupérer les tables par type (triploid/diploid)
router.get('/by-type/:type', 
  param('type').isIn(['triploid', 'diploid']).withMessage('Le type doit être triploid ou diploid'),
  validateRequest,
  tablesController.getTablesByType
);

// Récupérer une table spécifique
router.get('/:id', 
  param('id').isUUID().withMessage('ID de table invalide'),
  validateRequest,
  tablesController.getTableById
);

// Récupérer les cellules d'une table
router.get('/:id/cells', 
  param('id').isUUID().withMessage('ID de table invalide'),
  validateRequest,
  tablesController.getTableCells
);

// Créer une nouvelle table
router.post('/',
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('type').isIn(['triploid', 'diploid']).withMessage('Le type doit être triploid ou diploid'),
  body('position').isObject().withMessage('La position doit être un objet'),
  body('rows').isInt({ min: 1 }).withMessage('Le nombre de lignes doit être un entier positif'),
  body('columns').isInt({ min: 1 }).withMessage('Le nombre de colonnes doit être un entier positif'),
  validateRequest,
  tablesController.createTable
);

// Mettre à jour une table
router.put('/:id',
  param('id').isUUID().withMessage('ID de table invalide'),
  body('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  validateRequest,
  tablesController.updateTable
);

// Supprimer une table
router.delete('/:id',
  param('id').isUUID().withMessage('ID de table invalide'),
  validateRequest,
  tablesController.deleteTable
);

// Remplir une table (ajouter des huîtres dans les cellules)
router.post('/:id/fill',
  param('id').isUUID().withMessage('ID de table invalide'),
  body('quantity').isInt({ min: 1 }).withMessage('La quantité doit être un entier positif'),
  body('standardFill').optional().isBoolean().withMessage('standardFill doit être un booléen'),
  validateRequest,
  tablesController.fillTable
);

// Vider une table (retirer des huîtres des cellules)
router.post('/:id/empty',
  param('id').isUUID().withMessage('ID de table invalide'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('La quantité doit être un entier positif'),
  body('cellIds').optional().isArray().withMessage('cellIds doit être un tableau'),
  body('emptyAll').optional().isBoolean().withMessage('emptyAll doit être un booléen'),
  validateRequest,
  tablesController.emptyTable
);

// Mettre à jour le statut d'une cellule spécifique
router.patch('/:tableId/cells/:cellId',
  param('tableId').isUUID().withMessage('ID de table invalide'),
  param('cellId').isUUID().withMessage('ID de cellule invalide'),
  body('status').isIn(['empty', 'filled', 'harvested', 'maintenance']).withMessage('Statut invalide'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('La quantité doit être un entier positif ou zéro'),
  validateRequest,
  tablesController.updateCellStatus
);

// Obtenir des statistiques sur la table
router.get('/:id/stats',
  param('id').isUUID().withMessage('ID de table invalide'),
  validateRequest,
  tablesController.getTableStats
);

// Ajouter une cellule à une table
router.post('/:id/cells',
  param('id').isUUID().withMessage('ID de table invalide'),
  body('status').isIn(['empty', 'filled', 'harvested', 'maintenance']).withMessage('Statut invalide'),
  validateRequest,
  tablesController.addCellToTable
);

// Réorganiser les cellules (en respectant les règles de numérotation)
router.post('/reorganize-cells',
  tablesController.reorganizeCells
);

export default router;
