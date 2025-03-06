import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Récupérer tout l'inventaire
 */
export const getAllInventory = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');

    if (error) throw error;

    // Formater les données pour inclure la couleur appropriée selon le type
    const formattedData = data.map(item => ({
      ...item,
      color: item.type === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600'
    }));

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer l'inventaire par type (triploid/diploid)
 */
export const getInventoryByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('type', type)
      .order('name');

    if (error) throw error;

    // Appliquer la couleur appropriée selon le type
    const color = type === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600';
    const formattedData = data.map(item => ({
      ...item,
      color
    }));

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un élément d'inventaire spécifique par ID
 */
export const getInventoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Élément d\'inventaire non trouvé'
      });
    }

    // Appliquer la couleur appropriée selon le type
    const color = data.type === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600';

    res.status(200).json({
      success: true,
      data: {
        ...data,
        color
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter un élément à l'inventaire
 */
export const addInventoryItem = async (req, res, next) => {
  try {
    const { 
      name, 
      description, 
      type, 
      quantity, 
      unit, 
      cost_price,
      selling_price,
      location
    } = req.body;
    
    // Préparer les données pour l'insertion
    const itemData = {
      name,
      description: description || '', 
      type,
      current_stock: quantity,
      unit: unit || 'unité',
      cost_price: cost_price || 0,
      selling_price: selling_price || 0,
      location: location || 'Stock principal'
    };
    
    const { data, error } = await supabase
      .from('inventory_items')
      .insert(itemData)
      .select()
      .single();

    if (error) throw error;

    // Enregistrer le mouvement de stock
    await recordStockMovement(data.id, 'in', quantity, 'Création initiale');

    // Appliquer la couleur appropriée selon le type
    const color = type === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600';

    res.status(201).json({
      success: true,
      data: {
        ...data,
        color
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un élément d'inventaire
 */
export const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Vérifier si l'élément existe
    const { data: existingItem, error: fetchError } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Élément d\'inventaire non trouvé'
      });
    }

    // Enregistrer un mouvement de stock si la quantité change
    if (updates.current_stock !== undefined && updates.current_stock !== existingItem.current_stock) {
      const quantityDiff = updates.current_stock - existingItem.current_stock;
      const movementType = quantityDiff > 0 ? 'in' : 'out';
      const notes = `Ajustement manuel: ${quantityDiff > 0 ? '+' : ''}${quantityDiff}`;
      
      await recordStockMovement(
        id, 
        movementType, 
        Math.abs(quantityDiff),
        notes
      );
    }
    
    const { data, error } = await supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Appliquer la couleur appropriée selon le type
    const color = data.type === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600';

    res.status(200).json({
      success: true,
      data: {
        ...data,
        color
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un élément d'inventaire
 */
export const deleteInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'élément existe
    const { data: existingItem, error: fetchError } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Élément d\'inventaire non trouvé'
      });
    }
    
    // Supprimer d'abord les mouvements de stock associés
    const { error: deleteMovementsError } = await supabase
      .from('stock_movements')
      .delete()
      .eq('item_id', id);
      
    if (deleteMovementsError) throw deleteMovementsError;
    
    // Puis supprimer l'élément d'inventaire
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Élément d\'inventaire supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les statistiques d'inventaire
 */
export const getInventoryStats = async (req, res, next) => {
  try {
    // Récupérer le total par type
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory_items')
      .select('type, current_stock');
      
    if (inventoryError) throw inventoryError;

    // Calculer les totaux
    const stats = {
      total: 0,
      triploid: 0, // Triploïdes (bordeaux)
      diploid: 0,  // Diploïdes (bleu)
      lowStock: 0
    };
    
    inventoryData.forEach(item => {
      stats.total += item.current_stock;
      
      if (item.type === 'triploid') {
        stats.triploid += item.current_stock;
      } else if (item.type === 'diploid') {
        stats.diploid += item.current_stock;
      }
      
      // Compter les éléments avec un stock faible
      if (item.current_stock < (item.reorder_point || 10)) {
        stats.lowStock++;
      }
    });
    
    // Calculer les pourcentages
    const percentages = {
      triploid: stats.total > 0 ? Math.round((stats.triploid / stats.total) * 100) : 0,
      diploid: stats.total > 0 ? Math.round((stats.diploid / stats.total) * 100) : 0
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        percentages,
        colors: {
          triploid: 'bg-brand-burgundy',
          diploid: 'bg-blue-600'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Effectuer un transfert entre tables
 */
export const transferInventory = async (req, res, next) => {
  try {
    const { sourceTableId, destinationTableId, quantity, notes } = req.body;
    
    // Vérifier que les tables existent et sont du même type
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('id, name, type')
      .in('id', [sourceTableId, destinationTableId]);
      
    if (tablesError) throw tablesError;
    
    if (tables.length !== 2) {
      return res.status(404).json({
        success: false,
        message: 'Une ou plusieurs tables non trouvées'
      });
    }
    
    const sourceTable = tables.find(table => table.id === sourceTableId);
    const destinationTable = tables.find(table => table.id === destinationTableId);
    
    if (sourceTable.type !== destinationTable.type) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de transférer entre des tables de types différents',
        details: 'Les transferts ne sont autorisés qu\'entre tables du même type (triploïde ou diploïde)'
      });
    }
    
    // Créer l'enregistrement de transfert
    const transferData = {
      source_table_id: sourceTableId,
      destination_table_id: destinationTableId,
      quantity,
      transfer_date: new Date(),
      notes: notes || `Transfert de ${quantity} unités de ${sourceTable.name} vers ${destinationTable.name}`
    };
    
    const { data, error } = await supabase
      .from('inventory_transfers')
      .insert(transferData)
      .select()
      .single();

    if (error) throw error;

    // Mettre à jour les cellules concernées
    // Cela dépend de votre logique de gestion des cellules dans les tables
    // À adapter selon votre implémentation spécifique

    res.status(201).json({
      success: true,
      message: 'Transfert effectué avec succès',
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fonction utilitaire pour enregistrer un mouvement de stock
 */
async function recordStockMovement(itemId, movementType, quantity, notes = '') {
  try {
    const movementData = {
      item_id: itemId,
      movement_type: movementType,
      quantity,
      reference_number: `MOV-${Date.now()}`,
      notes
    };
    
    const { data, error } = await supabase
      .from('stock_movements')
      .insert(movementData)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    logger.error(`Erreur lors de l'enregistrement du mouvement de stock: ${error.message}`);
    throw error;
  }
}
