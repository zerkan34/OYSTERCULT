import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Star, Calendar } from 'lucide-react';
import { EmployeeList } from '../components/EmployeeList';
import { EmployeeForm } from '../components/EmployeeForm';
import { LeaveManagement } from '../components/LeaveManagement';
import { PerformanceReviews } from '../components/PerformanceReviews';
import { Schedule } from '../components/Schedule';
import { useSearchParams } from 'react-router-dom';

type TabType = 'employees' | 'leave' | 'performance' | 'schedule';

// Mock employee data for the Schedule view
const mockEmployee = {
  id: 'default',
  name: 'Planning Global'
};

export function HRPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tab = searchParams.get('tab');
    return (tab as TabType) || 'employees';
  });
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchroniser l'URL avec l'onglet actif
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab as TabType);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">Gestion RH</h1>
        {activeTab === 'employees' && (
          <button
            onClick={() => setShowNewEmployeeForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus size={20} className="text-cyan-400" />
            <span className="text-cyan-400">Nouvel Employé</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4 border-b border-white/10">
        <button
          onClick={() => handleTabChange('employees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'employees'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users size={16} />
          <span>Employés</span>
        </button>
        <button
          onClick={() => handleTabChange('schedule')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'schedule'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar size={16} />
          <span>Planning</span>
        </button>
        <button
          onClick={() => handleTabChange('leave')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'leave'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar size={16} />
          <span>Congés</span>
        </button>
        <button
          onClick={() => handleTabChange('performance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'performance'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Star size={16} />
          <span>Évaluations</span>
        </button>
      </div>

      {(activeTab === 'employees' || activeTab === 'schedule') && (
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
            <Filter size={20} className="mr-2" />
            Filtres
          </button>
        </div>
      )}

      {showNewEmployeeForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <EmployeeForm onClose={() => setShowNewEmployeeForm(false)} />
          </div>
        </div>
      )}

      {activeTab === 'employees' && <EmployeeList searchQuery={searchQuery} />}
      {activeTab === 'leave' && <LeaveManagement />}
      {activeTab === 'performance' && <PerformanceReviews />}
      {activeTab === 'schedule' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <Schedule 
              employee={mockEmployee}
              onClose={() => handleTabChange('employees')}
            />
          </div>
        </div>
      )}
    </div>
  );
}