export const mockSuppliers = [
  {
    id: 'HBC',
    name: 'Huîtres Bouzigues.com',
    email: 'contact@huitres-bouzigues.com',
    phone: '04 67 43 XX XX',
    address: 'Zone Conchylicole, 34140 Bouzigues',
    friend_code: 'HBC34BZ',
    is_friend: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'EW',
    name: 'ERWEMA',
    email: 'contact@erwema.fr',
    phone: '04 67 46 XX XX',
    address: 'Port de pêche, 34200 Sète',
    friend_code: 'EW34SE',
    is_friend: true,
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  },
  {
    id: 'CDB',
    name: 'Société CDB',
    email: 'contact@societe-cdb.fr',
    phone: '02 97 56 XX XX',
    address: 'Zone Conchylicole, 56950 Crac\'h',
    friend_code: 'CDB56CR',
    is_friend: true,
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z'
  },
  {
    id: 'TB',
    name: 'Tarbouriech',
    email: 'contact@tarbouriech.fr',
    phone: '04 67 77 XX XX',
    address: 'Lagune de Thau, 34340 Marseillan',
    friend_code: 'TB34MA',
    is_friend: true,
    created_at: '2025-01-04T00:00:00Z',
    updated_at: '2025-01-04T00:00:00Z'
  }
];

export const mockProducts = [
  // Produits de CDB - Coquillages De Bretagne
  {
    id: '1',
    supplier_id: '1',
    name: 'Huîtres Spéciales de Bretagne N°2',
    description: 'Huîtres charnues de Bretagne Sud, calibre 2',
    price: 12.50,
    unit: 'douzaine',
    category: 'Huîtres',
    stock: 150,
    min_order: 5,
    image_url: '/images/products/huitres-speciales.jpg',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    supplier_id: '1',
    name: 'Huîtres Fines de Bretagne N°3',
    description: 'Huîtres fines de Bretagne Sud, calibre 3',
    price: 9.50,
    unit: 'douzaine',
    category: 'Huîtres',
    stock: 200,
    min_order: 5,
    image_url: '/images/products/huitres-fines.jpg',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    supplier_id: '1',
    name: 'Palourdes de Bretagne',
    description: 'Palourdes sauvages de la baie de Quiberon',
    price: 18.00,
    unit: 'kilo',
    category: 'Coquillages',
    stock: 50,
    min_order: 2,
    image_url: '/images/products/palourdes.jpg',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // Produits de HUITRES GILLARDEAU
  {
    id: '4',
    supplier_id: '2',
    name: 'Moules de la Charente',
    description: 'Moules fraîches de la Charente',
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
    description: 'Palourdes pêchées dans la Charente',
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

  // Produits de TARBOURIECH
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
        name: 'Huîtres Spéciales de Cadoret N°3',
        quantity: 10,
        price: 8.50
      }
    ],
    total_amount: 85.00,
    created_at: '2025-02-26T10:00:00Z',
    updated_at: '2025-02-26T10:00:00Z'
  }
];
