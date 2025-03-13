import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Search, CheckCircle2, Clock, AlertCircle, Zap, CloudLightning, ScrollText, ListTodo } from 'lucide-react';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { TaskFilters } from '../components/TaskFilters';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { exampleTasks } from '../components/TaskBlock';
import { useStore } from '@/lib/store';
import './TasksPage.responsive.css';

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30 
    } 
  }
};

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
    <motion.div 
      className="task-stat-card relative overflow-hidden"
      variants={itemVariants}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 } 
      }}
      onClick={onClick}
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
    </motion.div>
  );
}

export function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { session } = useStore();
  const isAdmin = session?.user?.role === 'admin';

  // Gestionnaires d'événements pour le modal de détail de tâche
  const openTaskDetails = (task: Task) => {
    console.log("Opening task details for:", task.title);
    setSelectedTask(task);
  };

  const closeTaskDetails = () => {
    console.log("Closing task details");
    setSelectedTask(null);
  };

  // Calcul des statistiques à partir des tâches d'exemple
  const pendingTasks = exampleTasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = exampleTasks.filter(task => task.status === 'in_progress').length;
  const completedTasks = exampleTasks.filter(task => task.status === 'completed').length;
  const highPriorityTasks = exampleTasks.filter(task => task.priority === 'high').length;

  return (
    <motion.div 
      className="task-page-container bg-gradient-to-br from-brand-dark via-brand-purple/20 to-brand-burgundy/20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* En-tête avec effet 3D */}
      <div className="task-page-header-wrapper">
        <motion.div 
          className="task-page-header"
          variants={itemVariants}
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

          <motion.button
            onClick={() => setShowNewTaskForm(true)}
            className="new-task-btn"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={20} className="btn-icon" />
            <span>Nouvelle tâche</span>
            <CloudLightning className="sparks-effect" size={15} />
          </motion.button>
        </motion.div>
      </div>

      {/* Zone de recherche et filtres avec effet néomorphisme */}
      <motion.div 
        className="search-filter-container"
        variants={itemVariants}
      >
        <div className="search-container">
          <div className="search-icon-container">
            <Search size={18} className="search-icon" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-button ${showFilters ? 'active' : ''}`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter size={16} className="btn-icon" />
          <span>Filtres</span>
          {showFilters && <Zap size={14} className="active-indicator" />}
        </motion.button>
      </motion.div>

      {/* Filtres avancés avec animation de dépliage */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filters-container"
            initial={{ opacity: 0, y: -20, scaleY: 0, transformOrigin: 'top' }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -20, scaleY: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <TaskFilters />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard des statistiques */}
      <motion.div 
        className="stats-dashboard"
        variants={itemVariants}
      >
        <StatCard 
          title="Tâches en cours" 
          value={inProgressTasks} 
          icon={<Clock size={22} />}
          color="blue"
        />
        
        <StatCard 
          title="Tâches terminées" 
          value={completedTasks} 
          icon={<CheckCircle2 size={22} />}
          color="green"
        />
        
        <StatCard 
          title="Tâches en attente" 
          value={pendingTasks} 
          icon={<ListTodo size={22} />}
          color="amber"
        />
        
        <StatCard 
          title="Haute priorité" 
          value={highPriorityTasks} 
          icon={<AlertCircle size={22} />}
          color="red"
        />
      </motion.div>

      {/* Séparateur visuel avec dégradé */}
      <div className="task-section-divider">
        <div className="divider-line"></div>
        <div className="divider-text">Liste des tâches</div>
        <div className="divider-line"></div>
      </div>

      {/* En-tête de section avec barre colorée, comme demandé */}
      <div className="task-section-header">
        <div className="task-section-title-wrapper">
          <div className="task-section-bar"></div>
          <h2 className="task-section-title">Conditions des tâches</h2>
        </div>
        <div className="task-section-date">
          Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="task-list-container">
        <TaskList 
          searchQuery={searchQuery} 
          onTaskSelect={openTaskDetails}
        />
      </div>

      {/* Modal pour ajouter une nouvelle tâche */}
      <AnimatePresence>
        {showNewTaskForm && (
          <TaskForm onClose={() => setShowNewTaskForm(false)} />
        )}
      </AnimatePresence>

      {/* Modal pour afficher les détails de la tâche */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetailModal 
            task={selectedTask} 
            onClose={closeTaskDetails} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}