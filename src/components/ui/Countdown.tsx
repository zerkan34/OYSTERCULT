import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { ExondationModal } from './ExondationModal';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 24,
    minutes: 0,
    seconds: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastExondationTime] = useState(new Date());
  const [nextNotificationTime] = useState(new Date(Date.now() + 6 * 60 * 60 * 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const totalSeconds = prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds - 1;
        
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button 
        onClick={handleClick} 
        className="p-2.5 hover:bg-white/10 rounded-lg text-yellow-400 hover:text-yellow-300 transition-all duration-300 inline-flex items-center justify-center font-medium border border-white/10 hover:border-yellow-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(250,204,21,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(250,204,21,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] focus:outline-none focus:ring-2 focus:ring-yellow-500/40 gap-2"
      >
        <Timer size={20} className="text-yellow-400" aria-hidden="true" />
        <span className="font-medium">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </button>

      <ExondationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lastExondationTime={lastExondationTime}
        nextNotificationTime={nextNotificationTime}
      />
    </>
  );
};
