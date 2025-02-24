import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  User, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Plus 
} from 'lucide-react';

// Mise à jour du composant PerformanceReviews pour inclure les performances des tâches
interface Review {
  id: string;
  employeeName: string;
  position: string;
  date: string;
  overallRating: number;
  status: 'draft' | 'completed' | 'acknowledged';
  strengths: string[];
  improvements: string[];
  goals: string[];
  taskPerformance: {
    averageScore: number;
    tasksCompleted: number;
    onTimeCompletion: number;
    efficiencyRate: number;
  };
}

const mockReviews: Review[] = [
  {
    id: '1',
    employeeName: 'Jean Dupont',
    position: 'Responsable Production',
    date: '2025-01-15',
    overallRating: 4.5,
    status: 'completed',
    strengths: ['Leadership', 'Organisation', 'Communication'],
    improvements: ['Délégation'],
    goals: ['Formation équipe', 'Optimisation processus'],
    taskPerformance: {
      averageScore: 92,
      tasksCompleted: 45,
      onTimeCompletion: 95,
      efficiencyRate: 88
    }
  },
  {
    id: '2',
    employeeName: 'Marie Martin',
    position: 'Technicienne Maintenance',
    date: '2025-02-01',
    overallRating: 4.2,
    status: 'draft',
    strengths: ['Expertise technique', 'Résolution problèmes'],
    improvements: ['Documentation'],
    goals: ['Certification avancée'],
    taskPerformance: {
      averageScore: 87,
      tasksCompleted: 38,
      onTimeCompletion: 92,
      efficiencyRate: 85
    }
  }
];

export function PerformanceReviews() {
  const [showNewReview, setShowNewReview] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Évaluations de Performance</h2>
        <button
          onClick={() => setShowNewReview(true)}
          className="flex items-center px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nouvelle évaluation
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white/5 border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-white">{review.employeeName}</h3>
                <p className="text-sm text-white/60">{review.position}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                review.status === 'completed'
                  ? 'bg-green-500/20 text-green-300'
                  : review.status === 'acknowledged'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {review.status === 'completed'
                  ? 'Terminé'
                  : review.status === 'acknowledged'
                  ? 'Validé'
                  : 'Brouillon'}
              </span>
            </div>

            {/* Performance des tâches */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white mb-3">Performance des tâches</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/60">Score moyen</div>
                  <div className={`text-xl font-bold ${
                    review.taskPerformance.averageScore >= 90 ? 'text-green-400' :
                    review.taskPerformance.averageScore >= 80 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {review.taskPerformance.averageScore}%
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/60">Tâches complétées</div>
                  <div className="text-xl font-bold text-white">
                    {review.taskPerformance.tasksCompleted}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/60">Respect des délais</div>
                  <div className="text-xl font-bold text-green-400">
                    {review.taskPerformance.onTimeCompletion}%
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/60">Taux d'efficacité</div>
                  <div className="text-xl font-bold text-blue-400">
                    {review.taskPerformance.efficiencyRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Note globale */}
            <div className="flex items-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  size={20}
                  className={
                    rating <= review.overallRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-white/20'
                  }
                />
              ))}
              <span className="text-white/60 text-sm ml-2">
                {review.overallRating}/5
              </span>
            </div>

            {/* Points forts et améliorations */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Points forts</h4>
                <div className="flex flex-wrap gap-2">
                  {review.strengths.map((strength, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">
                  Axes d'amélioration
                </h4>
                <div className="flex flex-wrap gap-2">
                  {review.improvements.map((improvement, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm"
                    >
                      {improvement}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">Objectifs</h4>
                <div className="flex flex-wrap gap-2">
                  {review.goals.map((goal, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}