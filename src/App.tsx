import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
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
import { useMessages } from '@/features/network/hooks/useMessages';
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
import SurveillanceSimplePage from '@/features/surveillance/pages/SurveillanceSimplePage';
import SurveillancePage from '@/features/surveillance/pages/SurveillancePage';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MessageList } from '@/features/network/components/MessageList';
// Importer les styles globaux
import '@/features/auth/pages/auth-responsive.css';
import useViewportReset from './hooks/useViewportReset';
import ScrollReset from '@/components/ScrollReset';

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

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const previousPageRef = useRef<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isResponsive, setIsResponsive] = useState(false);
  const { totalUnreadCount, markAsRead } = useMessages();
  
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
    
    if (isIOSDevice) {
      document.body.classList.add('ios-device');
    }
  }, []);

  useEffect(() => {
    const checkResponsive = () => {
      setIsResponsive(window.innerWidth <= 768);
    };
    
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  useEffect(() => {
    if (!location.pathname.includes('/network/messages')) {
      previousPageRef.current = location.pathname;
    }
  }, [location.pathname]);

  const handleMessagesToggle = () => {
    if (location.pathname.includes('/network/messages')) {
      navigate(previousPageRef.current || '/dashboard');
    } else {
      navigate('/network/messages');
    }
  };

  return (
    <>
      <ModernHeader
        onShowMobileMenu={() => setShowMobileMenu(true)}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        onShowEmergency={() => setShowEmergency(true)}
        onEmergencyClick={() => setShowEmergency(true)}
        onToggleMessages={handleMessagesToggle}
        unreadMessagesCount={totalUnreadCount}
      />
      <div className="flex min-h-screen h-full">
        {/* Bouton carré en haut à gauche pour ouvrir la barre latérale */}
        <button 
          className="fixed top-6 left-6 z-50 md:hidden flex items-center justify-center w-14 h-14 rounded-lg shadow-lg transition-all duration-200"
          onClick={() => setShowMobileMenu(true)}
          aria-label="Ouvrir le menu"
          style={{
            background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
            boxShadow: "rgba(0, 0, 0, 0.45) 0px 10px 30px -5px, rgba(0, 0, 0, 0.3) 5px 5px 20px -5px, rgba(0, 210, 200, 0.25) 0px 0px 15px inset",
            WebkitTapHighlightColor: "transparent",
            transform: "translateZ(0)",
            willChange: "transform"
          }}
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
            width: '24px',
            height: '24px',
            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))'
          }}>
            <path d="M15 20 Q25 12, 35 20 T55 20 T75 20 T95 20" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M15 40 Q25 32, 35 40 T55 40 T75 40 T95 40" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M15 60 Q25 52, 35 60 T55 60 T75 60 T95 60" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M15 80 Q25 72, 35 80 T55 80 T75 80 T95 80" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
          </svg>
        </button>
        <EnhancedSidebar 
          showMobileMenu={showMobileMenu} 
          onCloseMobileMenu={() => setShowMobileMenu(false)}
          onEmergencyClick={() => setShowEmergency(true)}
          onToggleMessages={handleMessagesToggle}
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
            overflow: isResponsive && location.pathname.endsWith('/dashboard') ? "hidden" : "auto"
          }}
        >
          <main className={`flex-1 p-6 pt-12 ${
            location.pathname.endsWith('/dashboard') 
              ? 'h-full' 
              : 'h-[calc(100%-80px)]'
          } ${isResponsive && location.pathname.endsWith('/dashboard') ? 'overflow-hidden' : ''}`}>
            <div className={`max-w-7xl mx-auto h-full outlet-container ${
              location.pathname.includes('/tasks') && !isResponsive ? 'mt-[50px]' : ''
            }`} style={{ minHeight: 'calc(100% - 40px)' }}>
              <Outlet />
              <div style={{ height: '40px' }}></div>
            </div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showNotifications && (
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        )}
        {showEmergency && (
          <EmergencyCall
            isOpen={showEmergency}
            onClose={() => setShowEmergency(false)}
          />
        )}
      </AnimatePresence>

      <FloatingNotifications />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // Utiliser le hook personnalisé pour réinitialiser la position de défilement et appliquer les paramètres du viewport
  useViewportReset([location.pathname]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, [location.pathname]);  

  // Vérifier l'authentification et rediriger si nécessaire
  // Permettre l'accès direct à la page de surveillance simple sans authentification
  const isDirectSurveillanceAccess = location.pathname === '/surveillance/simple';

  return (
      <>
        <ScrollReset />
        
        <div className="min-h-screen w-screen h-screen overflow-auto">
            <Routes>
              {/* Route racine qui redirige toujours vers /auth */}
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/surveillance/simple" element={<SurveillanceSimplePage />} />
              {isAuthenticated ? (
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/stocks" element={<InventoryPage />} />
                  <Route path="/stock/:id" element={<StockPage />} />
                  <Route path="/tables/:id" element={<TableDetailsPage />} />
                  <Route path="/accounting" element={<AccountingPage />} />
                  <Route path="/invoices" element={<InvoicesPage />} />
                  <Route path="/hr" element={<HRPage />} />
                  <Route path="/network" element={<NetworkPage />} />
                  <Route path="/network/messages" element={<MessagesPage />} />
                  <Route path="/config" element={<ConfigPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/traceability" element={<TraceabilityPage />} />
                  <Route path="/traceability/storage-locations" element={<StorageLocations />} />
                  <Route path="/traceability/market-purchases" element={<MarketPurchases />} />
                  <Route path="/traceability/invoices-delivery-notes" element={<InvoicesAndDeliveryNotes />} />
                  <Route path="/traceability/batches" element={<BatchList />} />
                  <Route path="/traceability/batch-history" element={<BatchHistory searchQuery="" />} />
                  <Route path="/traceability/purification-pools" element={<PurificationPools />} />
                  <Route path="/sales" element={<SalesPage />} />
                  <Route path="/purchases" element={<PurchasesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                  <Route path="/digital-vault" element={<DigitalVaultPage />} />
                  <Route path="/suppliers/:supplierId/catalog" element={<SupplierCatalogPage />} />
                  <Route path="/suppliers/orders" element={<OrdersPage />} />
                  <Route path="/surveillance" element={<SurveillancePage />} />
                  <Route path="/analyses" element={<AnalysesPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              ) : (
                <Route path="*" element={<Navigate to="/auth" replace />} />
              )}
            </Routes>
        </div>
      </>
  );
}

function App() {
  const queryClient = new QueryClient();
  const deployTarget = import.meta.env.VITE_DEPLOY_TARGET || '';
  
  const baseUrl = '';

  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <Router basename={baseUrl}>
          <AppContent />
        </Router>
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </ConvexProvider>
  );
}

export default App;