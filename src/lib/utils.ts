import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  if (isToday(d)) {
    return `Aujourd'hui à ${format(d, 'HH:mm')}`;
  }
  if (isYesterday(d)) {
    return `Hier à ${format(d, 'HH:mm')}`;
  }
  if (isThisWeek(d)) {
    return format(d, 'EEEE à HH:mm', { locale: fr });
  }
  return format(d, 'PPp', { locale: fr });
};

export const generateMockData = () => {
  const store = {
    tasks: [
      {
        id: '1',
        title: 'Inspection des tables',
        description: 'Vérification de l\'état des tables de production',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2025-02-20',
        category: 'maintenance',
        assignedTo: 'Jean Dupont',
        createdAt: '2025-02-19T08:00:00',
        updatedAt: '2025-02-19T08:00:00',
        estimatedHours: 2.5,
        isRecurring: false,
        tags: ['inspection', 'maintenance'],
      },
      {
        id: '2',
        title: 'Maintenance des équipements',
        description: 'Entretien régulier des équipements de production',
        status: 'pending',
        priority: 'medium',
        dueDate: '2025-02-22',
        category: 'maintenance',
        assignedTo: 'Marie Martin',
        createdAt: '2025-02-19T09:00:00',
        updatedAt: '2025-02-19T09:00:00',
        estimatedHours: 4,
        isRecurring: true,
        recurrencePattern: 'weekly',
        tags: ['maintenance', 'équipement'],
      },
    ],
    comments: [
      {
        id: '1',
        taskId: '1',
        content: 'Inspection terminée pour les tables 1-5. Quelques réparations mineures nécessaires.',
        userId: 'jean.dupont',
        createdAt: '2025-02-19T14:30:00',
        attachments: ['rapport-inspection.pdf', 'photo-table-3.jpg'],
      },
      {
        id: '2',
        taskId: '1',
        content: 'J\'ai programmé les réparations pour demain matin.',
        userId: 'marie.martin',
        createdAt: '2025-02-19T15:45:00',
        attachments: [],
      },
    ],
    notifications: [
      {
        id: '1',
        type: 'warning',
        title: 'Tâche en retard',
        message: 'L\'inspection des tables est en retard de 2 jours',
        timestamp: '2025-02-19T10:30:00',
        read: false,
        taskId: '1',
      },
      {
        id: '2',
        type: 'success',
        title: 'Tâche terminée',
        message: 'Marie Martin a terminé la maintenance des équipements',
        timestamp: '2025-02-19T09:15:00',
        read: false,
        taskId: '2',
      },
    ],
  };

  return store;
};