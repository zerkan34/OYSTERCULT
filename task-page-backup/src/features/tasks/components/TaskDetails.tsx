// Mise à jour du composant TaskDetails pour ajouter l'onglet Performances
import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { 
  Clock, 
  AlertCircle, 
  Tag, 
  Users, 
  Calendar,
  FileText,
  MessageSquare,
  BarChart2,
  X,
  TrendingUp,
  Timer,
  Award,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStore } from '@/lib/store';
import { TaskComments } from './TaskComments';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetails({ task, onClose }: TaskDetailsProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'performance'>('comments');
  const { session } = useStore();
  const isAdmin = session?.user?.role === 'admin';

  const calculatePerformance = () => {
    if (!task.estimatedTime || !task.actualTime) return null;
    
    const efficiency = (task.estimatedTime / task.actualTime) * 100;
    const score = Math.round(efficiency);

    let rating;
    if (score >= 100) rating = 'Excellent';
    else if (score >= 90) rating = 'Très bien';
    else if (score >= 80) rating = 'Bien';
    else if (score >= 70) rating = 'Moyen';
    else rating = 'À améliorer';

    return {
      score,
      rating,
      timeDiff: Math.abs(task.actualTime - task.estimatedTime),
      isAhead: task.actualTime < task.estimatedTime
    };
  };

  const performance = calculatePerformance();

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
    >
      <div className="h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{task.title}</h2>
              <p className="text-white/60 mt-1">{task.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center text-white/80">
              <Users size={16} className="mr-2" />
              {task.assignedTo.name}
            </div>
            <div className="flex items-center text-white/80">
              <Calendar size={16} className="mr-2" />
              {format(new Date(task.dueDate), 'PPP', { locale: fr })}
            </div>
            <div className="flex items-center text-white/80">
              <Clock size={16} className="mr-2" />
              {task.estimatedTime} heures estimées
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10">
          <div className="flex space-x-4 px-6">
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'comments'
                  ? 'border-brand-burgundy text-white'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-2" />
                Commentaires
              </div>
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'performance'
                  ? 'border-brand-burgundy text-white'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <BarChart2 size={16} className="mr-2" />
                Performance
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'comments' ? (
            <TaskComments task={task} />
          ) : (
            <div className="space-y-6">
              {performance ? (
                <>
                  {/* Score global */}
                  <div className="bg-white/5 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">Score de performance</h3>
                        <p className="text-white/60 mt-1">
                          Basé sur le temps estimé vs temps réel
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${
                          performance.score >= 100 ? 'text-green-400' :
                          performance.score >= 80 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {performance.score}%
                        </div>
                        <div className="text-white/60 mt-1">{performance.rating}</div>
                      </div>
                    </div>
                  </div>

                  {/* Détails du temps */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Timer size={20} className="text-brand-burgundy" />
                        <div>
                          <div className="text-white/60">Temps estimé</div>
                          <div className="text-xl font-bold text-white">
                            {task.estimatedTime}h
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Clock size={20} className="text-brand-burgundy" />
                        <div>
                          <div className="text-white/60">Temps réel</div>
                          <div className="text-xl font-bold text-white">
                            {task.actualTime}h
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <TrendingUp size={20} className={
                          performance.isAhead ? 'text-green-400' : 'text-red-400'
                        } />
                        <div>
                          <div className="text-white/60">Différence</div>
                          <div className={`text-xl font-bold ${
                            performance.isAhead ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {performance.isAhead ? '-' : '+'}{performance.timeDiff}h
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges et récompenses */}
                  {performance.score >= 90 && (
                    <div className="bg-white/5 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-white mb-4">
                        Badges obtenus
                      </h3>
                      <div className="flex space-x-4">
                        {performance.score >= 100 && (
                          <div className="flex items-center space-x-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg">
                            <Award size={20} />
                            <span>Performance exceptionnelle</span>
                          </div>
                        )}
                        {performance.score >= 90 && (
                          <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg">
                            <CheckCircle2 size={20} />
                            <span>Objectif dépassé</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-white/60 py-8">
                  Les données de performance seront disponibles une fois la tâche terminée
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}