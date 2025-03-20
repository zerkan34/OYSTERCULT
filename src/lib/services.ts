import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Task } from './firebase';

// Services utilisateur
export const userServices = {
  async getUsers() {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('status', '==', 'active'), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
  },

  async getUserById(id: string) {
    const userRef = doc(db, 'users', id);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return null;
    return { id: userDoc.id, ...userDoc.data() } as User;
  },

  async createUser(id: string, user: Omit<User, 'id'>) {
    const userRef = doc(db, 'users', id);
    await setDoc(userRef, {
      ...user,
      createdAt: Timestamp.now()
    });
  },

  async updateUser(id: string, data: Partial<User>) {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  async deleteUser(id: string) {
    const userRef = doc(db, 'users', id);
    await deleteDoc(userRef);
  }
};

// Services des tâches
export const taskServices = {
  async getTasks(filters?: { status?: string; priority?: string; assignedTo?: string }) {
    const tasksRef = collection(db, 'tasks');
    let q = query(tasksRef, orderBy('createdAt', 'desc'));

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.priority) {
      q = query(q, where('priority', '==', filters.priority));
    }
    if (filters?.assignedTo) {
      q = query(q, where('assignedTo', '==', filters.assignedTo));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
  },

  async getTaskById(id: string) {
    const taskRef = doc(db, 'tasks', id);
    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) return null;
    return { id: taskDoc.id, ...taskDoc.data() } as Task;
  },

  async createTask(task: Omit<Task, 'id'>) {
    const taskRef = doc(collection(db, 'tasks'));
    const now = Timestamp.now();
    await setDoc(taskRef, {
      ...task,
      createdAt: now,
      updatedAt: now
    });
    return taskRef.id;
  },

  async updateTask(id: string, data: Partial<Task>) {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  async deleteTask(id: string) {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
  },

  async completeTask(id: string, userId: string) {
    const taskRef = doc(db, 'tasks', id);
    const now = Timestamp.now();
    await updateDoc(taskRef, {
      status: 'completed',
      completedAt: now,
      completedBy: userId,
      updatedAt: now
    });
  }
};

// Services des commentaires et historique
export const taskCommentServices = {
  async addComment(taskId: string, content: string, parentId?: string) {
    const commentsRef = collection(db, 'tasks', taskId, 'comments');
    const commentRef = doc(commentsRef);
    const now = Timestamp.now();
    await setDoc(commentRef, {
      content,
      parentId,
      createdAt: now,
      updatedAt: now
    });
    return commentRef.id;
  },

  async getComments(taskId: string) {
    const commentsRef = collection(db, 'tasks', taskId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async updateTaskPerformance(taskId: string, actualHours: number) {
    const taskRef = doc(db, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) return;

    const task = taskDoc.data() as Task;
    const performance = (task.estimatedHours / actualHours) * 100;

    // Mettre à jour la tâche
    await updateDoc(taskRef, {
      actualHours,
      performance,
      updatedAt: Timestamp.now()
    });

    // Ajouter à l'historique
    const historyRef = collection(db, 'tasks', taskId, 'history');
    const historyDoc = doc(historyRef);
    await setDoc(historyDoc, {
      action: 'updated',
      changes: {
        actualHours,
        performance
      },
      timestamp: Timestamp.now()
    });
  },

  async getTaskHistory(taskId: string) {
    const historyRef = collection(db, 'tasks', taskId, 'history');
    const q = query(historyRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};
