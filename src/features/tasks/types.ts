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
  estimatedHours?: number;
  actualHours?: number;
  delay?: number;
  comments?: {
    author: string;
    content: string;
    date: string;
    rating: number;
    attachments?: string[];
  }[];
  performance?: {
    efficiency: number;  // Pourcentage d'efficacité basé sur le temps estimé vs réel
    quality: number;     // Pourcentage de qualité (évaluation subjective)
    timeliness: number;  // Pourcentage de respect des délais
  };
}
