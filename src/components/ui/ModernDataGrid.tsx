import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface DataGridProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
  }[];
  onRowClick?: (item: T) => void;
  hoverable?: boolean;
}

export function ModernDataGrid<T extends { id: string }>({ 
  data, 
  columns,
  onRowClick,
  hoverable = true
}: DataGridProps<T>) {
  return (
    <div className="glass-effect rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid border-b border-white/10" 
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((column) => (
          <div 
            key={String(column.key)} 
            className={`p-4 text-sm font-medium text-white/60 ${
              column.align === 'right' ? 'text-right' :
              column.align === 'center' ? 'text-center' : 'text-left'
            }`}
          >
            {column.header}
          </div>
        ))}
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-white/10">
        {data.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => onRowClick?.(item)}
            className={`grid relative group ${
              hoverable ? 'cursor-pointer' : ''
            }`}
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
            whileHover={hoverable ? { y: -1 } : undefined}
            transition={{ duration: 0.2 }}
          >
            {/* Hover effect background */}
            <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Neon border on hover */}
            <div className="absolute inset-0 border border-transparent group-hover:border-brand-primary/20 group-hover:shadow-neon transition-all duration-300" />

            {columns.map((column) => (
              <div 
                key={`${item.id}-${String(column.key)}`} 
                className={`p-4 relative z-10 text-white/80 group-hover:text-white transition-colors duration-300 ${
                  column.align === 'right' ? 'text-right' :
                  column.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {column.render 
                  ? column.render(item[column.key], item)
                  : String(item[column.key])
                }
              </div>
            ))}

            {/* Arrow indicator on hover */}
            {hoverable && (
              <motion.div
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
              >
                <ChevronRight size={20} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}