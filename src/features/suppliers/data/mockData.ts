export const mockSuppliers = [
  {
    id: '1',
    name: 'REGIS ROQUE LE BOGOSS',
    email: 'regis.roque@huitres-bouzigues.fr',
    phone: '04 67 43 XX XX',
    address: '23 Quai du Port, 34140 Bouzigues',
    friend_code: 'RR34BOU',
    is_friend: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Les Parcs de Mèze',
    email: 'contact@parcs-meze.fr',
    phone: '04 67 43 XX XX',
    address: '12 Quai Baptiste Guitard, 34140 Mèze',
    friend_code: 'PM34MEZ',
    is_friend: true,
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Coquillages Marseillanais',
    email: 'commandes@coquillages-marseillan.fr',
    phone: '04 67 77 XX XX',
    address: '5 Port de Marseillan, 34340 Marseillan',
    friend_code: 'CM34MAR',
    is_friend: true,
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z'
  }
];

export const mockProducts = [
  // Produits de REGIS ROQUE LE BOGOSS
  {
    id: '1',
    supplier_id: '1',
    name: 'Huîtres Spéciales de Bouzigues N°2',
    description: 'Huîtres charnues de l\'étang de Thau, calibre 2',
    price: 12.50,
    unit: 'douzaine',
    category: 'Huîtres',
    min_order_quantity: 2,
    stock: 500,
    image: '/products/huitres-speciales.jpg',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    supplier_id: '1',
    name: 'Huîtres Fines de Bouzigues N°3',
    description: 'Huîtres fines et délicates, calibre 3',
    price: 9.50,
    unit: 'douzaine',
    category: 'Huîtres',
    min_order_quantity: 2,
    stock: 800,
    image: '/products/huitres-fines.jpg',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    supplier_id: '1',
    name: 'Plateau Dégustation Premium',
    description: 'Assortiment de nos meilleures huîtres (24 pièces)',
    price: 38.00,
    unit: 'plateau',
    category: 'Plateaux',
    min_order_quantity: 1,
    stock: 50,
    image: '/products/plateau-premium.jpg',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // Produits des Parcs de Mèze
  {
    id: '4',
    supplier_id: '2',
    name: 'Moules de l\'étang',
    description: 'Moules fraîches de l\'étang de Thau',
    price: 6.50,
    unit: 'kilo',
    category: 'Moules',
    min_order_quantity: 2,
    stock: 200,
    image: '/products/moules.jpg',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  },
  {
    id: '5',
    supplier_id: '2',
    name: 'Palourdes sauvages',
    description: 'Palourdes pêchées dans l\'étang de Thau',
    price: 15.00,
    unit: 'kilo',
    category: 'Coquillages',
    min_order_quantity: 1,
    stock: 100,
    image: '/products/palourdes.jpg',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  },
  {
    id: '6',
    supplier_id: '2',
    name: 'Tellines fraîches',
    description: 'Tellines pêchées sur les plages locales',
    price: 18.00,
    unit: 'kilo',
    category: 'Coquillages',
    min_order_quantity: 0.5,
    stock: 50,
    image: '/products/tellines.jpg',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  },

  // Produits de Coquillages Marseillanais
  {
    id: '7',
    supplier_id: '3',
    name: 'Huîtres de Marseillan N°4',
    description: 'Huîtres moyennes idéales pour la dégustation',
    price: 7.50,
    unit: 'douzaine',
    category: 'Huîtres',
    min_order_quantity: 2,
    stock: 600,
    image: '/products/huitres-marseillan.jpg',
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z'
  },
  {
    id: '8',
    supplier_id: '3',
    name: 'Moules de Méditerranée',
    description: 'Moules de pleine mer',
    price: 7.00,
    unit: 'kilo',
    category: 'Moules',
    min_order_quantity: 2,
    stock: 150,
    image: '/products/moules-med.jpg',
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z'
  },
  {
    id: '9',
    supplier_id: '3',
    name: 'Plateau Fruits de Mer',
    description: 'Assortiment varié de fruits de mer (pour 2 personnes)',
    price: 45.00,
    unit: 'plateau',
    category: 'Plateaux',
    min_order_quantity: 1,
    stock: 30,
    image: '/products/plateau-mer.jpg',
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z'
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
        name: 'Huîtres Spéciales de Bouzigues N°3',
        quantity: 10,
        price: 8.50
      }
    ],
    total_amount: 85.00,
    created_at: '2025-02-26T10:00:00Z',
    updated_at: '2025-02-26T10:00:00Z'
  }
];
