import React, { useState } from 'react';
import { Plus, Filter, Search, CheckCircle2, Clock, AlertCircle, Zap, CloudLightning, ScrollText, ListTodo, Shell, X } from 'lucide-react';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { TaskFilters } from '../components/TaskFilters';
import { TableDetailModal } from '../../dashboard/components/TableDetailModal.complete';
import { exampleTasks } from '../components/TaskBlock';
import { useStore } from '@/lib/store';
import './TasksPage.responsive.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Définition du type Task pour la page
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo?: string;
  category: string;
  location?: string;
  tags?: string[];
  estimatedTime?: number;
  actualTime?: number;
  dependencies?: string[];
  autoScore?: number;
  lastActivity?: string;
}

// Composant de carte réutilisable avec effet 3D prononcé
function StatCard({ 
  title, 
  value,
  icon,
  color,
  onClick
}: { 
  title: string; 
  value: number;
  icon: React.ReactNode; 
  color: string;
  onClick?: () => void;
}) {
  return (
    <div 
      className="task-stat-card relative overflow-hidden"
      style={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div className="relative z-10 p-5 flex items-center gap-5">
        <div className={`stat-icon-container ${color}`}>
          {icon}
        </div>
        <div className="stat-content">
          <h3 className="stat-value">{value}</h3>
          <p className="stat-title">{title}</p>
        </div>
        
        {/* Effet de brillance en arrière-plan */}
        <div className="absolute top-1/3 -right-8 w-32 h-32 rounded-full blur-3xl opacity-15" 
          style={{ background: `radial-gradient(circle, var(--${color}-600) 0%, transparent 70%)` }} />
      </div>
      
      {/* Effet de profondeur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent" />
      </div>
    </div>
  );
}

// Animation variants pour les modaux
const modalVariants = {
  hidden: {
    opacity: 0,
    transform: 'translate3d(0, 20px, 0)'
  },
  visible: {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    transform: 'translate3d(0, 20px, 0)',
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export function TasksPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const { session } = useStore();
  const isAdmin = session?.user?.role === 'admin';

  const handleTableClick = (table: any) => {
    navigate(`/tables/${table.id}`);
  };

  const handleCloseTableDetails = () => {
    setSelectedTable(null);
  };

  const openNewTaskModal = () => {
    setIsNewTaskModalOpen(true);
  };

  const closeNewTaskModal = () => {
    setIsNewTaskModalOpen(false);
  };

  // Calcul des statistiques à partir des tâches d'exemple
  const pendingTasks = exampleTasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = exampleTasks.filter(task => task.status === 'in_progress').length;
  const completedTasks = exampleTasks.filter(task => task.status === 'completed').length;
  const highPriorityTasks = exampleTasks.filter(task => task.priority === 'high').length;

  return (
    <div 
      className="task-page-container"
      style={{
        background: "linear-gradient(135deg, rgba(0, 10, 40, 0.97) 0%, rgba(0, 90, 90, 0.95) 100%)",
        WebkitBackdropFilter: "blur(20px)",
        backdropFilter: "blur(20px)"
      }}
    >
      {/* En-tête avec effet 3D */}
      <div className="task-page-header-wrapper">
        <div 
          className="task-page-header"
        >
          <div className="header-content">
            <div className="header-icon">
              <div className="icon-inner">
                <ScrollText size={32} />
              </div>
            </div>
            <div>
              <h1 className="header-title">
                Gestion des Tâches
              </h1>
              <p className="header-subtitle">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-2">
        {/* Barre de recherche et filtres */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
          </div>
        </div>

        {/* Stats des tâches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="En attente"
            value={pendingTasks}
            icon={<Clock size={22} />}
            color="yellow"
          />
          <StatCard
            title="En cours"
            value={inProgressTasks}
            icon={<Zap size={22} />}
            color="blue"
          />
          <StatCard
            title="Terminées"
            value={completedTasks}
            icon={<CheckCircle2 size={22} />}
            color="green"
          />
        </div>

        {/* Liste des tâches */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Liste des tâches</h2>
            <button
              onClick={openNewTaskModal}
              className="px-4 py-2.5 bg-brand-burgundy text-white rounded-lg hover:bg-brand-burgundy/90 transition-colors flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Nouvelle tâche</span>
            </button>
          </div>
          <TaskList searchQuery={searchQuery} />
        </div>
      </div>

      {/* Modal pour afficher les détails de la table */}
      <AnimatePresence>
        {selectedTable && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TableDetailModal
                table={selectedTable}
                onClose={handleCloseTableDetails}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de nouvelle tâche */}
      <AnimatePresence>
        {isNewTaskModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNewTaskModal}
          >
            <motion.div 
              className="w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
                WebkitBackdropFilter: "blur(8px)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease",
                willChange: "transform",
                transform: "translate3d(0,0,0)",
                borderRadius: "16px"
              }}
            >
              <style>
                {`
                  select {
                    background-color: rgba(255, 255, 255, 0.03) !important;
                    backdrop-filter: blur(8px) !important;
                    -webkit-backdrop-filter: blur(8px) !important;
                    border: none !important;
                    outline: none !important;
                  }
                  select option {
                    background-color: rgba(0, 10, 40, 0.95) !important;
                    color: white !important;
                    padding: 8px !important;
                  }
                `}
              </style>
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
              <div className="p-6">
                <TaskForm onClose={closeNewTaskModal} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}