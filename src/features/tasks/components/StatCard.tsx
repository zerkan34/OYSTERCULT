import React, { ReactNode } from 'react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'indigo' | 'amber';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'blue', onClick }) => {
  return (
    <div 
      className={`task-stat-card ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center p-3 text-center">
        <p className="stat-label text-center">{title}</p>
        <h3 className="stat-value text-center">{value}</h3>
        <div className={`stat-icon-container stat-${color} mt-2`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
