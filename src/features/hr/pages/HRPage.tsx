import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Star, Calendar } from 'lucide-react';
import { EmployeeList } from '../components/EmployeeList';
import { EmployeeForm } from '../components/EmployeeForm';
import { LeaveManagement } from '../components/LeaveManagement';
import { PerformanceReviews } from '../components/PerformanceReviews';
import { Schedule } from '../components/Schedule';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-6 mt-12"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,128,128,0.9)] to-[rgba(0,160,160,0.7)] blur-xl opacity-70 rounded-full"></div>
            <div className="relative z-10 p-3 rounded-full bg-gradient-to-br from-[rgba(0,128,128,0.3)] to-[rgba(0,60,100,0.3)] shadow-[rgba(0,0,0,0.3)_0px_5px_15px,rgba(0,210,200,0.15)_0px_0px_10px_inset]">
              <Users size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Gestion RH</h1>
        </div>
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

      {(activeTab === 'employees') && (
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 transform -translate-y-1/2 text-white/40" style={{top: '26%'}} aria-label="Search icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un employé..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1">
            <Filter size={20} className="text-cyan-400" />
            <span className="text-cyan-400">Filtres</span>
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
        <Schedule 
          employee={mockEmployee}
          onClose={() => handleTabChange('employees')}
        />
      )}
    </motion.div>
  );
}