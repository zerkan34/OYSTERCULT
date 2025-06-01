import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './layout/Sidebar';
import { Bell, Settings, User } from 'lucide-react';
import { Countdown } from './ui/Countdown';


export function Layout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div 
      className="flex min-h-screen"
      style={{
        background: "linear-gradient(135deg, rgba(0, 10, 40, 0.97) 0%, rgba(0, 90, 90, 0.95) 100%)",
        WebkitBackdropFilter: "blur(20px)",
        backdropFilter: "blur(20px)"
      }}
    >
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md shadow-[rgba(0,0,0,0.2)_0px_5px_20px_-5px,rgba(0,200,200,0.1)_0px_5px_12px_-5px,rgba(255,255,255,0.07)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.05)_0px_0px_12px_inset,rgba(0,0,0,0.1)_0px_0px_8px_inset]">
          <div className="h-full flex items-center justify-between px-8">
            <div className="flex-1 flex items-center">
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mr-8 hidden md:block"></div>
              <Countdown />
            </div>
            
            <div className="flex-1 flex justify-center">
              <img src="/logo.png" alt="Logo" className="h-10" />
            </div>
            
            <div className="flex-1 flex items-center justify-end gap-3">
              <button className="p-2.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2"></div>
              <button className="p-2.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                <User size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 pt-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
