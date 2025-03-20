import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  department?: string;
  position?: string;
  status: 'active' | 'inactive';
  createdAt: number;
  updatedAt?: number;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: number;
  parentId?: string; // Pour les réponses aux commentaires
}

export interface TaskHistory {
  id: string;
  taskId: string;
  userId: string;
  action: 'created' | 'updated' | 'completed' | 'commented';
  timestamp: number;
  changes?: Partial<Task>;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  estimatedHours: number;
  actualHours?: number; // Temps réel passé sur la tâche
  performance?: number; // Ratio estimatedHours/actualHours
  isRecurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  tags?: string[];
  dueDate: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  completedBy?: string;
  comments?: Comment[];
  history?: TaskHistory[];
}

// Services pour les tâches
export const taskServices = {
  // Existant...
  
  // Ajouter un commentaire
  async addComment(taskId: string, content: string, parentId?: string) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const commentRef = await addDoc(collection(db, 'comments'), {
      taskId,
      userId: user.uid,
      content,
      parentId,
      createdAt: Date.now()
    });

    // Ajouter à l'historique
    await addDoc(collection(db, 'taskHistory'), {
      taskId,
      userId: user.uid,
      action: 'commented',
      timestamp: Date.now()
    });

    return commentRef.id;
  },

  // Obtenir les commentaires d'une tâche
  async getComments(taskId: string) {
    const q = query(
      collection(db, 'comments'),
      where('taskId', '==', taskId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
  },

  // Mettre à jour le temps réel et calculer le rendement
  async updateTaskPerformance(taskId: string, actualHours: number) {
    const taskRef = doc(db, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) throw new Error('Task not found');
    
    const task = taskDoc.data() as Task;
    const performance = (task.estimatedHours / actualHours) * 100;

    await updateDoc(taskRef, {
      actualHours,
      performance,
      updatedAt: Date.now()
    });

    // Ajouter à l'historique
    await addDoc(collection(db, 'taskHistory'), {
      taskId,
      userId: auth.currentUser?.uid,
      action: 'updated',
      timestamp: Date.now(),
      changes: { actualHours, performance }
    });
  },

  // Obtenir l'historique d'une tâche
  async getTaskHistory(taskId: string) {
    const q = query(
      collection(db, 'taskHistory'),
      where('taskId', '==', taskId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TaskHistory[];
  }
};
