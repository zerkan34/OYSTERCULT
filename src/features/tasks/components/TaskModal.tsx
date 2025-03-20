import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
    status: "pending" | "in_progress" | "completed";
  }) => Promise<void>;
  initialTask?: {
    title: string;
    description: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
    status: "pending" | "in_progress" | "completed";
  };
}

export const TaskModal = ({ isOpen, onClose, onSubmit, initialTask }: TaskModalProps) => {
  const [task, setTask] = useState(initialTask || {
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as const,
    status: 'pending' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(task);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {initialTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Titre</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Description</label>
            <textarea
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Date d'échéance</label>
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-1">Priorité</label>
              <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value as "high" | "medium" | "low" })}
                className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              {initialTask ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
