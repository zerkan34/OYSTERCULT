import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ModernHeader } from '@/components/ui/ModernHeader';
import { ModernSidebar } from '@/components/ui/ModernSidebar';
import { NotificationsPanel } from '@/components/notifications/NotificationsPanel';
import { EmergencyCall } from '@/features/network/components/EmergencyCall';
import { useStore } from '@/lib/store';
import { AuthPage } from '@/features/auth/pages/AuthPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { TasksPage } from '@/features/tasks/pages/TasksPage';
import { InventoryPage } from '@/features/inventory/pages/InventoryPage';
import { TraceabilityPage } from '@/features/traceability/pages/TraceabilityPage';
import { NetworkPage } from '@/features/network/pages/NetworkPage';
import { SalesPage } from '@/features/sales/pages/SalesPage';
import { PurchasesPage } from '@/features/purchases/pages/PurchasesPage';
import { AccountingPage } from '@/features/accounting/pages/AccountingPage';
import { HRPage } from '@/features/hr/pages/HRPage';
import { ConfigPage } from '@/features/config/pages/ConfigPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { ShopPage } from '@/features/shop/pages/ShopPage';
import { SuppliersPage } from '@/features/suppliers/pages/SuppliersPage';
import { SupplierCatalogPage } from '@/features/suppliers/pages/SupplierCatalogPage';
import { OrdersPage } from '@/features/suppliers/pages/OrdersPage';
import { AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient();

function App() {
  const { session, theme } = useStore();
  const [showEmergency, setShowEmergency] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!session) {
    return (
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-purple/20 to-brand-burgundy/20">
          <ModernHeader
            onShowMobileMenu={() => setShowMobileMenu(true)}
            onShowNotifications={() => setShowNotifications(true)}
            onShowEmergency={() => setShowEmergency(true)}
          />
          <div className="flex min-h-screen pt-16">
            <ModernSidebar
              showMobileMenu={showMobileMenu}
              onCloseMobileMenu={() => setShowMobileMenu(false)}
            />
            <main className="flex-1 p-6 overflow-x-hidden">
              <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/traceability" element={<TraceabilityPage />} />
                    <Route path="/network" element={<NetworkPage />} />
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/suppliers/orders" element={<OrdersPage />} />
                    <Route path="/suppliers/:supplierId/catalog" element={<SupplierCatalogPage />} />
                    <Route path="/sales" element={<SalesPage />} />
                    <Route path="/purchases" element={<PurchasesPage />} />
                    <Route path="/accounting" element={<AccountingPage />} />
                    <Route path="/hr" element={<HRPage />} />
                    <Route path="/config" element={<ConfigPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                  </Routes>
                </AnimatePresence>
              </div>
            </main>
          </div>

          <AnimatePresence>
            {showNotifications && (
              <NotificationsPanel onClose={() => setShowNotifications(false)} />
            )}
          </AnimatePresence>
          
          <EmergencyCall
            isOpen={showEmergency}
            onClose={() => setShowEmergency(false)}
          />
          
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;