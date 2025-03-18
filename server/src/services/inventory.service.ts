import { 
  StorageLocation, 
  Product, 
  Stock, 
  StockMovement, 
  InventoryStats,
  StorageType,
  ProductCategory,
  UnitType,
  StockStatus
} from '../models/inventory.model';

/**
 * Service de gestion d'inventaire
 */
export class InventoryService {
  // Données simulées pour le développement
  private storageLocations: StorageLocation[] = [
    {
      id: 'fridge-1',
      name: 'Frigo 1',
      type: StorageType.REFRIGERATOR,
      capacity: 200,
      currentCapacity: 75,
      temperature: 4,
      idealMinTemp: 2,
      idealMaxTemp: 6,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'fridge-2',
      name: 'Frigo 2',
      type: StorageType.REFRIGERATOR,
      capacity: 150,
      currentCapacity: 40,
      temperature: 3.5,
      idealMinTemp: 2,
      idealMaxTemp: 6,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'freezer-1',
      name: 'Congélateur 1',
      type: StorageType.FREEZER,
      capacity: 300,
      currentCapacity: 135,
      temperature: -18,
      idealMinTemp: -22,
      idealMaxTemp: -16,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'freezer-2',
      name: 'Congélateur 2',
      type: StorageType.FREEZER,
      capacity: 250,
      currentCapacity: 45,
      temperature: -20,
      idealMinTemp: -22,
      idealMaxTemp: -16,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'storage-1',
      name: 'Remise',
      type: StorageType.STORAGE,
      capacity: 1000,
      currentCapacity: 700,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'cellar-1',
      name: 'Cave',
      type: StorageType.CELLAR,
      capacity: 500,
      currentCapacity: 150,
      temperature: 13,
      idealMinTemp: 10,
      idealMaxTemp: 15,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    }
  ];

  private products: Product[] = [
    {
      id: 'prod-001',
      name: 'Huîtres Fines de Claire',
      category: ProductCategory.OYSTER,
      description: 'Huîtres Fines de Claire calibre 3',
      unitType: UnitType.KG,
      alertThreshold: 20,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'prod-002',
      name: 'Moules de Bouchot',
      category: ProductCategory.SEAFOOD,
      description: 'Moules de Bouchot AOP',
      unitType: UnitType.KG,
      alertThreshold: 10,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'prod-003',
      name: 'Huîtres Spéciales',
      category: ProductCategory.OYSTER,
      description: 'Huîtres Spéciales calibre 2',
      unitType: UnitType.KG,
      alertThreshold: 15,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'prod-004',
      name: 'Crevettes Royales',
      category: ProductCategory.SEAFOOD,
      description: 'Crevettes Royales calibre 16/20',
      unitType: UnitType.KG,
      alertThreshold: 5,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'prod-005',
      name: 'Matériel d\'emballage',
      category: ProductCategory.PACKAGING,
      description: 'Boîtes carton pour conditionnement huîtres',
      unitType: UnitType.UNIT,
      alertThreshold: 50,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'prod-006',
      name: 'Vin blanc Muscadet',
      category: ProductCategory.WINE,
      description: 'Muscadet Sèvre et Maine sur Lie',
      unitType: UnitType.BOTTLE,
      alertThreshold: 10,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-10')
    }
  ];

  private stocks: Stock[] = [
    {
      id: 'stock-001',
      productId: 'prod-001',
      storageLocationId: 'fridge-1',
      quantity: 50,
      unitType: UnitType.KG,
      status: StockStatus.AVAILABLE,
      batchNumber: 'LOT-2025-0225',
      arrivalDate: new Date('2025-02-25'),
      expiryDate: new Date('2025-03-10'),
      createdAt: new Date('2025-02-25'),
      updatedAt: new Date('2025-02-25')
    },
    {
      id: 'stock-002',
      productId: 'prod-002',
      storageLocationId: 'fridge-1',
      quantity: 25,
      unitType: UnitType.KG,
      status: StockStatus.AVAILABLE,
      batchNumber: 'LOT-2025-0301',
      arrivalDate: new Date('2025-03-01'),
      expiryDate: new Date('2025-03-08'),
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-01')
    },
    {
      id: 'stock-003',
      productId: 'prod-003',
      storageLocationId: 'fridge-2',
      quantity: 30,
      unitType: UnitType.KG,
      status: StockStatus.AVAILABLE,
      batchNumber: 'LOT-2025-0227',
      arrivalDate: new Date('2025-02-27'),
      expiryDate: new Date('2025-03-12'),
      createdAt: new Date('2025-02-27'),
      updatedAt: new Date('2025-02-27')
    },
    {
      id: 'stock-004',
      productId: 'prod-004',
      storageLocationId: 'fridge-2',
      quantity: 10,
      unitType: UnitType.KG,
      status: StockStatus.LOW,
      batchNumber: 'LOT-2025-0301',
      arrivalDate: new Date('2025-03-01'),
      expiryDate: new Date('2025-03-05'),
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-01')
    },
    {
      id: 'stock-005',
      productId: 'prod-005',
      storageLocationId: 'storage-1',
      quantity: 200,
      unitType: UnitType.UNIT,
      status: StockStatus.AVAILABLE,
      batchNumber: 'LOT-2025-0110',
      arrivalDate: new Date('2025-01-10'),
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-10')
    },
    {
      id: 'stock-006',
      productId: 'prod-006',
      storageLocationId: 'cellar-1',
      quantity: 50,
      unitType: UnitType.BOTTLE,
      status: StockStatus.AVAILABLE,
      batchNumber: 'LOT-2024-1015',
      arrivalDate: new Date('2024-10-15'),
      expiryDate: new Date('2026-10-15'),
      createdAt: new Date('2024-10-15'),
      updatedAt: new Date('2024-10-15')
    }
  ];

  private stockMovements: StockMovement[] = [
    {
      id: 'mov-001',
      stockId: 'stock-001',
      productId: 'prod-001',
      storageLocationId: 'fridge-1',
      type: 'IN',
      quantity: 50,
      unitType: UnitType.KG,
      reason: 'Livraison initiale',
      performedBy: 'user-001',
      performedAt: new Date('2025-02-25'),
      createdAt: new Date('2025-02-25')
    },
    {
      id: 'mov-002',
      stockId: 'stock-001',
      productId: 'prod-001',
      storageLocationId: 'fridge-1',
      type: 'OUT',
      quantity: 5,
      unitType: UnitType.KG,
      reason: 'Vente',
      performedBy: 'user-002',
      performedAt: new Date('2025-02-28'),
      createdAt: new Date('2025-02-28')
    }
  ];

  /**
   * Récupère tous les emplacements de stockage
   */
  public getAllStorageLocations(): StorageLocation[] {
    return this.storageLocations;
  }

  /**
   * Récupère un emplacement de stockage par son ID
   */
  public getStorageLocationById(id: string): StorageLocation | undefined {
    return this.storageLocations.find(location => location.id === id);
  }

  /**
   * Crée un nouvel emplacement de stockage
   */
  public createStorageLocation(location: Omit<StorageLocation, 'id' | 'createdAt' | 'updatedAt'>): StorageLocation {
    const newLocation: StorageLocation = {
      ...location,
      id: this.generateId('loc'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.storageLocations.push(newLocation);
    return newLocation;
  }

  /**
   * Met à jour un emplacement de stockage
   */
  public updateStorageLocation(id: string, data: Partial<Omit<StorageLocation, 'id' | 'createdAt' | 'updatedAt'>>): StorageLocation | undefined {
    const index = this.storageLocations.findIndex(location => location.id === id);
    if (index === -1) return undefined;
    
    const updatedLocation = {
      ...this.storageLocations[index],
      ...data,
      updatedAt: new Date()
    };
    
    this.storageLocations[index] = updatedLocation;
    return updatedLocation;
  }

  /**
   * Supprime un emplacement de stockage
   */
  public deleteStorageLocation(id: string): boolean {
    const index = this.storageLocations.findIndex(location => location.id === id);
    if (index === -1) return false;
    
    // Vérifier si des stocks sont associés à cet emplacement
    const hasStocks = this.stocks.some(stock => stock.storageLocationId === id);
    if (hasStocks) return false; // Ne pas supprimer s'il y a des stocks associés
    
    this.storageLocations.splice(index, 1);
    return true;
  }

  /**
   * Récupère tous les produits
   */
  public getAllProducts(): Product[] {
    return this.products;
  }

  /**
   * Récupère un produit par son ID
   */
  public getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  /**
   * Crée un nouveau produit
   */
  public createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.generateId('prod'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * Met à jour un produit
   */
  public updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Product | undefined {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return undefined;
    
    const updatedProduct = {
      ...this.products[index],
      ...data,
      updatedAt: new Date()
    };
    
    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  /**
   * Supprime un produit
   */
  public deleteProduct(id: string): boolean {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return false;
    
    // Vérifier si des stocks sont associés à ce produit
    const hasStocks = this.stocks.some(stock => stock.productId === id);
    if (hasStocks) return false; // Ne pas supprimer s'il y a des stocks associés
    
    this.products.splice(index, 1);
    return true;
  }

  /**
   * Récupère tous les stocks
   */
  public getAllStocks(): Stock[] {
    return this.stocks;
  }

  /**
   * Récupère un stock par son ID
   */
  public getStockById(id: string): Stock | undefined {
    return this.stocks.find(stock => stock.id === id);
  }

  /**
   * Récupère les stocks pour un emplacement spécifique
   */
  public getStocksByLocation(locationId: string): Stock[] {
    return this.stocks.filter(stock => stock.storageLocationId === locationId);
  }

  /**
   * Récupère les stocks pour un produit spécifique
   */
  public getStocksByProduct(productId: string): Stock[] {
    return this.stocks.filter(stock => stock.productId === productId);
  }

  /**
   * Ajoute un nouveau stock
   */
  public addStock(stockData: Omit<Stock, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Stock {
    // Vérification de l'existence du produit et de l'emplacement
    const product = this.getProductById(stockData.productId);
    const location = this.getStorageLocationById(stockData.storageLocationId);
    
    if (!product || !location) {
      throw new Error('Produit ou emplacement de stockage introuvable');
    }
    
    // Déterminer le statut du stock
    let status = StockStatus.AVAILABLE;
    if (product.alertThreshold && stockData.quantity <= product.alertThreshold) {
      status = StockStatus.LOW;
    }
    if (stockData.expiryDate && stockData.expiryDate <= new Date()) {
      status = StockStatus.EXPIRED;
    }
    
    // Créer l'entrée de stock
    const newStock: Stock = {
      ...stockData,
      id: this.generateId('stock'),
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Mettre à jour la capacité utilisée de l'emplacement
    this.updateStorageLocationCapacity(location.id, stockData.quantity, 'add');
    
    // Enregistrer le mouvement de stock
    this.recordStockMovement({
      stockId: newStock.id,
      productId: newStock.productId,
      storageLocationId: newStock.storageLocationId,
      type: 'IN',
      quantity: newStock.quantity,
      unitType: newStock.unitType,
      reason: 'Ajout de stock',
      performedBy: 'system', // À remplacer par l'ID de l'utilisateur authentifié
      performedAt: new Date(),
    });
    
    this.stocks.push(newStock);
    return newStock;
  }

  /**
   * Met à jour un stock existant
   */
  public updateStock(id: string, data: Partial<Omit<Stock, 'id' | 'productId' | 'storageLocationId' | 'createdAt' | 'updatedAt'>>): Stock | undefined {
    const index = this.stocks.findIndex(stock => stock.id === id);
    if (index === -1) return undefined;
    
    const currentStock = this.stocks[index];
    const product = this.getProductById(currentStock.productId);
    
    if (!product) {
      throw new Error('Produit introuvable');
    }
    
    // Ajuster la capacité de l'emplacement si la quantité est modifiée
    if (data.quantity !== undefined && data.quantity !== currentStock.quantity) {
      const quantityDiff = data.quantity - currentStock.quantity;
      this.updateStorageLocationCapacity(
        currentStock.storageLocationId,
        Math.abs(quantityDiff),
        quantityDiff > 0 ? 'add' : 'remove'
      );
      
      // Enregistrer le mouvement de stock
      this.recordStockMovement({
        stockId: currentStock.id,
        productId: currentStock.productId,
        storageLocationId: currentStock.storageLocationId,
        type: quantityDiff > 0 ? 'IN' : 'OUT',
        quantity: Math.abs(quantityDiff),
        unitType: currentStock.unitType,
        reason: 'Mise à jour de stock',
        performedBy: 'system', // À remplacer par l'ID de l'utilisateur authentifié
        performedAt: new Date(),
      });
    }
    
    // Déterminer le statut du stock si nécessaire
    let status = data.status || currentStock.status;
    if (data.quantity !== undefined && product.alertThreshold) {
      if (data.quantity <= product.alertThreshold) {
        status = StockStatus.LOW;
      } else {
        status = StockStatus.AVAILABLE;
      }
    }
    if (data.expiryDate && data.expiryDate <= new Date()) {
      status = StockStatus.EXPIRED;
    }
    
    const updatedStock = {
      ...currentStock,
      ...data,
      status,
      updatedAt: new Date()
    };
    
    this.stocks[index] = updatedStock;
    return updatedStock;
  }

  /**
   * Supprime un stock et met à jour la capacité de l'emplacement
   */
  public removeStock(id: string): boolean {
    const index = this.stocks.findIndex(stock => stock.id === id);
    if (index === -1) return false;
    
    const stockToRemove = this.stocks[index];
    
    // Mettre à jour la capacité de l'emplacement
    this.updateStorageLocationCapacity(
      stockToRemove.storageLocationId,
      stockToRemove.quantity,
      'remove'
    );
    
    // Enregistrer le mouvement de stock
    this.recordStockMovement({
      stockId: stockToRemove.id,
      productId: stockToRemove.productId,
      storageLocationId: stockToRemove.storageLocationId,
      type: 'OUT',
      quantity: stockToRemove.quantity,
      unitType: stockToRemove.unitType,
      reason: 'Suppression de stock',
      performedBy: 'system', // À remplacer par l'ID de l'utilisateur authentifié
      performedAt: new Date(),
    });
    
    this.stocks.splice(index, 1);
    return true;
  }

  /**
   * Transfert de stock entre deux emplacements
   */
  public transferStock(
    stockId: string, 
    targetLocationId: string, 
    quantity: number
  ): { sourceStock: Stock; targetStock: Stock } | undefined {
    const sourceStockIndex = this.stocks.findIndex(stock => stock.id === stockId);
    if (sourceStockIndex === -1) return undefined;
    
    const sourceStock = this.stocks[sourceStockIndex];
    const targetLocation = this.getStorageLocationById(targetLocationId);
    
    if (!targetLocation) {
      throw new Error('Emplacement cible introuvable');
    }
    
    if (quantity > sourceStock.quantity) {
      throw new Error('Quantité à transférer supérieure à la quantité disponible');
    }
    
    // Chercher si le produit existe déjà dans l'emplacement cible
    const existingTargetStock = this.stocks.find(
      stock => stock.productId === sourceStock.productId && 
               stock.storageLocationId === targetLocationId &&
               stock.batchNumber === sourceStock.batchNumber
    );
    
    // Mise à jour du stock source
    const updatedSourceStock = this.updateStock(
      sourceStock.id, 
      { quantity: sourceStock.quantity - quantity }
    );
    
    if (!updatedSourceStock) {
      throw new Error('Erreur lors de la mise à jour du stock source');
    }
    
    let targetStock: Stock;
    
    // Si un stock existe déjà dans l'emplacement cible, l'augmenter
    if (existingTargetStock) {
      const updatedTargetStock = this.updateStock(
        existingTargetStock.id,
        { quantity: existingTargetStock.quantity + quantity }
      );
      
      if (!updatedTargetStock) {
        throw new Error('Erreur lors de la mise à jour du stock cible');
      }
      
      targetStock = updatedTargetStock;
    } else {
      // Sinon, créer un nouveau stock
      const newTargetStock = this.addStock({
        productId: sourceStock.productId,
        storageLocationId: targetLocationId,
        quantity,
        unitType: sourceStock.unitType,
        batchNumber: sourceStock.batchNumber,
        arrivalDate: new Date(),
        expiryDate: sourceStock.expiryDate,
        notes: `Transféré depuis ${sourceStock.id}`
      });
      
      targetStock = newTargetStock;
    }
    
    // Enregistrer le mouvement de transfert
    this.recordStockMovement({
      stockId: sourceStock.id,
      productId: sourceStock.productId,
      storageLocationId: sourceStock.storageLocationId,
      type: 'TRANSFER',
      quantity: quantity,
      unitType: sourceStock.unitType,
      fromLocationId: sourceStock.storageLocationId,
      toLocationId: targetLocationId,
      reason: 'Transfert de stock',
      performedBy: 'system', // À remplacer par l'ID de l'utilisateur authentifié
      performedAt: new Date(),
    });
    
    return { sourceStock: updatedSourceStock, targetStock };
  }

  /**
   * Récupère tous les mouvements de stock
   */
  public getAllStockMovements(): StockMovement[] {
    return this.stockMovements;
  }

  /**
   * Récupère les mouvements de stock filtrés par produit, emplacement ou période
   */
  public getFilteredStockMovements(filters: {
    productId?: string;
    storageLocationId?: string;
    startDate?: Date;
    endDate?: Date;
    type?: 'IN' | 'OUT' | 'TRANSFER';
  }): StockMovement[] {
    let filteredMovements = [...this.stockMovements];
    
    if (filters.productId) {
      filteredMovements = filteredMovements.filter(
        movement => movement.productId === filters.productId
      );
    }
    
    if (filters.storageLocationId) {
      filteredMovements = filteredMovements.filter(
        movement => movement.storageLocationId === filters.storageLocationId ||
                    movement.fromLocationId === filters.storageLocationId ||
                    movement.toLocationId === filters.storageLocationId
      );
    }
    
    if (filters.startDate) {
      filteredMovements = filteredMovements.filter(
        movement => movement.performedAt >= filters.startDate!
      );
    }
    
    if (filters.endDate) {
      filteredMovements = filteredMovements.filter(
        movement => movement.performedAt <= filters.endDate!
      );
    }
    
    if (filters.type) {
      filteredMovements = filteredMovements.filter(
        movement => movement.type === filters.type
      );
    }
    
    return filteredMovements;
  }

  /**
   * Récupère les statistiques d'inventaire
   */
  public getInventoryStats(): InventoryStats {
    // Nombre total de produits uniques en stock
    const totalProducts = new Set(this.stocks.map(stock => stock.productId)).size;
    
    // Valeur totale du stock (à implémenter avec les prix des produits)
    const totalValue = 0; // Placeholder
    
    // Nombre de produits avec un stock faible
    const lowStockCount = this.stocks.filter(stock => stock.status === StockStatus.LOW).length;
    
    // Nombre de produits qui expirent bientôt (dans les 7 jours)
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);
    
    const expiringCount = this.stocks.filter(stock => 
      stock.expiryDate && 
      stock.expiryDate > today && 
      stock.expiryDate <= sevenDaysLater
    ).length;
    
    // Utilisation de l'espace de stockage
    const storageUtilization: { [key: string]: { total: number; used: number; utilization: number } } = {};
    
    this.storageLocations.forEach(location => {
      storageUtilization[location.id] = {
        total: location.capacity,
        used: location.currentCapacity,
        utilization: (location.currentCapacity / location.capacity) * 100
      };
    });
    
    // Distribution des produits par catégorie
    const productDistribution: { [key in ProductCategory]: number } = {
      [ProductCategory.OYSTER]: 0,
      [ProductCategory.SEAFOOD]: 0,
      [ProductCategory.PACKAGING]: 0,
      [ProductCategory.EQUIPMENT]: 0,
      [ProductCategory.CONSUMABLE]: 0,
      [ProductCategory.WINE]: 0,
      [ProductCategory.OTHER]: 0
    };
    
    // Pour chaque stock, obtenez le produit correspondant et incrémentez son compteur de catégorie
    this.stocks.forEach(stock => {
      const product = this.getProductById(stock.productId);
      if (product) {
        productDistribution[product.category] += 1;
      }
    });
    
    // Nombre de mouvements par type
    const inMoves = this.stockMovements.filter(move => move.type === 'IN').length;
    const outMoves = this.stockMovements.filter(move => move.type === 'OUT').length;
    const transferMoves = this.stockMovements.filter(move => move.type === 'TRANSFER').length;
    
    return {
      totalProducts,
      totalValue,
      lowStockCount,
      expiringCount,
      storageUtilization,
      productDistribution,
      movementCount: {
        in: inMoves,
        out: outMoves,
        transfer: transferMoves
      }
    };
  }

  /**
   * Enregistre un mouvement de stock
   */
  private recordStockMovement(movementData: Omit<StockMovement, 'id' | 'createdAt'>): StockMovement {
    const newMovement: StockMovement = {
      ...movementData,
      id: this.generateId('mov'),
      createdAt: new Date()
    };
    
    this.stockMovements.push(newMovement);
    return newMovement;
  }

  /**
   * Met à jour la capacité utilisée d'un emplacement de stockage
   */
  private updateStorageLocationCapacity(locationId: string, quantity: number, operation: 'add' | 'remove'): void {
    const location = this.getStorageLocationById(locationId);
    if (!location) return;
    
    if (operation === 'add') {
      location.currentCapacity += quantity;
      // S'assurer que la capacité ne dépasse pas le maximum
      if (location.currentCapacity > location.capacity) {
        location.currentCapacity = location.capacity;
      }
    } else {
      location.currentCapacity -= quantity;
      // S'assurer que la capacité ne devient pas négative
      if (location.currentCapacity < 0) {
        location.currentCapacity = 0;
      }
    }
    
    // Mettre à jour l'emplacement dans la collection
    const index = this.storageLocations.findIndex(loc => loc.id === locationId);
    if (index !== -1) {
      this.storageLocations[index] = {...location, updatedAt: new Date()};
    }
  }

  /**
   * Génère un ID unique pour une entité
   */
  private generateId(prefix: string): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${randomStr}`;
  }
}
