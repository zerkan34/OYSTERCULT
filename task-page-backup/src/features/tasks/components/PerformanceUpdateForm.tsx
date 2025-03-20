import React, { useState } from 'react';
import { Task, TaskPerformance, updateTaskPerformance } from '@/api/taskApi';

interface PerformanceUpdateFormProps {
  task: Task;
  onSuccess: (updatedTask: Task) => void;
  onCancel: () => void;
}

export function PerformanceUpdateForm({ task, onSuccess, onCancel }: PerformanceUpdateFormProps) {
  const [actualHours, setActualHours] = useState<number>(task.actualHours || 0);
  const [performance, setPerformance] = useState<TaskPerformance>(
    task.performance || TaskPerformance.MEETS_EXPECTATION
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Valider les entrées
      if (actualHours <= 0) {
        throw new Error("Les heures réelles doivent être supérieures à 0");
      }

      const updatedTask = await updateTaskPerformance(task.id, actualHours, performance);
      
      if (!updatedTask) {
        throw new Error("Erreur lors de la mise à jour de la performance");
      }
      
      onSuccess(updatedTask);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la performance:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="actualHours" className="block mb-2 text-sm font-medium text-white">
          Heures réelles passées
        </label>
        <input
          type="number"
          id="actualHours"
          min="0"
          step="0.5"
          value={actualHours}
          onChange={(e) => setActualHours(parseFloat(e.target.value))}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
          placeholder="Entrez le nombre d'heures réelles"
          required
        />
      </div>

      <div>
        <label htmlFor="performance" className="block mb-2 text-sm font-medium text-white">
          Évaluation de la performance
        </label>
        <select
          id="performance"
          value={performance}
          onChange={(e) => setPerformance(e.target.value as TaskPerformance)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
          required
        >
          <option value={TaskPerformance.EXCEEDS_EXPECTATION}>Dépasse les attentes</option>
          <option value={TaskPerformance.MEETS_EXPECTATION}>Conforme aux attentes</option>
          <option value={TaskPerformance.BELOW_EXPECTATION}>En dessous des attentes</option>
        </select>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex space-x-3 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 px-4 bg-brand-burgundy text-white rounded-md hover:bg-brand-burgundy/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Envoi en cours..." : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 bg-transparent border border-white/20 text-white rounded-md hover:bg-white/5 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
