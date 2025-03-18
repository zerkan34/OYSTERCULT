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

// Exemple de données pour les tables d'huîtres
const exampleTables = [
  {
    id: 't1',
    name: 'Table Nord #128',
    type: 'Huîtres Fines de Claire',
    status: 'Active',
    occupancy: 85, // Pourcentage d'occupation
    startDate: '15/10/2024',
    harvestDate: '15/01/2025',
    mortality: 12, // Pourcentage
    alert: null,
    timeProgress: 75, // Pourcentage
    currentSize: 'N°4',
    targetSize: 'N°2'
  },
  {
    id: 't2',
    name: 'Table Sud #45',
    type: 'Spéciales de Marennes',
    status: 'Alerte',
    occupancy: 92,
    startDate: '01/09/2024',
    harvestDate: '01/12/2024',
    mortality: 18,
    alert: 'Taux de mortalité élevé détecté',
    timeProgress: 110, // Dépassé
    currentSize: 'N°3',
    targetSize: 'N°1'
  }
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const { session } = useStore();
  const isAdmin = session?.user?.role === 'admin';

  const handleTableClick = (table: any) => {
    setSelectedTable(table);
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

          <button
            onClick={openNewTaskModal}
            className="new-task-btn"
          >
            <Plus size={20} className="btn-icon" />
            <span>Nouvelle tâche</span>
            <CloudLightning className="sparks-effect" size={15} />
          </button>
        </div>
      </div>

      {/* Zone de recherche et filtres avec effet néomorphisme */}
      <div 
        className="search-filter-container"
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
        
        <button
          className="filter-button"
        >
          <Filter size={18} className="mr-2" />
          <span>Filtres</span>
        </button>
      </div>

      {/* Dashboard des statistiques */}
      <div 
        className="stats-grid"
      >
        <StatCard 
          title="En attente" 
          value={pendingTasks} 
          icon={<Clock size={22} />}
          color="blue"
        />
        <StatCard 
          title="En cours" 
          value={inProgressTasks} 
          icon={<Zap size={22} />}
          color="amber"
        />
        <StatCard 
          title="Terminées" 
          value={completedTasks} 
          icon={<CheckCircle2 size={22} />}
          color="green"
        />
        <StatCard 
          title="Haute priorité" 
          value={highPriorityTasks} 
          icon={<AlertCircle size={22} />}
          color="red"
        />
      </div>

      {/* Nouvelle section: Tables d'huîtres associées */}
      <div className="task-section-divider">
        <div className="divider-line"></div>
        <div className="divider-text">Tables associées</div>
        <div className="divider-line"></div>
      </div>

      <div className="tables-grid">
        {exampleTables.map(table => (
          <StatCard 
            key={table.id}
            title={table.name} 
            value={table.occupancy} 
            icon={<Shell size={22} />}
            color={table.alert ? "red" : "blue"}
            onClick={() => handleTableClick(table)}
          />
        ))}
      </div>

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
          Dernière mise à jour: {format(new Date(), 'HH:mm', { locale: fr })}
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="task-list-container">
        <TaskList 
          searchQuery={searchQuery} 
        />
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
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNewTaskModal}
          >
            <motion.div 
              className="modal-content"
              onClick={e => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="modal-header">
                <h2 className="modal-title">Nouvelle tâche</h2>
                <button className="close-modal-btn" onClick={closeNewTaskModal}>
                  <X size={24} />
                </button>
              </div>
              <TaskForm onClose={closeNewTaskModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}