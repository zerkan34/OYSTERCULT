export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  category?: string;
  assignedTo?: string;
  location?: string;
  progress?: number;
  comments?: {
    author: string;
    content: string;
    date: string;
    rating: number;
    attachments?: string[];
  }[];
}
