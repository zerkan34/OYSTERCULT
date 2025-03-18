import React, { useState, useEffect } from 'react';
import { Task, TaskPerformance } from '@/api/taskApi';
import { Award, TrendingUp, TrendingDown, Check, Clock } from 'lucide-react';

// Fonction pour récupérer les tâches terminées
async function fetchCompletedTasks() {
  try {
    const response = await fetch('/api/tasks/status/Terminée');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des tâches terminées');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

// Interface pour les statistiques par employé
interface EmployeeStats {
  name: string;
  totalTasks: number;
  totalEstimatedHours: number;
  totalActualHours: number;
  efficiency: number;
  performanceDistribution: {
    [TaskPerformance.EXCEEDS_EXPECTATION]: number;
    [TaskPerformance.MEETS_EXPECTATION]: number;
    [TaskPerformance.BELOW_EXPECTATION]: number;
  };
  completedTasks: Task[];
}

export function PerformanceStats() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);
        const tasks = await fetchCompletedTasks();
        setCompletedTasks(tasks.filter((task: Task) => task.actualHours !== undefined));
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, []);

  useEffect(() => {
    if (completedTasks.length === 0) return;

    // Organiser les stats par employé
    const employeeMap = new Map<string, EmployeeStats>();

    completedTasks.forEach(task => {
      if (!task.actualHours || !task.estimatedHours) return;

      if (!employeeMap.has(task.assignedTo)) {
        employeeMap.set(task.assignedTo, {
          name: task.assignedTo,
          totalTasks: 0,
          totalEstimatedHours: 0,
          totalActualHours: 0,
          efficiency: 0,
          performanceDistribution: {
            [TaskPerformance.EXCEEDS_EXPECTATION]: 0,
            [TaskPerformance.MEETS_EXPECTATION]: 0,
            [TaskPerformance.BELOW_EXPECTATION]: 0
          },
          completedTasks: []
        });
      }

      const employeeStat = employeeMap.get(task.assignedTo)!;
      employeeStat.totalTasks += 1;
      employeeStat.totalEstimatedHours += task.estimatedHours;
      employeeStat.totalActualHours += task.actualHours;
      
      if (task.performance) {
        employeeStat.performanceDistribution[task.performance] += 1;
      }
      
      employeeStat.completedTasks.push(task);
    });

    // Calculer l'efficacité pour chaque employé
    employeeMap.forEach(stat => {
      stat.efficiency = Math.round((stat.totalEstimatedHours / stat.totalActualHours) * 100);
    });

    // Convertir la Map en tableau pour le rendu
    setEmployeeStats(Array.from(employeeMap.values()));
  }, [completedTasks]);

  const getPerformanceClass = (performance?: TaskPerformance) => {
    switch (performance) {
      case TaskPerformance.EXCEEDS_EXPECTATION:
        return 'text-green-400';
      case TaskPerformance.MEETS_EXPECTATION:
        return 'text-yellow-400';
      case TaskPerformance.BELOW_EXPECTATION:
        return 'text-red-400';
      default:
        return 'text-white/60';
    }
  };

  const getPerformanceIcon = (performance?: TaskPerformance) => {
    switch (performance) {
      case TaskPerformance.EXCEEDS_EXPECTATION:
        return <TrendingUp className="text-green-400" size={16} />;
      case TaskPerformance.MEETS_EXPECTATION:
        return <Check className="text-yellow-400" size={16} />;
      case TaskPerformance.BELOW_EXPECTATION:
        return <TrendingDown className="text-red-400" size={16} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center p-6">Chargement des statistiques de performance...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }

  if (employeeStats.length === 0) {
    return <div className="text-center p-6">Aucune donnée de performance disponible</div>;
  }

  return (
    <div 
      className="glass-effect p-6 rounded-xl flex flex-col items-center justify-center h-full text-center"
      style={{
        background: "rgba(var(--color-brand-dark), 0.3)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "border-color 0.2s ease",
      }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Performance des employés</h2>

      {employeeStats.map((employee) => (
        <div key={employee.name} className="bg-white/5 rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-white">{employee.name}</h3>
              <p className="text-white/60 text-sm mt-1">
                {employee.totalTasks} tâches complétées · {employee.totalEstimatedHours}h estimées · {employee.totalActualHours}h réelles
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                employee.efficiency >= 100 ? 'text-green-400' :
                employee.efficiency >= 80 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {employee.efficiency}%
              </div>
              <div className="text-white/60 text-sm">Efficacité</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <div className="flex items-center space-x-1">
              <Award className="text-green-400" size={14} />
              <span className="text-white/80 text-sm">
                {employee.performanceDistribution[TaskPerformance.EXCEEDS_EXPECTATION]}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="text-yellow-400" size={14} />
              <span className="text-white/80 text-sm">
                {employee.performanceDistribution[TaskPerformance.MEETS_EXPECTATION]}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="text-red-400" size={14} />
              <span className="text-white/80 text-sm">
                {employee.performanceDistribution[TaskPerformance.BELOW_EXPECTATION]}
              </span>
            </div>
          </div>

          <h4 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
            Tâches récentes
          </h4>
          
          <div className="space-y-3">
            {employee.completedTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <div className="flex items-center">
                    {getPerformanceIcon(task.performance)}
                    <span className="ml-2 text-white font-medium">{task.title}</span>
                  </div>
                  <div className="text-white/60 text-sm mt-1">{task.description}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-white/80 text-sm">{task.estimatedHours}h</div>
                    <div className="text-white/60 text-xs">Estimé</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/80 text-sm">{task.actualHours}h</div>
                    <div className="text-white/60 text-xs">Réel</div>
                  </div>
                  <div className={`text-right ${getPerformanceClass(task.performance)}`}>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span className="text-sm">{Math.round((task.estimatedHours! / task.actualHours!) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
