import React, { useState } from 'react';
import { Plus, Filter, Search, CheckCircle2, Clock, AlertCircle, Zap, CloudLightning, ScrollText, ListTodo, Shell, X, Download } from 'lucide-react';
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

// Composant de carte réutilisable avec design cohérent
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
  const getColorClass = () => {
    switch(color) {
      case 'green': return 'bg-emerald-500/20 text-emerald-400';
      case 'blue': return 'bg-blue-500/20 text-blue-400';
      case 'yellow': return 'bg-amber-500/20 text-amber-400';
      case 'red': return 'bg-red-500/20 text-red-400';
      default: return 'bg-cyan-500/20 text-cyan-400';
    }
  };
  
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[120px] flex items-center`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${getColorClass()} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-white/70 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
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
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {/* Premier conteneur: En-tête et statistiques */}
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <ScrollText size={28} className="text-cyan-400" aria-hidden="true" />
            Gestion des Tâches
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une tâche..."
                className="pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25)] text-white min-w-[250px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} aria-hidden="true" />
            </div>
            <button
              onClick={openNewTaskModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Ajouter une nouvelle tâche"
            >
              <Plus size={18} aria-hidden="true" />
              <span>Nouvelle tâche</span>
            </button>
          </div>
        </div>

        {/* Stats des tâches - Section divisée en trois parties */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          {/* Première partie - 2 cartes à gauche */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:w-2/5">
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
          </div>
          
          {/* Titre central */}
          <div className="lg:w-1/5 flex justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                <ListTodo className="h-10 w-10 text-cyan-400" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mt-2">Tâches en cours</h2>
              <p className="text-sm text-white/60">{format(new Date(), "d MMMM yyyy", { locale: fr })}</p>
            </div>
          </div>
          
          {/* Troisième partie - 2 cartes à droite */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:w-2/5">
            <StatCard
              title="Terminées"
              value={completedTasks}
              icon={<CheckCircle2 size={22} />}
              color="green"
            />
            <StatCard
              title="Priorité haute"
              value={highPriorityTasks}
              icon={<AlertCircle size={22} />}
              color="red"
            />
          </div>
        </div>
      </div>

      {/* Deuxième conteneur: Liste des tâches */}
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <ListTodo className="h-5 w-5 text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">Liste des tâches</h2>
              <p className="text-sm text-white/60">Dernière mise à jour: {format(new Date(), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Filtrer les tâches"
            >
              <Filter size={16} className="text-white/70" aria-hidden="true" />
              <span className="text-white/70 text-sm">Filtrer</span>
            </button>
          </div>
        </div>
        
        <TaskList searchQuery={searchQuery} />
      </div>

      {/* Troisième conteneur: Autres fonctionnalités */}
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <CloudLightning className="h-5 w-5 text-cyan-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">Rapport d'activité</h2>
            <p className="text-sm text-white/60">Performances et analyses</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all">
            <h3 className="text-lg text-white mb-2">Efficacité</h3>
            <p className="text-3xl font-bold text-cyan-400">87%</p>
            <p className="text-sm text-white/60 mt-1">+2% depuis la semaine dernière</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all">
            <h3 className="text-lg text-white mb-2">Temps moyen</h3>
            <p className="text-3xl font-bold text-cyan-400">3.2h</p>
            <p className="text-sm text-white/60 mt-1">Par tâche complétée</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all">
            <h3 className="text-lg text-white mb-2">Priorité</h3>
            <p className="text-3xl font-bold text-cyan-400">12</p>
            <p className="text-sm text-white/60 mt-1">Tâches à traiter cette semaine</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all">
            <h3 className="text-lg text-white mb-2">Score global</h3>
            <p className="text-3xl font-bold text-cyan-400">A+</p>
            <p className="text-sm text-white/60 mt-1">Excellent niveau de performance</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1">
            <Download size={18} aria-hidden="true" />
            <span>Exporter le rapport</span>
          </button>
        </div>
      </div>

      {/* Modal pour afficher les détails de la table */}
      <AnimatePresence>
        {selectedTable && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 max-w-4xl w-full mx-4"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNewTaskModal}
          >
            <motion.div 
              className="p-6 rounded-lg max-w-2xl w-full mx-4 overflow-hidden border border-white/10 border-t-white/20 border-l-white/20"
              style={{
                background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow: "rgba(0, 0, 0, 0.45) 10px 0px 30px -5px, rgba(0, 0, 0, 0.3) 5px 5px 20px -5px, rgba(255, 255, 255, 0.15) 0px -1px 5px 0px inset, rgba(0, 210, 200, 0.25) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset"
              }}
              onClick={e => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Effet de contour lumineux */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur-lg opacity-70 pointer-events-none"></div>
              
              <div className="relative">
                {/* En-tête du modal */}
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Plus size={20} className="text-cyan-400" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Nouvelle tâche</h2>
                  </div>
                  <button 
                    onClick={closeNewTaskModal}
                    className="text-white/60 hover:text-white min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-lg transition-all duration-300 transform hover:rotate-90"
                    aria-label="Fermer"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
                
                {/* Contenu du formulaire */}
                <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  <TaskForm onClose={closeNewTaskModal} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}