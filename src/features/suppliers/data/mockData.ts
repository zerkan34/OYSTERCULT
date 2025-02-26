export const mockSuppliers = [
  {
    id: '1',
    name: 'Océan Frais SARL',
    email: 'contact@oceanfrais.fr',
    phone: '01 23 45 67 89',
    address: '15 Rue de la Mer, 44000 Nantes',
    friend_code: 'OF44NANT',
    is_friend: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Huîtres Premium',
    email: 'commandes@huitrespremium.fr',
    phone: '02 34 56 78 90',
    address: '8 Avenue des Parcs, 17320 Marennes',
    friend_code: 'HP17MAR',
    is_friend: true,
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  }
];

export const mockProducts = [
  {
    id: '1',
    supplier_id: '1',
    name: 'Huîtres Spéciales N°3',
    description: 'Huîtres de qualité supérieure, calibre 3',
    price: 8.50,
    unit: 'douzaine',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    supplier_id: '1',
    name: 'Huîtres Fines de Claire N°2',
    description: 'Huîtres affinées en claire, calibre 2',
    price: 9.50,
    unit: 'douzaine',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

export const mockOrders = [
  {
    id: '1',
    supplier_id: '1',
    status: 'pending',
    products: [
      {
        id: '1',
        name: 'Huîtres Spéciales N°3',
        quantity: 10,
        price: 8.50
      }
    ],
    total_amount: 85.00,
    created_at: '2025-02-26T10:00:00Z',
    updated_at: '2025-02-26T10:00:00Z'
  }
];
