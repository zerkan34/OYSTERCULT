import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { TaskFilters } from '../components/TaskFilters';
import { useStore } from '@/lib/store';

export function TasksPage() {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gestion des Tâches</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewTaskForm(true)}
            className="flex items-center px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nouvelle Tâche
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une tâche..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
          />
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
        >
          <Filter size={20} className="mr-2" />
          Filtres
        </button>
      </div>

      <TaskList searchQuery={searchQuery} />

      {showNewTaskForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TaskForm onClose={() => setShowNewTaskForm(false)} />
          </div>
        </div>
      )}

      <TaskFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={() => {}}
      />
    </div>
  );
}