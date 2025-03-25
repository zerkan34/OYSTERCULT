import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { generateFriendCode } from '@/utils/friendCode';

// Données de test temporaires
const mockSuppliers = [
  {
    id: '1',
    name: 'Huîtres Marennes Oléron',
    email: 'contact@huitres-mo.fr',
    phone: '05 46 85 12 34',
    address: '12 Route des Claires, 17320 Marennes',
    friend_code: 'HMO17320',
    is_friend: true,
    deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Les Parcs de l\'Estuaire',
    email: 'commandes@parcs-estuaire.fr',
    phone: '05 46 36 45 78',
    address: '8 Quai des Ostréiculteurs, 17390 La Tremblade',
    friend_code: 'LPE17390',
    is_friend: true,
    deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Atlantique Coquillages',
    email: 'ventes@atlantique-coq.fr',
    phone: '02 51 68 23 45',
    address: '45 Avenue du Port, 85230 Bouin',
    friend_code: 'ACQ85230',
    is_friend: false,
    deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Cancale Premium',
    email: 'service@cancale-premium.fr',
    phone: '02 99 89 67 89',
    address: '23 Rue du Port, 35260 Cancale',
    friend_code: 'CAN35260',
    is_friend: true,
    deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Arcachon Huîtres',
    email: 'pro@arcachon-huitres.com',
    phone: '05 57 72 34 56',
    address: '56 Boulevard de la Plage, 33120 Arcachon',
    friend_code: 'ARC33120',
    is_friend: false,
    deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Données de test pour les produits
const mockProducts = {
  '1': [
    {
      id: '1',
      supplier_id: '1',
      name: 'Huîtres Spéciales N°3',
      description: 'Huîtres charnues de qualité supérieure, affinées en claire pendant 2 mois minimum',
      price: 8.50,
      unit: 'douzaine',
      category: 'Spéciales',
      image: '/placeholder.jpg',
      available: true,
      stock: 450,
      minOrder: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      supplier_id: '1',
      name: 'Huîtres Fines de Claire N°2',
      description: 'Huîtres raffinées, affinées en claire pendant 3 semaines minimum',
      price: 9.50,
      unit: 'douzaine',
      category: 'Fines de Claire',
      image: '/placeholder.jpg',
      available: true,
      stock: 300,
      minOrder: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  '2': [
    {
      id: '3',
      supplier_id: '2',
      name: 'Huîtres Spéciales N°2',
      description: 'Huîtres de qualité supérieure',
      price: 10.50,
      unit: 'douzaine',
      category: 'Spéciales',
      image: '/placeholder.jpg',
      available: true,
      stock: 200,
      minOrder: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  '3': [
    {
      id: '4',
      supplier_id: '3',
      name: 'Huîtres Plates de Belon',
      description: 'Huîtres plates de Belon, goût unique et iodé',
      price: 14.50,
      unit: 'douzaine',
      category: 'Plates',
      image: '/placeholder.jpg',
      available: true,
      stock: 150,
      minOrder: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  '4': [
    {
      id: '5',
      supplier_id: '4',
      name: 'Huîtres Label Rouge',
      description: 'Huîtres labellisées Label Rouge, qualité supérieure garantie',
      price: 12.00,
      unit: 'douzaine',
      category: 'Label Rouge',
      image: '/placeholder.jpg',
      available: true,
      stock: 400,
      minOrder: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  '5': [
    {
      id: '6',
      supplier_id: '5',
      name: 'Huîtres Gillardeau',
      description: 'Les célèbres huîtres Gillardeau, reconnues mondialement',
      price: 24.00,
      unit: 'douzaine',
      category: 'Premium',
      image: '/placeholder.jpg',
      available: true,
      stock: 100,
      minOrder: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  friend_code: string | null;
  is_friend: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  supplier_id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  available: boolean;
  stock: number;
  minOrder: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierDTO {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function useSuppliers() {
  const queryClient = useQueryClient();

  const { data: suppliers = mockSuppliers, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      // Pour le moment, on utilise les données mockées
      return mockSuppliers;
    }
  });

  const createSupplier = useMutation({
    mutationFn: async (data: CreateSupplierDTO) => {
      const friendCode = generateFriendCode();
      const newSupplier = {
        ...data,
        friend_code: friendCode,
        is_friend: false,
        deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Pour le moment, on simule l'ajout
      mockSuppliers.push({ ...newSupplier, id: String(mockSuppliers.length + 1) });
      return newSupplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    }
  });

  const updateSupplier = useMutation({
    mutationFn: async (data: { id: string; deleted?: boolean }) => {
      // Pour le moment, on simule la mise à jour (suppression)
      const index = mockSuppliers.findIndex(s => s.id === data.id);
      if (index !== -1 && data.deleted !== undefined) {
        mockSuppliers[index] = { 
          ...mockSuppliers[index], 
          deleted: data.deleted,
          updated_at: new Date().toISOString()
        };
      }
      return mockSuppliers[index];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    }
  });

  const getSupplierProducts = async (supplierId: string): Promise<Product[]> => {
    // Pour le moment, on retourne les données mockées
    return mockProducts[supplierId as keyof typeof mockProducts] || [];
  };

  return {
    suppliers,
    isLoading,
    createSupplier,
    updateSupplier,
    getSupplierProducts
  };
}
