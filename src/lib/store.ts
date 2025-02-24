import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Batch } from '@/features/traceability/types';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  category: string;
  assignedTo?: string;
  estimatedTime?: number;
  actualTime?: number;
  dependencies?: string[];
  tags?: string[];
  autoScore?: number;
  lastActivity?: string;
}

interface Notification {
  id: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  important: boolean;
  category: 'system' | 'task' | 'inventory' | 'quality' | 'hr';
  link?: string;
  metadata?: {
    taskId?: string;
    batchId?: string;
    employeeId?: string;
  };
}

interface Store {
  session: any | null;
  sidebarCollapsed: boolean;
  tasks: Task[];
  notifications: Notification[];
  unreadCount: number;
  theme: 'dark' | 'light';
  batches: Batch[];
  setSession: (session: any | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  addBatch: (batch: Batch) => void;
  updateBatch: (id: string, updatedBatch: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      session: null,
      sidebarCollapsed: false,
      tasks: [],
      notifications: [],
      unreadCount: 0,
      theme: 'dark',
      batches: [
        {
          id: '1',
          batchNumber: 'LOT-2025-001',
          type: 'Huîtres Plates N°3',
          quantity: 5000,
          location: 'Zone Nord - Table A1',
          status: 'table1',
          perchNumber: 12,
          startDate: '2025-01-15',
          harvestDate: '2025-06-15',
          supplier: 'Naissain Express',
          qualityScore: 92,
          lastCheck: '2025-02-19'
        },
        {
          id: '2',
          batchNumber: 'LOT-2025-002',
          type: 'Huîtres Creuses N°2',
          quantity: 8000,
          location: 'Zone Sud - Table B3',
          status: 'table2',
          perchNumber: 25,
          startDate: '2025-01-20',
          harvestDate: '2025-06-20',
          supplier: 'Naissain Express',
          qualityScore: 78,
          lastCheck: '2025-02-19'
        }
      ],

      setSession: (session) => set({ session }),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          read: false
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },

      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1
      })),

      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0
      })),

      setTheme: (theme) => set({ theme }),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),

      addBatch: (batch) => set((state) => ({
        batches: [...state.batches, batch]
      })),

      updateBatch: (id, updatedBatch) => set((state) => ({
        batches: state.batches.map((batch) =>
          batch.id === id ? { ...batch, ...updatedBatch } : batch
        )
      })),

      deleteBatch: (id) => set((state) => ({
        batches: state.batches.filter((batch) => batch.id !== id)
      })),
    }),
    {
      name: 'oyster-cult-storage'
    }
  )
);