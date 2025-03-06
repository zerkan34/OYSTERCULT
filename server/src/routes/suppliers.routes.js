import express from 'express';
import { body, param, query } from 'express-validator';
import * as suppliersController from '../controllers/suppliers.controller.js';
import { validateRequest } from '../middleware/validator.js';

const router = express.Router();

// Récupérer tous les fournisseurs
router.get('/', suppliersController.getAllSuppliers);

// Récupérer les fournisseurs "amis"
router.get('/friends', suppliersController.getFriendSuppliers);

// Récupérer un fournisseur spécifique
router.get('/:id',
  param('id').isUUID().withMessage('ID de fournisseur invalide'),
  validateRequest,
  suppliersController.getSupplierById
);

// Créer un nouveau fournisseur
router.post('/',
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('friend_code').optional().isString().withMessage('Code ami invalide'),
  validateRequest,
  suppliersController.createSupplier
);

// Mettre à jour un fournisseur
router.put('/:id',
  param('id').isUUID().withMessage('ID de fournisseur invalide'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  validateRequest,
  suppliersController.updateSupplier
);

// Supprimer un fournisseur
router.delete('/:id',
  param('id').isUUID().withMessage('ID de fournisseur invalide'),
  validateRequest,
  suppliersController.deleteSupplier
);

// Récupérer les produits d'un fournisseur
router.get('/:id/products',
  param('id').isUUID().withMessage('ID de fournisseur invalide'),
  validateRequest,
  suppliersController.getSupplierProducts
);

// Ajouter un produit à un fournisseur
router.post('/:id/products',
  param('id').isUUID().withMessage('ID de fournisseur invalide'),
  body('name').notEmpty().withMessage('Le nom du produit est requis'),
  body('price').isNumeric().withMessage('Le prix doit être un nombre'),
  body('unit').notEmpty().withMessage('L\'unité est requise'),
  validateRequest,
  suppliersController.addSupplierProduct
);

// Créer une commande fournisseur
router.post('/:id/orders',
  param('id').isUUID().withMessage('ID de fournisseur invalide'),
  body('products').isArray().withMessage('Les produits doivent être un tableau'),
  body('total_amount').isNumeric().withMessage('Le montant total doit être un nombre'),
  validateRequest,
  suppliersController.createSupplierOrder
);

// Récupérer les commandes d'un fournisseur
router.get('/:id/orders',
  param('id').isUUID().withMessage('ID de fournisseur invalide'),
  validateRequest,
  suppliersController.getSupplierOrders
);

export default router;
