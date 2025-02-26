import React from 'react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Statistiques */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Statistiques</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Commandes en cours</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fournisseurs actifs</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Stock total</p>
              <p className="text-2xl font-bold">1,250 kg</p>
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Activité récente</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <div>
                <p className="text-sm">Nouvelle commande #123</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <div>
                <p className="text-sm">Stock mis à jour</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 4 heures</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <div>
                <p className="text-sm">Nouveau fournisseur ajouté</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 1 jour</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alertes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Alertes</h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md">
              <p className="text-sm">Stock faible : Huîtres n°3</p>
              <p className="text-xs mt-1">Reste 50 kg</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
              <p className="text-sm">Commande en retard #456</p>
              <p className="text-xs mt-1">Retard de 2 jours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
