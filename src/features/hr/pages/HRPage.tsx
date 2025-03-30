import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Star, Calendar } from 'lucide-react';
import { EmployeeList } from '../components/EmployeeList';
import { EmployeeForm } from '../components/EmployeeForm';
import { LeaveManagement } from '../components/LeaveManagement';
import { PerformanceReviews } from '../components/PerformanceReviews';
import { Schedule } from '../components/Schedule';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTitle } from '@/components/ui/PageTitle';

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
      className="space-y-6"
    >
      <PageTitle 
        icon={<Users size={28} className="text-white" />}
        title="Gestion RH"
      />
      <div className="flex items-center justify-between">
        {activeTab === 'employees' && (
          <button
            onClick={() => setShowNewEmployeeForm(true)}
            className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nouvel Employé
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4 border-b border-white/10">
        <button
          onClick={() => handleTabChange('employees')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'employees'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Users size={16} className="mr-2" />
            Employés
          </div>
        </button>
        <button
          onClick={() => handleTabChange('schedule')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'schedule'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            Planning
          </div>
        </button>
        <button
          onClick={() => handleTabChange('leave')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'leave'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            Congés
          </div>
        </button>
        <button
          onClick={() => handleTabChange('performance')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'performance'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Star size={16} className="mr-2" />
            Évaluations
          </div>
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
        <Schedule 
          employee={mockEmployee}
          onClose={() => handleTabChange('employees')}
        />
      )}
    </motion.div>
  );
}