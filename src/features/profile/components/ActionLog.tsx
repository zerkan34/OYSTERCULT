import React from 'react';
import { ScrollArea } from '@/components/ui/ScrollArea';

export function ActionLog() {
  // Exemple de données de journal (à remplacer par les vraies données)
  const actions = [
    {
      id: 1,
      date: '2025-05-31T14:30:00',
      type: 'Modification',
      description: 'Mise à jour du calibre de la table #12',
    },
    {
      id: 2,
      date: '2025-05-31T13:15:00',
      type: 'Déplacement',
      description: 'Transfert du lot #532 vers la table de trempe',
    },
    // Ajoutez plus d'actions ici
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Journal d&apos;actions</h2>
      </div>

      <ScrollArea className="h-[500px] rounded-md border border-white/10 bg-gray-900/50">
        <div className="p-4 space-y-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className="p-4 rounded-lg bg-gray-800/50 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  {new Date(action.date).toLocaleString('fr-FR', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400">
                  {action.type}
                </span>
              </div>
              <p className="text-white">{action.description}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
