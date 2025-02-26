import { Link } from 'react-router-dom';
import {
  Home,
  Package,
  Network,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { resetSession } = useStore();

  const menuItems = [
    {
      label: 'PRINCIPAL',
      items: [
        { icon: Home, label: 'Tableau de bord', href: '/dashboard' },
      ],
    },
    {
      label: 'GESTION DES STOCKS',
      items: [
        { icon: Package, label: 'Inventaire', href: '/inventory' },
        { icon: Package, label: 'Stock', href: '/stock' },
      ],
    },
    {
      label: 'COMMERCIAL',
      items: [
        { icon: Network, label: 'Commandes', href: '/orders' },
        { icon: FileText, label: 'Factures', href: '/invoices' },
      ],
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-background/80 backdrop-blur-sm border-r transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <Package className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-8">
          {menuItems.map((section) => (
            <div key={section.label} className="mb-6">
              <h3 className="mb-2 px-3 text-sm font-medium text-muted-foreground">
                {section.label}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link to={item.href}>
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </div>
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="secondary"
            className="w-full text-red-500 hover:text-red-600"
            onClick={() => {
              resetSession();
              window.location.href = '/login';
            }}
          >
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  );
}
