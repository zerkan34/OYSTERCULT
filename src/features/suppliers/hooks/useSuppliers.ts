import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { generateFriendCode } from '@/utils/friendCode';

// Données de test temporaires
const mockSuppliers = [
  {
    id: 'HBC',
    name: 'Huîtres Bouzigues.com',
    email: 'contact@huitres-bouzigues.com',
    phone: '04 67 43 XX XX',
    address: 'Zone Conchylicole, 34140 Bouzigues',
    friend_code: 'HBC34BZ',
    is_friend: true,
    deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'EW',
    name: 'ERWEMA',
    email: 'contact@erwema.fr',
    phone: '04 67 46 XX XX',
    address: 'Port de pêche, 34200 Sète',
    friend_code: 'EW34SE',
    is_friend: true,
    deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'CDB',
    name: 'Société CDB',
    email: 'contact@societe-cdb.fr',
    phone: '02 97 56 XX XX',
    address: 'Zone Conchylicole, 56950 Crac\'h',
    friend_code: 'CDB56CR',
    is_friend: true,
    deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'TB',
    name: 'Tarbouriech',
    email: 'contact@tarbouriech.fr',
    phone: '04 67 77 XX XX',
    address: 'Lagune de Thau, 34340 Marseillan',
    friend_code: 'TB34MA',
    is_friend: true,
    deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Données de test pour les produits
const mockProducts = {
  'HBC': [
    {
      id: '1',
      supplier_id: 'HBC',
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
      supplier_id: 'HBC',
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
  'EW': [
    {
      id: '3',
      supplier_id: 'EW',
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
  'CDB': [
    {
      id: '4',
      supplier_id: 'CDB',
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
  'TB': [
    {
      id: '5',
      supplier_id: 'TB',
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
  min_order_quantity?: number;
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
