// Données pour les bassins
const poolData = [
  { 
    name: 'Bassin A1',
    value: 55, // Capacité utilisée combinée
    color: '#22c55e',
    type: 'Purification',
    capacity: 1000,
    currentLoad: 550,
    products: [
      { name: 'Moules', quantity: 500, unit: 'kg', color: '#3b82f6' }, // Bleu pour les moules
      { name: 'Palourdes', quantity: 6, unit: 'kg', color: '#ec4899' }  // Rose pour les palourdes
    ],
    waterQuality: {
      quality: 98,
      oxygen: 95,
      temperature: 12.5
    }
  },
  { 
    name: 'Bassin A2',
    value: 65,
    color: '#eab308',
    type: 'Purification',
    capacity: 1000,
    currentLoad: 650,
    products: [
      { name: 'Huîtres creuses', quantity: 600, unit: 'kg', color: '#84cc16' },
      { name: 'Coques', quantity: 50, unit: 'kg', color: '#f97316' }
    ],
    waterQuality: {
      quality: 92,
      oxygen: 88,
      temperature: 13.2
    }
  },
  { 
    name: 'Bassin B1',
    value: 90,
    color: '#ef4444', // Rouge car presque plein
    type: 'Stockage',
    capacity: 1500,
    currentLoad: 1350,
    products: [
      { name: 'Huîtres plates', quantity: 1200, unit: 'kg', color: '#8b5cf6' },
      { name: 'Bulots', quantity: 150, unit: 'kg', color: '#f59e0b' }
    ],
    waterQuality: {
      quality: 96,
      oxygen: 92,
      temperature: 12.8
    }
  }
];
