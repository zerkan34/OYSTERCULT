import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './layout/Sidebar';
import { Bell, Settings, User } from 'lucide-react';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-brand-dark">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-16 bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border-b border-white/10">
          <div className="h-full flex items-center justify-between px-6">
            <div className="flex-1"></div>
            
            <div className="flex-1 flex justify-center">
              <img src="/logo.png" alt="Logo" className="h-8" />
            </div>
            
            <div className="flex-1 flex items-center justify-end gap-1">
              <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors">
                <User size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
