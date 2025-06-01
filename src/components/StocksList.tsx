import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";
import { motion } from 'framer-motion';
import { MapPin, Box, Activity } from 'lucide-react';

type Stock = Doc<"stocks">;

export default function StocksList() {
  const stocks = useQuery(api.stocks.getAll) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
        Liste des Stocks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stocks.map((stock) => (
          <motion.div
            key={stock._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            {/* Effet de glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
            
            <div className="relative flex flex-col h-full p-6 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300 min-h-[280px]">
              <h3 className="text-xl font-bold text-white mb-4">{stock.name}</h3>
              
              <div className="flex flex-col gap-4 flex-grow">
                <div className="flex items-center gap-2 text-white/70">
                  <Box className="w-4 h-4 text-cyan-400" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    Type: {stock.type}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-white/70">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    Status: {stock.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-white/70">
                  <Box className="w-4 h-4 text-cyan-400" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    Quantité: {stock.quantity}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-white/70">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    Position: {stock.location.latitude.toFixed(6)},
                    {stock.location.longitude.toFixed(6)}
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-400/30 hover:border-cyan-400/50 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1">
                Voir détails
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
