/**
 * Service API de base pour communiquer avec le backend
 */

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Utilitaire pour construire les options de fetch
const buildOptions = (method: string, data?: any): RequestInit => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return options;
};

// Utilitaire pour gérer les erreurs de réponse
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
  }
  return response.json();
};

// API client de base
export const api = {
  /**
   * Effectue une requête GET
   */
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, buildOptions('GET'));
    return handleResponse(response);
  },

  /**
   * Effectue une requête POST
   */
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, buildOptions('POST', data));
    return handleResponse(response);
  },

  /**
   * Effectue une requête PUT
   */
  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, buildOptions('PUT', data));
    return handleResponse(response);
  },

  /**
   * Effectue une requête PATCH
   */
  patch: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, buildOptions('PATCH', data));
    return handleResponse(response);
  },

  /**
   * Effectue une requête DELETE
   */
  delete: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, buildOptions('DELETE'));
    return handleResponse(response);
  }
};
