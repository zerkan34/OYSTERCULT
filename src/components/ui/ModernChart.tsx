import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartData {
  name: string;
  [key: string]: number | string;
}

interface ChartSeries {
  key: string;
  name: string;
  color: string;
}

interface ModernChartProps {
  data: ChartData[];
  type?: 'bar' | 'line' | 'pie';
  title?: string;
  height?: number;
  series: ChartSeries[];
}

export function ModernChart({
  data,
  type = 'line',
  title,
  height = 300,
  series
}: ModernChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect p-3 rounded-lg border border-brand-primary/20">
          {label && <p className="text-white/60 text-sm mb-2">{label}</p>}
          {payload.map((entry: any, index: number) => {
            let displayValue = entry.value;
            
            // Format the value based on chart type and data
            if (type === 'pie') {
              displayValue = `${entry.value}%`;
            } else if (typeof entry.value === 'number') {
              // Check if the value looks like a currency (large numbers)
              if (entry.value > 100) {
                displayValue = entry.value.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                });
              } else {
                // For percentages and small numbers, just add decimal places
                displayValue = entry.value.toLocaleString('fr-FR', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1
                });
              }
            }

            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {displayValue}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={series[0].key}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || series[0].color}
                  className="hover:opacity-80 transition-opacity duration-300"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.3))'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)" 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.6)"
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.6)"
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {series.map((s, index) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={s.color}
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity duration-300"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.3))'
                }}
              />
            ))}
          </BarChart>
        );

      default:
        return (
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)" 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.6)"
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.6)"
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {series.map((s, index) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={{ 
                  fill: s.color, 
                  r: 4,
                  strokeWidth: 2,
                  stroke: 'rgba(0,0,0,0.3)'
                }}
                activeDot={{ 
                  r: 6, 
                  fill: s.color,
                  style: {
                    filter: 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.5))'
                  }
                }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.3))'
                }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      className="glass-effect rounded-xl p-6 hover:glass-effect-hover"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {title && (
        <h3 className="text-lg font-medium text-white mb-6">{title}</h3>
      )}

      <div style={{ height: `${height}px` }} className="mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {type === 'pie' && (
        <div className="mt-6 space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || series[0].color }}
                />
                <span className="text-white/70">{item.name}</span>
              </div>
              <span className="text-white">{item[series[0].key]}%</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}