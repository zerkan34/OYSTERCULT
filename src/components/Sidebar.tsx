import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Package,
  Truck,
  ShoppingBag,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useStore } from '@/lib/store';

const navigation = [
  { name: 'Tableau de bord', to: '/', icon: LayoutDashboard },
  { name: 'Inventaire', to: '/inventory', icon: Package },
  { name: 'Fournisseurs', to: '/suppliers', icon: Truck },
  { name: 'Commandes', to: '/orders', icon: ShoppingBag },
  { name: 'Configuration', to: '/configuration', icon: Settings },
];

export function Sidebar() {
  const { resetSession } = useStore();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      <div className="p-4">
        <h1 className="text-xl font-bold">Wind.Surf</h1>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => resetSession()}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
