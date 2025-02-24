import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Plus, Edit2, Trash2, X } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStore } from '@/lib/store';

interface ScheduleEvent {
  id: string;
  date: string;
  morning?: {
    start: string;
    end: string;
  };
  afternoon?: {
    start: string;
    end: string;
  };
}

interface ScheduleProps {
  employee: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

// Planning fictif pour la démo
const mockSchedule: ScheduleEvent[] = [
  {
    id: '1',
    date: '2025-02-19',
    morning: { start: '08:00', end: '12:00' },
    afternoon: { start: '14:00', end: '18:00' }
  },
  {
    id: '2',
    date: '2025-02-20',
    morning: { start: '08:00', end: '12:00' },
    afternoon: { start: '14:00', end: '17:00' }
  },
  {
    id: '3',
    date: '2025-02-21',
    morning: { start: '07:30', end: '12:00' }
  }
];

interface TimeSlotEditorProps {
  date: Date;
  period: 'morning' | 'afternoon';
  currentSchedule?: {
    start: string;
    end: string;
  };
  onSave: (data: { start: string; end: string }) => void;
  onDelete?: () => void;
}

function TimeSlotEditor({ date, period, currentSchedule, onSave, onDelete }: TimeSlotEditorProps) {
  const [startTime, setStartTime] = useState(currentSchedule?.start || (period === 'morning' ? '08:00' : '14:00'));
  const [endTime, setEndTime] = useState(currentSchedule?.end || (period === 'morning' ? '12:00' : '18:00'));

  const handleSave = () => {
    onSave({ start: startTime, end: endTime });
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">
          {period === 'morning' ? 'Matin' : 'Après-midi'} - {format(date, 'EEEE d MMMM', { locale: fr })}
        </h4>
        {currentSchedule && onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-white/5"
            aria-label="Supprimer le créneau"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`start-${period}`} className="block text-sm text-white/60 mb-1">
            Début
          </label>
          <input
            id={`start-${period}`}
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>
        <div>
          <label htmlFor={`end-${period}`} className="block text-sm text-white/60 mb-1">
            Fin
          </label>
          <input
            id={`end-${period}`}
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
      >
        Enregistrer
      </button>
    </div>
  );
}

export function Schedule({ employee, onClose }: ScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState(mockSchedule);
  const [editingSlot, setEditingSlot] = useState<{
    date: Date;
    period: 'morning' | 'afternoon';
  } | null>(null);
  const { session } = useStore();
  const isAdmin = session?.user?.role === 'admin';

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const getScheduleForDay = (date: Date) => {
    return schedule.find(event => isSameDay(new Date(event.date), date));
  };

  const handleSaveTimeSlot = (date: Date, period: 'morning' | 'afternoon', data: { start: string; end: string }) => {
    setSchedule(currentSchedule => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const existingEventIndex = currentSchedule.findIndex(event => event.date === dateStr);

      if (existingEventIndex >= 0) {
        // Mettre à jour un créneau existant
        const updatedSchedule = [...currentSchedule];
        updatedSchedule[existingEventIndex] = {
          ...updatedSchedule[existingEventIndex],
          [period]: data
        };
        return updatedSchedule;
      } else {
        // Créer un nouveau créneau
        return [...currentSchedule, {
          id: crypto.randomUUID(),
          date: dateStr,
          [period]: data
        }];
      }
    });
    setEditingSlot(null);
  };

  const handleDeleteTimeSlot = (date: Date, period: 'morning' | 'afternoon') => {
    setSchedule(currentSchedule => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const existingEventIndex = currentSchedule.findIndex(event => event.date === dateStr);

      if (existingEventIndex >= 0) {
        const updatedSchedule = [...currentSchedule];
        const event = updatedSchedule[existingEventIndex];
        
        if (period === 'morning') {
          delete event.morning;
        } else {
          delete event.afternoon;
        }

        // Si plus aucun créneau, supprimer l'événement
        if (!event.morning && !event.afternoon) {
          updatedSchedule.splice(existingEventIndex, 1);
        }

        return updatedSchedule;
      }
      return currentSchedule;
    });
    setEditingSlot(null);
  };

  return (
    <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 rounded-lg overflow-hidden">
      {/* En-tête avec le nom de l'employé */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-brand-burgundy rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-medium">
                {employee.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{employee.name}</h2>
              <p className="text-white/60">Planning hebdomadaire</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handlePrevWeek}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Semaine précédente"
          >
            <ChevronLeft size={20} className="text-white/60" />
          </button>
          <div className="flex items-center space-x-2">
            <CalendarIcon size={20} className="text-white/60" />
            <span className="text-white font-medium">
              {format(weekStart, 'MMMM yyyy', { locale: fr })}
            </span>
          </div>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Semaine suivante"
          >
            <ChevronRight size={20} className="text-white/60" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Grille du planning */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-7 gap-4">
            {days.map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="text-center">
                  <div className="text-sm text-white/60">
                    {format(day, 'EEEE', { locale: fr })}
                  </div>
                  <div className="text-lg font-medium text-white">
                    {format(day, 'd', { locale: fr })}
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Créneau du matin */}
                  <motion.div
                    className={`rounded-lg p-3 cursor-pointer transition-colors ${
                      getScheduleForDay(day)?.morning 
                        ? 'bg-[#00D1FF]/20' 
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setEditingSlot({ date: day, period: 'morning' })}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm font-medium text-white mb-1">Matin</div>
                    <div className="text-sm text-white/60">
                      {getScheduleForDay(day)?.morning 
                        ? `${getScheduleForDay(day)?.morning?.start} - ${getScheduleForDay(day)?.morning?.end}`
                        : '-'
                      }
                    </div>
                  </motion.div>

                  {/* Créneau de l'après-midi */}
                  <motion.div
                    className={`rounded-lg p-3 cursor-pointer transition-colors ${
                      getScheduleForDay(day)?.afternoon 
                        ? 'bg-[#00D1FF]/20' 
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setEditingSlot({ date: day, period: 'afternoon' })}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm font-medium text-white mb-1">Après-midi</div>
                    <div className="text-sm text-white/60">
                      {getScheduleForDay(day)?.afternoon 
                        ? `${getScheduleForDay(day)?.afternoon?.start} - ${getScheduleForDay(day)?.afternoon?.end}`
                        : '-'
                      }
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panneau d'édition */}
        <AnimatePresence>
          {editingSlot && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-white/10 overflow-hidden"
            >
              <div className="w-80 p-6">
                <TimeSlotEditor
                  date={editingSlot.date}
                  period={editingSlot.period}
                  currentSchedule={getScheduleForDay(editingSlot.date)?.[editingSlot.period]}
                  onSave={(data) => handleSaveTimeSlot(editingSlot.date, editingSlot.period, data)}
                  onDelete={
                    getScheduleForDay(editingSlot.date)?.[editingSlot.period]
                      ? () => handleDeleteTimeSlot(editingSlot.date, editingSlot.period)
                      : undefined
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}