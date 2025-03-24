import React, { createContext, useContext, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Context pour partager la valeur sélectionnée et onValueChange entre les composants
const SelectContext = createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {}
});

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function Select({
  label,
  value = '',
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  error,
  className,
  onValueChange
}: SelectProps) {
  const handleChange = (newValue: string) => {
    if (onChange) onChange(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleChange }}>
      <div className={cn("space-y-1", className)}>
        {label && (
          <label className="block text-sm font-medium text-white/80">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className={`
              w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg
              text-white placeholder-white/40 appearance-none
              focus:outline-none focus:ring-2 focus:ring-brand-primary/50
              ${error ? 'border-red-500' : ''}
            `}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </SelectContext.Provider>
  );
}

// Composants additionnels pour le Select
interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className }) => {
  return (
    <div className={cn("relative flex items-center justify-between w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white cursor-pointer", className)}>
      {children}
      <ChevronDown className="w-4 h-4 text-white/60" />
    </div>
  );
};

interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { value } = useContext(SelectContext);
  return <span>{value || placeholder}</span>;
};

interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  return (
    <div className={cn("absolute z-50 w-full mt-1 bg-gray-900/90 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden", className)}>
      {children}
    </div>
  );
};

interface SelectItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children, className }) => {
  const { value: selectedValue, onValueChange } = useContext(SelectContext);
  
  return (
    <div 
      className={cn(
        "px-4 py-2 cursor-pointer transition-colors hover:bg-white/10",
        selectedValue === value && "bg-white/20",
        className
      )}
      onClick={() => onValueChange(value)}
    >
      {children}
    </div>
  );
};
