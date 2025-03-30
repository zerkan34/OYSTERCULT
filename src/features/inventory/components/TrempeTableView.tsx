import React from 'react';

export function TrempeTableView() {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors" style={{ opacity: 1, transform: 'none' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers text-cyan-400" aria-hidden="true">
              <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path>
              <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path>
              <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path>
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Table A-12</h3>
            <span className="text-white/60">-</span>
            <span className="text-lg font-medium text-cyan-400">Bouzigues</span>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-white/60 font-medium">Mise à l'eau</span>
              <span className="text-white font-semibold bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/20">15/11/2023</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white/60 font-medium">Récolte</span>
              <span className="text-white font-semibold bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/20">
                <span className="animate-pulse text-cyan-400">En cours</span>
              </span>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thermometer-sun text-cyan-400">
                <path d="M12 9a4 4 0 0 0-2 7.5"></path>
                <path d="M12 3v2"></path>
                <path d="m6.6 18.4-1.4 1.4"></path>
                <path d="M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>
                <path d="M4 13H2"></path>
                <path d="M6.34 7.34 4.93 5.93"></path>
              </svg>
              <span className="text-white/60">Type:</span>
              <span className="text-gray-300">Huîtres Triploïdes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gauge text-cyan-400">
                <path d="m12 14 4-4"></path>
                <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
              </svg>
              <span className="text-white/60">État:</span>
              <span className="text-gray-300">72%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">État</h3>
            <div className="space-y-1">
              <div className="grid grid-cols-10 gap-1 w-full bg-cyan-950/50">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-full h-7 rounded-[4px] border border-white/10 relative overflow-hidden cursor-pointer hover:border-cyan-400/30 transition-colors">
                    <div className="absolute top-0 right-0 bottom-0 bg-cyan-500/40" style={{ width: i < 3 ? '0%' : i === 3 ? '75%' : '100%' }}></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white/80 font-medium">{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-10 gap-1 w-full bg-cyan-950/50">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i + 10} className="w-full h-7 rounded-[4px] border border-white/10 relative overflow-hidden cursor-pointer hover:border-cyan-400/30 transition-colors">
                    <div className="absolute top-0 right-0 bottom-0 bg-cyan-500/40" style={{ width: '100%' }}></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white/80 font-medium">{i + 11}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Calibre</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shell text-cyan-400">
                    <path d="M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44"></path>
                  </svg>
                  <span className="text-white/60">Actuel:</span>
                  <span className="text-white font-semibold bg-cyan-500/10 px-3 py-1 rounded-md">N°2</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-cyan-400">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="text-white/60">Cible:</span>
                  <span className="text-white font-semibold px-3 py-1 rounded-md border border-cyan-500/20">N°3</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative h-4 bg-white/5 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex-1 border-r border-white/10 last:border-r-0"></div>
                  ))}
                </div>
                <div className="h-full bg-gradient-to-r from-blue-500 via-[#22c55e] to-orange-500 transition-all duration-300" style={{ width: '85.7143%' }}></div>
              </div>
              <div className="flex justify-between px-1 text-sm font-medium">
                <span className="text-white/60">T15</span>
                <span className="text-white/60">T30</span>
                <span className="text-white/60">N°5</span>
                <span className="text-white/60">N°4</span>
                <span className="text-cyan-400 border border-cyan-400/50 px-1 rounded">N°3</span>
                <span className="text-white/60">N°2</span>
                <span className="text-white/60">N°1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
