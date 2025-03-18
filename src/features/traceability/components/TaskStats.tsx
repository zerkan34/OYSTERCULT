import React from 'react';
import { Clock, Zap, CheckCircle2, AlertCircle, Shell } from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

interface TaskStatsProps {
  stats: {
    pending: number;
    inProgress: number;
    completed: number;
    highPriority: number;
  };
  tables: {
    id: string;
    name: string;
    count: number;
    status: 'normal' | 'warning';
  }[];
}

export function TaskStats({ stats, tables }: TaskStatsProps) {
  const statCards: StatCard[] = [
    {
      title: 'En attente',
      value: stats.pending,
      icon: Clock,
      color: 'blue',
      gradient: 'var(--blue-600)',
    },
    {
      title: 'En cours',
      value: stats.inProgress,
      icon: Zap,
      color: 'amber',
      gradient: 'var(--amber-600)',
    },
    {
      title: 'Terminées',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'green',
      gradient: 'var(--green-600)',
    },
    {
      title: 'Haute priorité',
      value: stats.highPriority,
      icon: AlertCircle,
      color: 'red',
      gradient: 'var(--red-600)',
    },
  ];

  const StatCard = ({ title, value, icon: Icon, color, gradient }: StatCard) => (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(10,30,50,0.65) 0%, rgba(20,100,100,0.45) 100%)",
        backdropFilter: "blur(20px)",
        boxShadow: "rgba(0,0,0,0.2) 0px 5px 20px -5px, rgba(0,200,200,0.1) 0px 5px 12px -5px, rgba(255,255,255,0.07) 0px -1px 3px 0px inset, rgba(0,200,200,0.05) 0px 0px 12px inset, rgba(0,0,0,0.1) 0px 0px 8px inset"
      }}
    >
      <div className="relative z-10 p-5 flex items-center gap-5">
        <div className={`p-3 rounded-lg bg-${color}-500/20 border border-${color}-500/30`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          <p className="text-white/60">{title}</p>
        </div>
        <div
          className="absolute top-1/3 -right-8 w-32 h-32 rounded-full blur-3xl opacity-15"
          style={{ background: `radial-gradient(circle, ${gradient} 0%, transparent 70%)` }}
        />
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent" />
      </div>
    </div>
  );

  const TableCard = ({ table }: { table: TaskStatsProps['tables'][0] }) => (
    <div
      className="relative overflow-hidden cursor-pointer hover:transform hover:scale-[1.02] transition-all duration-200"
      style={{
        background: "linear-gradient(135deg, rgba(10,30,50,0.65) 0%, rgba(20,100,100,0.45) 100%)",
        backdropFilter: "blur(20px)",
        boxShadow: "rgba(0,0,0,0.2) 0px 5px 20px -5px, rgba(0,200,200,0.1) 0px 5px 12px -5px, rgba(255,255,255,0.07) 0px -1px 3px 0px inset, rgba(0,200,200,0.05) 0px 0px 12px inset, rgba(0,0,0,0.1) 0px 0px 8px inset"
      }}
    >
      <div className="relative z-10 p-5 flex items-center gap-5">
        <div className={`p-3 rounded-lg bg-${table.status === 'warning' ? 'red' : 'blue'}-500/20 border border-${table.status === 'warning' ? 'red' : 'blue'}-500/30`}>
          <Shell className={`w-5 h-5 text-${table.status === 'warning' ? 'red' : 'blue'}-400`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{table.count}</h3>
          <p className="text-white/60">{table.name}</p>
        </div>
        <div
          className="absolute top-1/3 -right-8 w-32 h-32 rounded-full blur-3xl opacity-15"
          style={{
            background: `radial-gradient(circle, var(--${table.status === 'warning' ? 'red' : 'blue'}-600) 0%, transparent 70%)`
          }}
        />
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="task-section-divider">
        <div className="divider-line" />
        <div className="divider-text">Tables associées</div>
        <div className="divider-line" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tables.map((table) => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}
