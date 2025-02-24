import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  User,
  Calendar,
  Star,
  Tag,
  MapPin,
  ArrowRight,
  Send,
  MessageSquare
} from 'lucide-react';
import { TaskDetails } from './TaskDetails';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStore } from '@/lib/store';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'sent' | 'received' | 'in_progress' | 'completed' | 'problem';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: {
    name: string;
    avatar?: string;
  };
  location?: string;
  progress?: number;
  tags?: string[];
  estimatedTime?: number;
  actualTime?: number;
}

const statusColors = {
  sent: 'bg-blue-500/20 text-blue-300',
  received: 'bg-yellow-500/20 text-yellow-300',
  in_progress: 'bg-purple-500/20 text-purple-300',
  completed: 'bg-green-500/20 text-green-300',
  problem: 'bg-red-500/20 text-red-300'
};

const statusLabels = {
  sent: 'ENVOYÉ',
  received: 'REÇUE',
  in_progress: 'EN COURS',
  completed: 'TERMINÉ',
  problem: 'PROBLÈME'
};

const statusIcons = {
  sent: Send,
  received: CheckCircle2,
  in_progress: Clock,
  completed: CheckCircle2,
  problem: AlertCircle
};

interface TaskListProps {
  searchQuery: string;
}

export function TaskList({ searchQuery }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const { session } = useStore();
  const isAdmin = session?.user?.role === 'admin';

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Inspection des tables',
      description: 'Vérification de l\'état des tables de production',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2025-02-20',
      assignedTo: {
        name: 'Jean Dupont'
      },
      location: 'Zone Nord - Table A1',
      progress: 65,
      tags: ['inspection', 'maintenance'],
      estimatedTime: 2.5,
      actualTime: 2
    },
    {
      id: '2',
      title: 'Maintenance des équipements',
      description: 'Entretien régulier des équipements de production',
      status: 'sent',
      priority: 'medium',
      dueDate: '2025-02-22',
      assignedTo: {
        name: 'Marie Martin'
      },
      location: 'Atelier principal',
      progress: 0,
      tags: ['maintenance', 'équipement'],
      estimatedTime: 4,
      actualTime: 0
    }
  ];

  const filteredTasks = mockTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateEfficiency = (task: Task) => {
    if (!task.estimatedTime || !task.actualTime) return null;
    const efficiency = (task.estimatedTime / task.actualTime) * 100;
    return Math.round(efficiency);
  };

  return (
    <>
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {filteredTasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          const efficiency = calculateEfficiency(task);

          return (
            <motion.div 
              key={task.id}
              className="glass-effect rounded-lg hover:glass-effect-hover cursor-pointer group"
              onClick={() => setSelectedTask(task)}
              onHoverStart={() => setHoveredTaskId(task.id)}
              onHoverEnd={() => setHoveredTaskId(null)}
              whileHover={{ y: -2 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-white group-hover:text-brand-burgundy transition-colors">
                        {task.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm flex items-center ${statusColors[task.status]}`}>
                        <StatusIcon size={16} className="mr-1.5" />
                        {statusLabels[task.status]}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-sm text-white/70 group-hover:text-white/90 transition-colors">
                      {task.description}
                    </p>

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-4">
                        <Tag size={16} className="text-white/40" />
                        <div className="flex space-x-2">
                          {task.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center space-x-6 text-sm text-white/60">
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        {task.assignedTo.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {format(new Date(task.dueDate), 'PPP', { locale: fr })}
                      </div>
                      {task.location && (
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          {task.location}
                        </div>
                      )}
                      {isAdmin && task.status === 'completed' && efficiency !== null && (
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2" />
                          <span className={
                            efficiency >= 100 ? 'text-green-400' :
                            efficiency >= 80 ? 'text-yellow-400' :
                            'text-red-400'
                          }>
                            Rendement: {efficiency}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <motion.div 
                    className="flex items-center space-x-2"
                    animate={{ opacity: hoveredTaskId === task.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                      <Star size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                      <MessageSquare size={20} />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Indicateur de hover */}
                <motion.div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-burgundy"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: hoveredTaskId === task.id ? 1 : 0,
                    x: hoveredTaskId === task.id ? 0 : -10
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight size={24} />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {selectedTask && (
          <TaskDetails 
            task={selectedTask}
            onClose={() => setSelectedTask(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}