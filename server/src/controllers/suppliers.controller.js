import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Récupérer tous les fournisseurs
 */
export const getAllSuppliers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
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
 * Récupérer les fournisseurs "amis"
 */
export const getFriendSuppliers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('is_friend', true)
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
 * Récupérer un fournisseur spécifique par ID
 */
export const getSupplierById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Fournisseur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau fournisseur
 */
export const createSupplier = async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      address, 
      friend_code,
      is_friend = false
    } = req.body;
    
    // Préparer les données pour l'insertion
    const supplierData = {
      name,
      email,
      phone,
      address,
      friend_code,
      is_friend
    };
    
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplierData)
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
 * Mettre à jour un fournisseur
 */
export const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Vérifier si le fournisseur existe
    const { data: existingSupplier, error: fetchError } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        message: 'Fournisseur non trouvé'
      });
    }
    
    const { data, error } = await supabase
      .from('suppliers')
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
 * Supprimer un fournisseur
 */
export const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le fournisseur existe
    const { data: existingSupplier, error: fetchError } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        message: 'Fournisseur non trouvé'
      });
    }
    
    // Supprimer d'abord les produits associés
    const { error: deleteProductsError } = await supabase
      .from('supplier_products')
      .delete()
      .eq('supplier_id', id);
      
    if (deleteProductsError) throw deleteProductsError;
    
    // Vérifier les commandes existantes
    const { data: orders, error: ordersError } = await supabase
      .from('supplier_orders')
      .select('id')
      .eq('supplier_id', id);
      
    if (ordersError) throw ordersError;
    
    if (orders && orders.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer ce fournisseur car il a des commandes associées',
        details: `${orders.length} commande(s) trouvée(s)`
      });
    }
    
    // Puis supprimer le fournisseur
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Fournisseur supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les produits d'un fournisseur
 */
export const getSupplierProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le fournisseur existe
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (supplierError) throw supplierError;
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Fournisseur non trouvé'
      });
    }
    
    // Récupérer les produits du fournisseur
    const { data: products, error: productsError } = await supabase
      .from('supplier_products')
      .select('*')
      .eq('supplier_id', id)
      .order('name');
      
    if (productsError) throw productsError;

    res.status(200).json({
      success: true,
      supplier: supplier,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter un produit à un fournisseur
 */
export const addSupplierProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, unit } = req.body;
    
    // Vérifier si le fournisseur existe
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (supplierError) throw supplierError;
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Fournisseur non trouvé'
      });
    }
    
    // Créer le nouveau produit
    const productData = {
      supplier_id: id,
      name,
      description: description || '',
      price,
      unit
    };
    
    const { data, error } = await supabase
      .from('supplier_products')
      .insert(productData)
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
 * Créer une commande fournisseur
 */
export const createSupplierOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { products, total_amount, storage_location, expiry_date } = req.body;
    
    // Vérifier si le fournisseur existe
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (supplierError) throw supplierError;
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Fournisseur non trouvé'
      });
    }
    
    // Vérifier que les produits sont valides
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La commande doit contenir au moins un produit'
      });
    }
    
    // Créer la commande
    const orderData = {
      supplier_id: id,
      status: 'pending',
      products: products, // JSONB
      total_amount,
      storage_location: storage_location || 'Stock principal',
      expiry_date: expiry_date || null
    };
    
    const { data, error } = await supabase
      .from('supplier_orders')
      .insert(orderData)
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
 * Récupérer les commandes d'un fournisseur
 */
export const getSupplierOrders = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le fournisseur existe
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (supplierError) throw supplierError;
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Fournisseur non trouvé'
      });
    }
    
    // Récupérer les commandes du fournisseur
    const { data: orders, error: ordersError } = await supabase
      .from('supplier_orders')
      .select('*')
      .eq('supplier_id', id)
      .order('created_at', { ascending: false });
      
    if (ordersError) throw ordersError;

    res.status(200).json({
      success: true,
      supplier: supplier,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
