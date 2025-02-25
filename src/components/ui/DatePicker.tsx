import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (date: string) => void;
  error?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  error
}: DatePickerProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg
            text-white placeholder-white/40
            focus:outline-none focus:ring-2 focus:ring-brand-primary/50
            ${error ? 'border-red-500' : ''}
          `}
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-white/40">
          <CalendarIcon size={16} />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
