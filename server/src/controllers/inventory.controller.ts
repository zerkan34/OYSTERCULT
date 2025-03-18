import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';
import { 
  StorageLocation, 
  Product, 
  Stock,
  UnitType,
  ProductCategory,
  StorageType
} from '../models/inventory.model';

/**
 * Contrôleur pour la gestion de l'inventaire
 */
export class InventoryController {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
  }

  /**
   * Récupère tous les emplacements de stockage
   */
  public getAllStorageLocations = (req: Request, res: Response): void => {
    try {
      const locations = this.inventoryService.getAllStorageLocations();
      res.status(200).json({
        success: true,
        data: locations
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des emplacements de stockage',
        error: error.message
      });
    }
  };

  /**
   * Récupère un emplacement de stockage par son ID
   */
  public getStorageLocationById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const location = this.inventoryService.getStorageLocationById(id);

      if (!location) {
        res.status(404).json({
          success: false,
          message: `Emplacement de stockage avec l'ID ${id} non trouvé`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: location
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'emplacement de stockage',
        error: error.message
      });
    }
  };

  /**
   * Crée un nouvel emplacement de stockage
   */
  public createStorageLocation = (req: Request, res: Response): void => {
    try {
      const locationData = req.body;

      // Validation basique
      if (!locationData.name || !locationData.type || locationData.capacity === undefined) {
        res.status(400).json({
          success: false,
          message: 'Données invalides. Nom, type et capacité sont requis.'
        });
        return;
      }

      // Vérifier si le type est valide
      if (!Object.values(StorageType).includes(locationData.type)) {
        res.status(400).json({
          success: false,
          message: 'Type de stockage invalide'
        });
        return;
      }

      const newLocation = this.inventoryService.createStorageLocation({
        name: locationData.name,
        type: locationData.type,
        capacity: locationData.capacity,
        currentCapacity: locationData.currentCapacity || 0,
        temperature: locationData.temperature,
        idealMinTemp: locationData.idealMinTemp,
        idealMaxTemp: locationData.idealMaxTemp
      });

      res.status(201).json({
        success: true,
        data: newLocation,
        message: 'Emplacement de stockage créé avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'emplacement de stockage',
        error: error.message
      });
    }
  };

  /**
   * Met à jour un emplacement de stockage
   */
  public updateStorageLocation = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const locationData = req.body;

      // Vérifier si l'emplacement existe
      const existingLocation = this.inventoryService.getStorageLocationById(id);
      if (!existingLocation) {
        res.status(404).json({
          success: false,
          message: `Emplacement de stockage avec l'ID ${id} non trouvé`
        });
        return;
      }

      // Vérifier si le type est valide s'il est fourni
      if (locationData.type && !Object.values(StorageType).includes(locationData.type)) {
        res.status(400).json({
          success: false,
          message: 'Type de stockage invalide'
        });
        return;
      }

      const updatedLocation = this.inventoryService.updateStorageLocation(id, locationData);

      res.status(200).json({
        success: true,
        data: updatedLocation,
        message: 'Emplacement de stockage mis à jour avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'emplacement de stockage',
        error: error.message
      });
    }
  };

  /**
   * Supprime un emplacement de stockage
   */
  public deleteStorageLocation = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;

      // Vérifier si l'emplacement existe
      const existingLocation = this.inventoryService.getStorageLocationById(id);
      if (!existingLocation) {
        res.status(404).json({
          success: false,
          message: `Emplacement de stockage avec l'ID ${id} non trouvé`
        });
        return;
      }

      const isDeleted = this.inventoryService.deleteStorageLocation(id);

      if (!isDeleted) {
        res.status(400).json({
          success: false,
          message: 'Impossible de supprimer l\'emplacement car il contient des stocks'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Emplacement de stockage supprimé avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'emplacement de stockage',
        error: error.message
      });
    }
  };

  /**
   * Récupère tous les produits
   */
  public getAllProducts = (req: Request, res: Response): void => {
    try {
      const products = this.inventoryService.getAllProducts();
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits',
        error: error.message
      });
    }
  };

  /**
   * Récupère un produit par son ID
   */
  public getProductById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const product = this.inventoryService.getProductById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          message: `Produit avec l'ID ${id} non trouvé`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du produit',
        error: error.message
      });
    }
  };

  /**
   * Crée un nouveau produit
   */
  public createProduct = (req: Request, res: Response): void => {
    try {
      const productData = req.body;

      // Validation basique
      if (!productData.name || !productData.category || !productData.unitType) {
        res.status(400).json({
          success: false,
          message: 'Données invalides. Nom, catégorie et unité de mesure sont requis.'
        });
        return;
      }

      // Vérifier si la catégorie est valide
      if (!Object.values(ProductCategory).includes(productData.category)) {
        res.status(400).json({
          success: false,
          message: 'Catégorie de produit invalide'
        });
        return;
      }

      // Vérifier si l'unité est valide
      if (!Object.values(UnitType).includes(productData.unitType)) {
        res.status(400).json({
          success: false,
          message: 'Unité de mesure invalide'
        });
        return;
      }

      const newProduct = this.inventoryService.createProduct({
        name: productData.name,
        category: productData.category,
        description: productData.description,
        unitType: productData.unitType,
        alertThreshold: productData.alertThreshold
      });

      res.status(201).json({
        success: true,
        data: newProduct,
        message: 'Produit créé avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du produit',
        error: error.message
      });
    }
  };

  /**
   * Met à jour un produit
   */
  public updateProduct = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const productData = req.body;

      // Vérifier si le produit existe
      const existingProduct = this.inventoryService.getProductById(id);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: `Produit avec l'ID ${id} non trouvé`
        });
        return;
      }

      // Vérifier si la catégorie est valide si elle est fournie
      if (productData.category && !Object.values(ProductCategory).includes(productData.category)) {
        res.status(400).json({
          success: false,
          message: 'Catégorie de produit invalide'
        });
        return;
      }

      // Vérifier si l'unité est valide si elle est fournie
      if (productData.unitType && !Object.values(UnitType).includes(productData.unitType)) {
        res.status(400).json({
          success: false,
          message: 'Unité de mesure invalide'
        });
        return;
      }

      const updatedProduct = this.inventoryService.updateProduct(id, productData);

      res.status(200).json({
        success: true,
        data: updatedProduct,
        message: 'Produit mis à jour avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du produit',
        error: error.message
      });
    }
  };

  /**
   * Supprime un produit
   */
  public deleteProduct = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;

      // Vérifier si le produit existe
      const existingProduct = this.inventoryService.getProductById(id);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: `Produit avec l'ID ${id} non trouvé`
        });
        return;
      }

      const isDeleted = this.inventoryService.deleteProduct(id);

      if (!isDeleted) {
        res.status(400).json({
          success: false,
          message: 'Impossible de supprimer le produit car il est utilisé dans des stocks'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Produit supprimé avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du produit',
        error: error.message
      });
    }
  };

  /**
   * Récupère tous les stocks
   */
  public getAllStocks = (req: Request, res: Response): void => {
    try {
      const stocks = this.inventoryService.getAllStocks();
      res.status(200).json({
        success: true,
        data: stocks
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des stocks',
        error: error.message
      });
    }
  };

  /**
   * Récupère un stock par son ID
   */
  public getStockById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const stock = this.inventoryService.getStockById(id);

      if (!stock) {
        res.status(404).json({
          success: false,
          message: `Stock avec l'ID ${id} non trouvé`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: stock
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du stock',
        error: error.message
      });
    }
  };

  /**
   * Récupère les stocks par emplacement
   */
  public getStocksByLocation = (req: Request, res: Response): void => {
    try {
      const { locationId } = req.params;
      const stocks = this.inventoryService.getStocksByLocation(locationId);

      res.status(200).json({
        success: true,
        data: stocks
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des stocks par emplacement',
        error: error.message
      });
    }
  };

  /**
   * Récupère les stocks par produit
   */
  public getStocksByProduct = (req: Request, res: Response): void => {
    try {
      const { productId } = req.params;
      const stocks = this.inventoryService.getStocksByProduct(productId);

      res.status(200).json({
        success: true,
        data: stocks
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des stocks par produit',
        error: error.message
      });
    }
  };

  /**
   * Ajoute un nouveau stock
   */
  public addStock = (req: Request, res: Response): void => {
    try {
      const stockData = req.body;

      // Validation basique
      if (!stockData.productId || !stockData.storageLocationId || 
          stockData.quantity === undefined || !stockData.unitType) {
        res.status(400).json({
          success: false,
          message: 'Données invalides. ID produit, ID emplacement, quantité et unité sont requis.'
        });
        return;
      }

      // Vérifier si l'unité est valide
      if (!Object.values(UnitType).includes(stockData.unitType)) {
        res.status(400).json({
          success: false,
          message: 'Unité de mesure invalide'
        });
        return;
      }

      // Convertir les dates si elles sont fournies en string
      if (stockData.arrivalDate && typeof stockData.arrivalDate === 'string') {
        stockData.arrivalDate = new Date(stockData.arrivalDate);
      }

      if (stockData.expiryDate && typeof stockData.expiryDate === 'string') {
        stockData.expiryDate = new Date(stockData.expiryDate);
      }

      const newStock = this.inventoryService.addStock({
        productId: stockData.productId,
        storageLocationId: stockData.storageLocationId,
        quantity: stockData.quantity,
        unitType: stockData.unitType,
        batchNumber: stockData.batchNumber,
        arrivalDate: stockData.arrivalDate || new Date(),
        expiryDate: stockData.expiryDate,
        notes: stockData.notes
      });

      res.status(201).json({
        success: true,
        data: newStock,
        message: 'Stock ajouté avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'ajout du stock',
        error: error.message
      });
    }
  };

  /**
   * Met à jour un stock
   */
  public updateStock = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const stockData = req.body;

      // Vérifier si le stock existe
      const existingStock = this.inventoryService.getStockById(id);
      if (!existingStock) {
        res.status(404).json({
          success: false,
          message: `Stock avec l'ID ${id} non trouvé`
        });
        return;
      }

      // Vérifier si l'unité est valide si elle est fournie
      if (stockData.unitType && !Object.values(UnitType).includes(stockData.unitType)) {
        res.status(400).json({
          success: false,
          message: 'Unité de mesure invalide'
        });
        return;
      }

      // Convertir les dates si elles sont fournies en string
      if (stockData.arrivalDate && typeof stockData.arrivalDate === 'string') {
        stockData.arrivalDate = new Date(stockData.arrivalDate);
      }

      if (stockData.expiryDate && typeof stockData.expiryDate === 'string') {
        stockData.expiryDate = new Date(stockData.expiryDate);
      }

      const updatedStock = this.inventoryService.updateStock(id, stockData);

      res.status(200).json({
        success: true,
        data: updatedStock,
        message: 'Stock mis à jour avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du stock',
        error: error.message
      });
    }
  };

  /**
   * Supprime un stock
   */
  public removeStock = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;

      // Vérifier si le stock existe
      const existingStock = this.inventoryService.getStockById(id);
      if (!existingStock) {
        res.status(404).json({
          success: false,
          message: `Stock avec l'ID ${id} non trouvé`
        });
        return;
      }

      const isRemoved = this.inventoryService.removeStock(id);

      if (!isRemoved) {
        res.status(400).json({
          success: false,
          message: 'Erreur lors de la suppression du stock'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Stock supprimé avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du stock',
        error: error.message
      });
    }
  };

  /**
   * Transfère du stock entre deux emplacements
   */
  public transferStock = (req: Request, res: Response): void => {
    try {
      const { stockId } = req.params;
      const { targetLocationId, quantity } = req.body;

      // Validation basique
      if (!targetLocationId || quantity === undefined || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: 'Données invalides. ID emplacement cible et quantité positive sont requis.'
        });
        return;
      }

      // Vérifier si le stock existe
      const existingStock = this.inventoryService.getStockById(stockId);
      if (!existingStock) {
        res.status(404).json({
          success: false,
          message: `Stock avec l'ID ${stockId} non trouvé`
        });
        return;
      }

      // Vérifier si l'emplacement cible existe
      const targetLocation = this.inventoryService.getStorageLocationById(targetLocationId);
      if (!targetLocation) {
        res.status(404).json({
          success: false,
          message: `Emplacement cible avec l'ID ${targetLocationId} non trouvé`
        });
        return;
      }

      const result = this.inventoryService.transferStock(stockId, targetLocationId, quantity);

      if (!result) {
        res.status(400).json({
          success: false,
          message: 'Erreur lors du transfert du stock'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
        message: 'Stock transféré avec succès'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du transfert du stock',
        error: error.message
      });
    }
  };

  /**
   * Récupère tous les mouvements de stock
   */
  public getAllStockMovements = (req: Request, res: Response): void => {
    try {
      const movements = this.inventoryService.getAllStockMovements();
      res.status(200).json({
        success: true,
        data: movements
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des mouvements de stock',
        error: error.message
      });
    }
  };

  /**
   * Récupère les mouvements de stock filtrés
   */
  public getFilteredStockMovements = (req: Request, res: Response): void => {
    try {
      const { productId, storageLocationId, startDate, endDate, type } = req.query;
      
      const filters: any = {};

      if (productId) filters.productId = productId as string;
      if (storageLocationId) filters.storageLocationId = storageLocationId as string;
      
      if (startDate && typeof startDate === 'string') {
        filters.startDate = new Date(startDate);
      }
      
      if (endDate && typeof endDate === 'string') {
        filters.endDate = new Date(endDate);
      }
      
      if (type && ['IN', 'OUT', 'TRANSFER'].includes(type as string)) {
        filters.type = type as 'IN' | 'OUT' | 'TRANSFER';
      }

      const movements = this.inventoryService.getFilteredStockMovements(filters);

      res.status(200).json({
        success: true,
        data: movements
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des mouvements de stock filtrés',
        error: error.message
      });
    }
  };

  /**
   * Récupère les statistiques d'inventaire
   */
  public getInventoryStats = (req: Request, res: Response): void => {
    try {
      const stats = this.inventoryService.getInventoryStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques d\'inventaire',
        error: error.message
      });
    }
  };
}
