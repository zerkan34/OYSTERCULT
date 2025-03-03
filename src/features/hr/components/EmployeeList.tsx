import React, { useState } from 'react';
import { MoreVertical, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Schedule } from './Schedule';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  status: 'active' | 'inactive';
  hireDate: string;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    position: 'Responsable Production',
    department: 'Production',
    email: 'jean.dupont@example.com',
    phone: '06 12 34 56 78',
    location: 'Site A',
    status: 'active',
    hireDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Marie Martin',
    position: 'Technicienne Maintenance',
    department: 'Maintenance',
    email: 'marie.martin@example.com',
    phone: '06 23 45 67 89',
    location: 'Site B',
    status: 'active',
    hireDate: '2024-02-01'
  }
];

interface EmployeeListProps {
  searchQuery: string;
}

export function EmployeeList({ searchQuery }: EmployeeListProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const filteredEmployees = mockEmployees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewSchedule = (employee: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmployee(employee);
    setShowSchedule(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#00D1FF]/20 rounded-full flex items-center justify-center">
                    {employee.avatar ? (
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <span className="text-white text-lg font-medium">
                        {employee.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{employee.name}</h3>
                    <p className="text-sm text-white/60">{employee.position}</p>
                  </div>
                </div>
                <button className="text-white/60 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-white/60">
                  <Mail size={16} className="mr-2" />
                  {employee.email}
                </div>
                <div className="flex items-center text-sm text-white/60">
                  <Phone size={16} className="mr-2" />
                  {employee.phone}
                </div>
                <div className="flex items-center text-sm text-white/60">
                  <MapPin size={16} className="mr-2" />
                  {employee.location}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-white/60">
                  Embauché le {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    employee.status === 'active'
                      ? 'bg-[#00D1FF]/20 text-[#00D1FF]'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}
                >
                  {employee.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={(e) => handleViewSchedule(employee, e)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-[#00D1FF]/20 rounded-lg text-[#00D1FF] hover:bg-[#00D1FF]/30 transition-colors"
                >
                  <Calendar size={16} className="mr-2" />
                  Voir le planning
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSchedule && selectedEmployee && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowSchedule(false)}
        >
          <div 
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Schedule 
              employee={selectedEmployee} 
              onClose={() => setShowSchedule(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
}