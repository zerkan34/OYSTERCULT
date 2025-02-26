import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'sale' | 'purchase';
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Facture Restaurant La Marée',
    date: '2025-02-15',
    type: 'sale',
    amount: 1500,
    status: 'paid'
  },
  {
    id: '2',
    title: 'Facture Naissain Express',
    date: '2025-02-20',
    type: 'purchase',
    amount: 2800,
    status: 'pending'
  }
];

export function InvoiceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => 
      format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-white/60" />
            </button>
            <h2 className="text-xl font-bold text-white">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-white/60" />
            </button>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            Aujourd'hui
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-white/10 rounded-lg overflow-hidden">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="p-4 text-center text-white/60 font-medium">
              {day}
            </div>
          ))}
          {days.map((day, dayIdx) => {
            const events = getEventsForDate(day);
            const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

            return (
              <div
                key={day.toString()}
                className={`min-h-[120px] p-4 bg-white/5 transition-colors ${
                  !isSameMonth(day, currentDate) ? 'opacity-50' : ''
                } ${
                  isSelected ? 'bg-brand-burgundy/20' : 'hover:bg-white/10'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday(day) ? 'text-brand-burgundy' : 'text-white'
                }`}>
                  {format(day, 'd')}
                </div>
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`px-2 py-1 rounded text-xs mb-1 ${
                      event.type === 'sale'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
          <div className="space-y-4">
            {getEventsForDate(selectedDate).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div>
                  <div className="text-white font-medium">{event.title}</div>
                  <div className="text-sm text-white/60">
                    {event.type === 'sale' ? 'Vente' : 'Achat'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{event.amount}€</div>
                  <div className={`text-sm ${
                    event.status === 'paid' ? 'text-green-400' :
                    event.status === 'pending' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {event.status === 'paid' ? 'Payée' :
                     event.status === 'pending' ? 'En attente' :
                     'En retard'}
                  </div>
                </div>
              </div>
            ))}
            {getEventsForDate(selectedDate).length === 0 && (
              <div className="text-center text-white/60 py-4">
                Aucune facture pour cette date
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}