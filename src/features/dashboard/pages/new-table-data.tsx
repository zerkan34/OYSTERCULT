// Données pour l'occupation des tables
const tableOccupancyData = [
  { 
    name: 'Table A1',
    value: 70, // Taux de remplissage à 70%
    color: '#22c55e',
    type: 'Huîtres sur cordes',
    currentSize: 'N°3', // Qualibré en cours: N°3
    targetSize: 'N°3', // Qualibré souhaité: N°3
    timeProgress: 100, // 100% du temps d'élevage écoulé
    startDate: '15/04/24', // Date de mise en eau
    harvest: '15/06/25', // Date de récolte prévue
    mortality: 17.5 // Taux de mortalité entre 15-25%
  },
  { 
    name: 'Table A2',
    value: 20, // Taux de remplissage à 20%
    color: '#ef4444', // Rouge pour alerter
    type: 'Huîtres sur cordes',
    currentSize: 'N°1', // Qualibré en cours: N°1 (dépassé)
    targetSize: 'N°2', // Qualibré souhaité: N°2
    timeProgress: 120, // 120% du temps écoulé (dépassé)
    startDate: '10/01/24',
    harvest: '20/03/25',
    mortality: 23.8, // Proche de la limite haute
    alert: 'Calibre dépassé' // Alerte spécifique
  },
  { 
    name: 'Table B1',
    value: 100, // Taux de remplissage à 100%
    color: '#eab308', // Jaune pour attirer l'attention
    type: 'Huîtres sur cordes',
    currentSize: 'N°5', // Qualibré en cours: N°5 (début)
    targetSize: 'N°3', // Qualibré souhaité: N°3
    timeProgress: 30, // 30% du temps écoulé
    startDate: '01/01/25',
    harvest: '01/03/26',
    mortality: 15.2 // Proche de la limite basse
  },
  { 
    name: 'Table B2',
    value: 0, // Table vide
    color: '#94a3b8', // Gris pour indiquer une table inactive
    type: 'Huîtres sur cordes',
    currentSize: 'N/A', // Pas de calibre en cours
    targetSize: 'N°3', // Calibre cible pour la prochaine utilisation
    timeProgress: 0, // 0% du temps écoulé
    startDate: 'N/A',
    harvest: 'N/A',
    mortality: 0,
    status: 'Vide' // Statut spécial
  }
];
