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

interface CompanyInfo {
  name: string;
  siret: string;
  logo?: string;
  description?: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface User {
  id: string;
  role?: string;
  // Add user properties here
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
}

interface Purchase {
  id: string;
  productName: string;
  supplier: string; // ID du fournisseur
  quantity: number;
  unit: string;
  unitPrice: number;
  expiryDate: string;
  storageLocation: string;
  purchaseDate: string;
  invoiceNumber: string;
  notes?: string;
}

interface Store {
  session: any | null;
  sidebarCollapsed: boolean;
  tasks: Task[];
  notifications: Notification[];
  unreadCount: number;
  theme: 'dark' | 'light';
  batches: Batch[];
  companyInfo: CompanyInfo | null;
  users: User[];
  roles: Role[];
  suppliers: Supplier[];
  purchases: Purchase[];
  setSession: (session: any | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  addBatch: (batch: Omit<Batch, 'id'>) => void;
  updateBatch: (id: string, batch: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;
  setCompanyInfo: (info: CompanyInfo) => void;
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addRole: (roleData: Omit<Role, 'id'>) => void;
  updateRole: (id: string, roleData: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  updatePurchase: (id: string, purchase: Partial<Purchase>) => void;
  deletePurchase: (id: string) => void;
  resetSession: () => void;
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
      batches: [{
        id: '1',
        batchNumber: 'LOT-TEST-001',
        type: 'Plates',
        quantity: 100,
        status: 'table1',
        perchNumber: 1,
        startDate: new Date().toISOString(),
      }],
      companyInfo: null,
      users: [],
      roles: [
        {
          id: '1',
          name: 'Administrateur',
          description: 'Gestion complète de l\'application'
        },
        {
          id: '2',
          name: 'Manager',
          description: 'Gestion des équipes et des tâches'
        },
        {
          id: '3',
          name: 'Opérateur',
          description: 'Gestion des lots et des tâches quotidiennes'
        }
      ],
      suppliers: [],
      purchases: [],

      setSession: (session) => set({ session }),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      addNotification: (notification) => set((state) => {
        const newNotification = {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          read: false,
        };
        return {
          notifications: [...state.notifications, newNotification],
          unreadCount: state.unreadCount + 1,
        };
      }),

      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      })),

      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      })),

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      addBatch: (batch) => set((state) => ({
        batches: [...state.batches, { ...batch, id: crypto.randomUUID() }]
      })),

      updateBatch: (id, batch) => set((state) => ({
        batches: state.batches.map(batch => 
          batch.id === id ? { ...batch, ...batch } : batch
        )
      })),

      deleteBatch: (id) => set((state) => ({
        batches: state.batches.filter(batch => batch.id !== id)
      })),

      setCompanyInfo: (info) => set({ companyInfo: info }),

      addUser: (userData) => set((state) => ({
        users: [...state.users, { ...userData, id: crypto.randomUUID() }]
      })),

      updateUser: (id, userData) => set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...userData } : user
        )
      })),

      deleteUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),

      addRole: (roleData) => set((state) => ({
        roles: [...state.roles, { ...roleData, id: crypto.randomUUID() }]
      })),

      updateRole: (id, roleData) => set((state) => ({
        roles: state.roles.map(role => 
          role.id === id ? { ...role, ...roleData } : role
        )
      })),

      deleteRole: (id) => set((state) => ({
        roles: state.roles.filter(role => role.id !== id)
      })),

      addSupplier: (supplierData) => set((state) => ({
        suppliers: [...state.suppliers, { ...supplierData, id: crypto.randomUUID() }]
      })),

      updateSupplier: (id, supplierData) => set((state) => ({
        suppliers: state.suppliers.map(supplier => 
          supplier.id === id ? { ...supplier, ...supplierData } : supplier
        )
      })),

      deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter(supplier => supplier.id !== id)
      })),

      addPurchase: (purchaseData) => set((state) => ({
        purchases: [...state.purchases, { ...purchaseData, id: crypto.randomUUID() }]
      })),

      updatePurchase: (id, purchaseData) => set((state) => ({
        purchases: state.purchases.map(purchase => 
          purchase.id === id ? { ...purchase, ...purchaseData } : purchase
        )
      })),

      deletePurchase: (id) => set((state) => ({
        purchases: state.purchases.filter(purchase => purchase.id !== id)
      })),

      resetSession: () => set({ session: null }),
    }),
    {
      name: 'oyster-cult-storage',
      partialize: (state) => ({
        companyInfo: state.companyInfo,
        users: state.users,
        batches: state.batches,
        theme: state.theme,
        roles: state.roles,
        suppliers: state.suppliers,
        purchases: state.purchases,
      })
    }
  )
);