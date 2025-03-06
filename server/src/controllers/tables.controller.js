import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Récupérer toutes les tables
 */
export const getAllTables = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .order('name');

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les tables par type (triploid/diploid)
 * Respecte la division des tables en deux colonnes : 
 * - Triploïdes (bordeaux) à gauche
 * - Diploïdes (bleue) à droite
 */
export const getTablesByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('type', type)
      .order('rowIndex')
      .order('columnIndex');

    if (error) throw error;

    // Appliquer la couleur appropriée selon le type
    const formattedData = data.map(table => ({
      ...table,
      color: type === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600'
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
 * Récupérer une table spécifique par ID
 */
export const getTableById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('tables')
      .select('*, table_cells(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Table non trouvée'
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
 * Créer une nouvelle table
 */
export const createTable = async (req, res, next) => {
  try {
    const { name, type, position, columnIndex, rowIndex } = req.body;
    
    // Préparer les données pour l'insertion
    const tableData = {
      name,
      type,
      position,
      columnIndex,
      rowIndex
    };
    
    const { data, error } = await supabase
      .from('tables')
      .insert(tableData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une table
 */
export const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data: existingTable, error: fetchError } = await supabase
      .from('tables')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    if (!existingTable) {
      return res.status(404).json({
        success: false,
        message: 'Table non trouvée'
      });
    }
    
    const { data, error } = await supabase
      .from('tables')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une table
 */
export const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la table existe
    const { data: existingTable, error: fetchError } = await supabase
      .from('tables')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    if (!existingTable) {
      return res.status(404).json({
        success: false,
        message: 'Table non trouvée'
      });
    }
    
    // Supprimer d'abord les cellules associées
    const { error: deleteCellsError } = await supabase
      .from('table_cells')
      .delete()
      .eq('table_id', id);
      
    if (deleteCellsError) throw deleteCellsError;
    
    // Puis supprimer la table
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Table supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les cellules d'une table
 */
export const getTableCells = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Récupérer d'abord les informations de la table
    const { data: table, error: tableError } = await supabase
      .from('tables')
      .select('*')
      .eq('id', id)
      .single();
      
    if (tableError) throw tableError;
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table non trouvée'
      });
    }
    
    // Récupérer les cellules de la table
    const { data: cells, error: cellsError } = await supabase
      .from('table_cells')
      .select('*')
      .eq('table_id', id)
      .order('cellNumber');
      
    if (cellsError) throw cellsError;

    res.status(200).json({
      success: true,
      table: {
        ...table,
        color: table.type === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600'
      },
      cells: cells
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter une cellule à une table
 */
export const addCellToTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status = 'empty' } = req.body;
    
    // Vérifier si la table existe
    const { data: table, error: tableError } = await supabase
      .from('tables')
      .select('*')
      .eq('id', id)
      .single();
      
    if (tableError) throw tableError;
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table non trouvée'
      });
    }
    
    // Récupérer le numéro de cellule le plus élevé pour cette table
    const { data: highestCell, error: highestCellError } = await supabase
      .from('table_cells')
      .select('cellNumber')
      .eq('table_id', id)
      .order('cellNumber', { ascending: false })
      .limit(1)
      .single();
      
    if (highestCellError && highestCellError.code !== 'PGRST116') throw highestCellError;
    
    // Déterminer le prochain numéro de cellule (commencer à 1 si aucune cellule n'existe)
    const nextCellNumber = highestCell ? highestCell.cellNumber + 1 : 1;
    
    // Créer la nouvelle cellule
    const cellData = {
      table_id: id,
      cellNumber: nextCellNumber,
      status
    };
    
    const { data, error } = await supabase
      .from('table_cells')
      .insert(cellData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fonction utilitaire pour créer des cellules de table
 * Respecte les règles :
 * - Numérotation commençant à 1 pour chaque colonne
 * - Pas de cellules vides entre deux cellules numérotées
 * - Cellules remplies séquentiellement, de haut en bas
 */
export const createTableCells = async (tableId, count, defaultStatus = 'empty') => {
  try {
    // Vérifier si la table existe
    const { data: table, error: tableError } = await supabase
      .from('tables')
      .select('*')
      .eq('id', tableId)
      .single();
      
    if (tableError) throw tableError;
    if (!table) throw new Error('Table non trouvée');
    
    // Supprimer les cellules existantes
    await supabase
      .from('table_cells')
      .delete()
      .eq('table_id', tableId);
    
    // Créer les nouvelles cellules
    const cellsToInsert = Array.from({ length: count }, (_, i) => ({
      table_id: tableId,
      cellNumber: i + 1, // Commence à 1
      status: i < Math.ceil(count * 0.6) ? 'filled' : defaultStatus // 60% remplies par défaut
    }));
    
    const { data, error } = await supabase
      .from('table_cells')
      .insert(cellsToInsert)
      .select();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    logger.error(`Erreur lors de la création des cellules: ${error.message}`);
    throw error;
  }
};

/**
 * Réorganiser les cellules des tables
 * Respecte les règles:
 * - Triploïdes (bordeaux) à gauche et diploïdes (bleue) à droite
 * - Numérotation commençant à 1 pour chaque colonne
 * - Pas de cellules vides entre deux cellules numérotées
 */
export const reorganizeCells = async (req, res, next) => {
  try {
    // 1. Récupérer toutes les tables, triées par colonne puis par ligne
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .order('columnIndex')
      .order('rowIndex');
      
    if (tablesError) throw tablesError;
    
    // 2. Séparer les tables par type
    const triploidTables = tables.filter(table => table.type === 'triploid');
    const diploidTables = tables.filter(table => table.type === 'diploid');
    
    // 3. Traiter chaque groupe séparément
    const results = {
      triploid: [],
      diploid: []
    };
    
    // Traiter les tables triploïdes (colonne de gauche - bordeaux)
    for (const table of triploidTables) {
      const cells = await createTableCells(table.id, 10); // Nombre de cellules par table
      results.triploid.push({ table, cellsUpdated: cells.length });
    }
    
    // Traiter les tables diploïdes (colonne de droite - bleue)
    for (const table of diploidTables) {
      const cells = await createTableCells(table.id, 10); // Nombre de cellules par table
      results.diploid.push({ table, cellsUpdated: cells.length });
    }
    
    res.status(200).json({
      success: true,
      message: 'Réorganisation des cellules terminée avec succès',
      data: results
    });
  } catch (error) {
    next(error);
  }
};
