import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  SlidersHorizontal,
  LayoutDashboard, 
  Filter, 
  CalendarRange
} from 'lucide-react';
import { TaskBlock } from './components/TaskBlock';
import { TaskFilters } from './components/TaskFilters';
import { useStore } from '@/lib/store';
import { initializeTasksInStore } from './utils/initTaskStore';
import './TaskDemoPage.css';

export function TaskDemoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Récupérer les tâches du store
  const tasks = useStore(state => state.tasks);
  const addTask = useStore(state => state.addTask);
  
  // Initialiser les tâches si le store est vide
  useEffect(() => {
    if (tasks.length === 0) {
      initializeTasksInStore();
    }
  }, [tasks.length]);
  
  // Filtrer les tâches en fonction du terme de recherche
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Fonction pour l'ajout de tâche
  const handleAddTask = () => {
    console.log('Ouverture modal ajout de tâche');
  };

  return (
    <div className="task-demo-page">
      {/* En-tête de la page */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-left">
          <h1 className="page-title">
            <LayoutDashboard className="title-icon" />
            Tableau de bord des tâches
          </h1>
          <p className="page-subtitle">
            Consultez et gérez toutes vos tâches en un seul endroit
          </p>
        </div>
        
        <div className="header-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Rechercher une tâche..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            <span>Filtres</span>
            {/* Badge compteur de filtres actifs */}
            <span className="filter-count">0</span>
          </button>
          
          <button className="add-task-button" onClick={handleAddTask}>
            <Plus size={18} />
            <span>Nouvelle tâche</span>
          </button>
        </div>
      </motion.div>
      
      {/* Filtres collapsibles */}
      <div className={`filters-container ${showFilters ? 'expanded' : ''}`}>
        <TaskFilters />
      </div>
      
      {/* Contenu principal avec widgets de tâches */}
      <div className="tasks-grid">
        {/* Bloc des tâches prioritaires */}
        <motion.div 
          className="grid-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TaskBlock 
            title="Tâches prioritaires" 
            tasks={filteredTasks.filter(task => task.priority === 'high')}
            onAddTask={handleAddTask}
          />
        </motion.div>
        
        {/* Bloc des tâches en cours */}
        <motion.div 
          className="grid-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TaskBlock 
            title="Tâches en cours" 
            tasks={filteredTasks.filter(task => task.status === 'in_progress')}
            onAddTask={handleAddTask}
          />
        </motion.div>
        
        {/* Bloc des tâches à venir */}
        <motion.div 
          className="grid-item full-width"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TaskBlock 
            title="Toutes les tâches" 
            tasks={filteredTasks}
            limit={4}
            onAddTask={handleAddTask}
          />
        </motion.div>
        
        {/* Section inférieure - widgets statistiques */}
        <motion.div 
          className="grid-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stats-widget">
            <div className="stats-header">
              <h3>
                <CalendarRange className="stats-icon" />
                Productivité cette semaine
              </h3>
            </div>
            <div className="stats-content">
              <div className="stats-card">
                <div className="stats-value">{tasks.filter(t => t.status === 'completed').length}</div>
                <div className="stats-label">Tâches terminées</div>
              </div>
              <div className="stats-card">
                <div className="stats-value">{tasks.filter(t => t.status === 'in_progress').length}</div>
                <div className="stats-label">En cours</div>
              </div>
              <div className="stats-card">
                <div className="stats-value">{tasks.filter(t => t.status === 'pending').length}</div>
                <div className="stats-label">En attente</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="grid-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="stats-widget">
            <div className="stats-header">
              <h3>
                <SlidersHorizontal className="stats-icon" />
                Répartition par priorité
              </h3>
            </div>
            <div className="stats-content priority-chart">
              <div className="chart-bar high">
                <div className="bar-label">Haute</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${tasks.filter(t => t.priority === 'high').length / Math.max(tasks.length, 1) * 100}%` }}></div>
                </div>
                <div className="bar-value">{Math.round(tasks.filter(t => t.priority === 'high').length / Math.max(tasks.length, 1) * 100)}%</div>
              </div>
              <div className="chart-bar medium">
                <div className="bar-label">Moyenne</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${tasks.filter(t => t.priority === 'medium').length / Math.max(tasks.length, 1) * 100}%` }}></div>
                </div>
                <div className="bar-value">{Math.round(tasks.filter(t => t.priority === 'medium').length / Math.max(tasks.length, 1) * 100)}%</div>
              </div>
              <div className="chart-bar low">
                <div className="bar-label">Basse</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${tasks.filter(t => t.priority === 'low').length / Math.max(tasks.length, 1) * 100}%` }}></div>
                </div>
                <div className="bar-value">{Math.round(tasks.filter(t => t.priority === 'low').length / Math.max(tasks.length, 1) * 100)}%</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
