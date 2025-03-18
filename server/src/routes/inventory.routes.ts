import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';

const router = Router();
const inventoryController = new InventoryController();

// Routes pour les emplacements de stockage
router.get('/storage-locations', inventoryController.getAllStorageLocations);
router.get('/storage-locations/:id', inventoryController.getStorageLocationById);
router.post('/storage-locations', inventoryController.createStorageLocation);
router.put('/storage-locations/:id', inventoryController.updateStorageLocation);
router.delete('/storage-locations/:id', inventoryController.deleteStorageLocation);

// Routes pour les produits
router.get('/products', inventoryController.getAllProducts);
router.get('/products/:id', inventoryController.getProductById);
router.post('/products', inventoryController.createProduct);
router.put('/products/:id', inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);

// Routes pour les stocks
router.get('/stocks', inventoryController.getAllStocks);
router.get('/stocks/:id', inventoryController.getStockById);
router.get('/stocks/location/:locationId', inventoryController.getStocksByLocation);
router.get('/stocks/product/:productId', inventoryController.getStocksByProduct);
router.post('/stocks', inventoryController.addStock);
router.put('/stocks/:id', inventoryController.updateStock);
router.delete('/stocks/:id', inventoryController.removeStock);
router.post('/stocks/:stockId/transfer', inventoryController.transferStock);

// Routes pour les mouvements de stock
router.get('/stock-movements', inventoryController.getAllStockMovements);
router.get('/stock-movements/filter', inventoryController.getFilteredStockMovements);

// Routes pour les statistiques d'inventaire
router.get('/stats', inventoryController.getInventoryStats);

export default router;
