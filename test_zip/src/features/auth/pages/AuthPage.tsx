import React, { useState, useEffect } from 'react';
import { AuthForm } from '../components/AuthForm';
import { IntroAnimation } from '@/components/IntroAnimation';
import { AnimatePresence } from 'framer-motion';

export function AuthPage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <AnimatePresence>
        {showIntro && <IntroAnimation />}
      </AnimatePresence>
      
      <div className={`min-h-screen flex items-center justify-center transition-opacity duration-500 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <AuthForm />
      </div>
    </div>
  );
}