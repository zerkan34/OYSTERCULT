import React, { useState } from 'react';
import { Download, FileText, Package, Calendar, Users, AlertTriangle } from 'lucide-react';

export function ExportData() {
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });

  const handleExport = () => {
    // TODO: Implement data export
    console.log('Exporting data:', { selectedData, format, dateRange });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-6">Export des données</h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Sélectionner les données</h4>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedData.includes('tasks')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedData([...selectedData, 'tasks']);
                    } else {
                      setSelectedData(selectedData.filter(d => d !== 'tasks'));
                    }
                  }}
                  className="w-4 h-4 bg-white/5 border border-white/10 rounded"
                />
                <div>
                  <div className="text-white font-medium">Tâches</div>
                  <div className="text-sm text-white/60">Historique des tâches</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedData.includes('inventory')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedData([...selectedData, 'inventory']);
                    } else {
                      setSelectedData(selectedData.filter(d => d !== 'inventory'));
                    }
                  }}
                  className="w-4 h-4 bg-white/5 border border-white/10 rounded"
                />
                <div>
                  <div className="text-white font-medium">Inventaire</div>
                  <div className="text-sm text-white/60">Données de stock</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedData.includes('time')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedData([...selectedData, 'time']);
                    } else {
                      setSelectedData(selectedData.filter(d => d !== 'time'));
                    }
                  }}
                  className="w-4 h-4 bg-white/5 border border-white/10 rounded"
                />
                <div>
                  <div className="text-white font-medium">Temps de travail</div>
                  <div className="text-sm text-white/60">Suivi du temps</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedData.includes('activity')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedData([...selectedData, 'activity']);
                    } else {
                      setSelectedData(selectedData.filter(d => d !== 'activity'));
                    }
                  }}
                  className="w-4 h-4 bg-white/5 border border-white/10 rounded"
                />
                <div>
                  <div className="text-white font-medium">Activité</div>
                  <div className="text-sm text-white/60">Historique d'activité</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-3">Format d'export</h4>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value as 'csv' | 'json')}
                  className="w-4 h-4 bg-white/5 border border-white/10 rounded-full"
                />
                <div className="text-white font-medium">CSV</div>
              </label>

              <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={format === 'json'}
                  onChange={(e) => setFormat(e.target.value as 'csv' | 'json')}
                  className="w-4 h-4 bg-white/5 border border-white/10 rounded-full"
                />
                <div className="text-white font-medium">JSON</div>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-3">Période</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle size={20} className="text-yellow-400 mt-1" />
              <div>
                <h4 className="text-yellow-400 font-medium">Note importante</h4>
                <p className="text-yellow-400/80 mt-1">
                  L'export peut contenir des données sensibles. Assurez-vous de les stocker de manière sécurisée.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExport}
              disabled={selectedData.length === 0}
              className="flex items-center px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} className="mr-2" />
              Exporter les données
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}