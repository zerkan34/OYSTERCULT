import { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, useRoutes, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ModernHeader } from '@/components/ui/ModernHeader';
import EnhancedSidebar from '@/components/ui/EnhancedSidebar';
import { NotificationsPanel } from '@/components/notifications/NotificationsPanel';
import { EmergencyCall } from '@/features/network/components/EmergencyCall';
import { FloatingNotifications } from '@/components/notifications/FloatingNotifications';
import { useStore } from '@/lib/store';
import { routes } from './routes';
import StocksList from './components/StocksList';

// Pages
import { AuthPage } from '@/features/auth/pages/AuthPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { InventoryPage } from '@/features/inventory/pages/InventoryPage';
import { StockPage } from '@/features/inventory/pages/StockPage';
import { AccountingPage } from '@/features/accounting/pages/AccountingPage';
import { InvoicesPage } from '@/features/accounting/pages/InvoicesPage';
import { HRPage } from '@/features/hr/pages/HRPage';
import { NetworkPage } from '@/features/network/pages/NetworkPage';
import { ConfigPage } from '@/features/config/pages/ConfigPage';
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';
import { TasksPage } from '@/features/tasks/pages/TasksPage';
import { TableDetailsPage } from '@/features/tasks/pages/TableDetailsPage';
import { TraceabilityPage } from '@/features/traceability/pages/TraceabilityPage';
import { SalesPage } from '@/features/sales/pages/SalesPage';
import { PurchasesPage } from '@/features/purchases/pages/PurchasesPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { ShopPage } from '@/features/shop/pages/ShopPage';
import { SuppliersPage } from '@/features/suppliers/pages/SuppliersPage';
import { SupplierCatalogPage } from '@/features/suppliers/pages/SupplierCatalogPage';
import { OrdersPage } from '@/features/suppliers/pages/OrdersPage';
import DigitalVaultPage from '@/features/digitalvault/pages/DigitalVaultPage';
import { MessagesPage } from '@/features/network/pages/MessagesPage';
import { StorageLocations } from '@/features/traceability/components/StorageLocations';
import { MarketPurchases } from '@/features/traceability/components/MarketPurchases';
import { InvoicesAndDeliveryNotes } from '@/features/traceability/components/InvoicesAndDeliveryNotes';
import { BatchHistory } from '@/features/traceability/components/BatchHistory';
import { PurificationPools } from '@/features/traceability/components/PurificationPools';
import { BatchList } from '@/features/traceability/components/BatchList';
import { AnalysesPage } from '@/features/analyses/pages/AnalysesPage';
import { AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient();
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Composant avec accès au router
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const previousPageRef = useRef<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
    
    if (isIOSDevice) {
      document.body.classList.add('ios-device');
    }
  }, []);

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen w-screen h-screen fixed inset-0 overflow-auto">
      {location.pathname === '/auth' ? (
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      ) : (
        <>
          {isAuthenticated && (
            <>
              <ModernHeader
                onShowMobileMenu={() => setShowMobileMenu(true)}
                onToggleNotifications={() => setShowNotifications(!showNotifications)}
                onShowEmergency={() => setShowEmergency(true)}
                onEmergencyClick={() => setShowEmergency(true)}
                onToggleMessages={() => navigate('/network/messages')}
              />
              <div className="flex min-h-screen h-full">
                <EnhancedSidebar 
                  showMobileMenu={showMobileMenu} 
                  onCloseMobileMenu={() => setShowMobileMenu(false)}
                  onEmergencyClick={() => setShowEmergency(true)}
                  onToggleMessages={() => navigate('/network/messages')}
                  onToggleNotifications={() => setShowNotifications(true)}
                />

                <div 
                  className="
                  flex-1 pt-16 md:pt-16 
                  pb-4 
                  px-4 md:px-6 lg:px-8
                  ml-0 lg:ml-[4.5rem] transition-all duration-300
                  min-h-screen
                "
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
                    WebkitBackdropFilter: "blur(20px)",
                    backdropFilter: "blur(20px)",
                    willChange: "transform",
                    transform: "translate3d(0,0,0)",
                    position: "fixed",
                    inset: "0",
                    width: "100%",
                    height: "100%",
                    overflow: "auto"
                  }}
                >
                  <main className="flex-1 p-6 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                      <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                          <Route path="/" element={
                            isAuthenticated 
                              ? <Navigate to="/dashboard" replace />
                              : <Navigate to="/auth" replace />
                          } />
                          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                          <Route path="/stocks" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
                          <Route path="/stock/:id" element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
                          <Route path="/tables/:id" element={<ProtectedRoute><TableDetailsPage /></ProtectedRoute>} />
                          <Route path="/accounting" element={<ProtectedRoute><AccountingPage /></ProtectedRoute>} />
                          <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
                          <Route path="/hr" element={<ProtectedRoute><HRPage /></ProtectedRoute>} />
                          <Route path="/network" element={<ProtectedRoute><NetworkPage /></ProtectedRoute>} />
                          <Route path="/network/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
                          <Route path="/config" element={<ProtectedRoute><ConfigPage /></ProtectedRoute>} />
                          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                          <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
                          <Route path="/tables/:id" element={<ProtectedRoute><TableDetailsPage /></ProtectedRoute>} />
                          <Route path="/traceability" element={<ProtectedRoute><TraceabilityPage /></ProtectedRoute>} />
                          <Route path="/traceability/batches" element={<ProtectedRoute><BatchList /></ProtectedRoute>} />
                          <Route path="/traceability/history" element={<ProtectedRoute><BatchHistory searchQuery="" /></ProtectedRoute>} />
                          <Route path="/traceability/storage" element={<ProtectedRoute><StorageLocations /></ProtectedRoute>} />
                          <Route path="/traceability/purchases" element={<ProtectedRoute><MarketPurchases /></ProtectedRoute>} />
                          <Route path="/traceability/documents" element={<ProtectedRoute><InvoicesAndDeliveryNotes /></ProtectedRoute>} />
                          <Route path="/traceability/pools" element={<ProtectedRoute><PurificationPools /></ProtectedRoute>} />
                          <Route path="/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
                          <Route path="/purchases" element={<ProtectedRoute><PurchasesPage /></ProtectedRoute>} />
                          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                          <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
                          <Route path="/suppliers" element={<ProtectedRoute><SuppliersPage /></ProtectedRoute>} />
                          <Route path="/suppliers/catalog" element={<ProtectedRoute><SupplierCatalogPage /></ProtectedRoute>} />
                          <Route path="/suppliers/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                          <Route path="/digitalvault" element={<ProtectedRoute><DigitalVaultPage /></ProtectedRoute>} />
                          <Route path="/analyses" element={<ProtectedRoute><AnalysesPage /></ProtectedRoute>} />
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </AnimatePresence>
                    </div>
                  </main>
                </div>
              </div>

              <AnimatePresence>
                {showNotifications && (
                  <NotificationsPanel onClose={() => setShowNotifications(false)} />
                )}
              </AnimatePresence>

              {showEmergency && (
                <EmergencyCall 
                  isOpen={showEmergency}
                  onClose={() => setShowEmergency(false)} 
                />
              )}

              <FloatingNotifications />
            </>
          )}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/*" element={<AppContent />} />
          </Routes>
          <Toaster position="bottom-right" />
        </Router>
      </QueryClientProvider>
    </ConvexProvider>
  );
}

export default App;