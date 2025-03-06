import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Création du client Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Validation des variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables d\'environnement Supabase manquantes. Assurez-vous que SUPABASE_URL et SUPABASE_SERVICE_KEY sont définis.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Fonction utilitaire pour tester la connexion
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) throw error;
    
    return { success: true, message: 'Connexion à Supabase établie avec succès' };
  } catch (error) {
    console.error('Erreur de connexion à Supabase:', error.message);
    return { success: false, message: error.message };
  }
};
