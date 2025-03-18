import { useStore } from '@/lib/store';

// Liste des tâches d'exemple
export const exampleTasks = [
  {
    title: 'Contrôle qualité des huîtres lot #A22-B',
    description: 'Effectuer le contrôle de qualité complet des huîtres du lot #A22-B avant expédition. Vérifier taille, poids et aspect.',
    priority: 'high' as const,
    status: 'pending' as const,
    dueDate: '2025-03-15',
    category: 'Qualité',
    assignedTo: 'Sophie Dubois',
    estimatedTime: 3,
    tags: ['contrôle', 'expédition']
  },
  {
    title: 'Maintenance du système de filtration',
    description: 'Procéder à la maintenance mensuelle du système de filtration principal. Nettoyer les filtres et vérifier les pompes.',
    priority: 'medium' as const,
    status: 'in_progress' as const,
    dueDate: '2025-03-14',
    category: 'Maintenance',
    assignedTo: 'Jean Martin',
    estimatedTime: 5,
    tags: ['maintenance', 'filtration']
  },
  {
    title: 'Inventaire des équipements',
    description: 'Réaliser l\'inventaire complet des équipements ostréicoles et mettre à jour la base de données.',
    priority: 'low' as const,
    status: 'completed' as const,
    dueDate: '2025-03-10',
    category: 'Administratif',
    assignedTo: 'Marie Lambert',
    estimatedTime: 4,
    actualTime: 3.5,
    tags: ['inventaire', 'équipement']
  },
  {
    title: 'Formation des nouveaux employés',
    description: 'Organiser une session de formation pour les nouveaux employés sur les procédures de manipulation des huîtres.',
    priority: 'medium' as const,
    status: 'pending' as const,
    dueDate: '2025-03-20',
    category: 'Formation',
    assignedTo: 'Thomas Petit',
    estimatedTime: 6,
    tags: ['formation', 'ressources humaines']
  }
];

// Fonction pour initialiser le store avec des tâches d'exemple
export function initializeTasksInStore() {
  const store = useStore.getState();
  
  // Vérifier si des tâches existent déjà dans le store
  if (store.tasks.length === 0) {
    // Ajouter chaque tâche d'exemple au store
    exampleTasks.forEach(task => {
      store.addTask(task);
    });
    
    console.log('Store initialisé avec des tâches d\'exemple');
  } else {
    console.log('Le store contient déjà des tâches');
  }
}
