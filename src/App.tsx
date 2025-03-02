import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ModernHeader } from '@/components/ui/ModernHeader';
import { ModernSidebar } from '@/components/ui/ModernSidebar';
import { NotificationsPanel } from '@/components/notifications/NotificationsPanel';
import { EmergencyCall } from '@/features/network/components/EmergencyCall';
import { FloatingNotifications } from '@/components/notifications/FloatingNotifications';
import { useStore } from '@/lib/store';

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
import { AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient();

// Composant avec accès au router
function AppContent() {
  const { session, theme } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const previousPageRef = useRef<string | null>(null);
  
  // Détection de l'appareil iPhone
  const [isIOS, setIsIOS] = useState(false);
  
  useEffect(() => {
    // Détection des appareils iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
    
    // Ajouter une classe au body si c'est un appareil iOS
    if (isIOSDevice) {
      document.body.classList.add('ios-device');
      
      // Ajouter les méta-tags pour éviter le zoom sur iPhone
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
      }
      
      // Ajuster la taille de police pour les inputs afin d'éviter le zoom automatique
      const style = document.createElement('style');
      style.innerHTML = `
        @media screen and (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Mise à jour du thème
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  // Vérifier si on est sur la page des messages
  const isOnMessagesPage = location.pathname === '/network/messages';

  // Enregistrer la page précédente lorsqu'on va sur la page des messages
  useEffect(() => {
    if (isOnMessagesPage) {
      // Ne rien faire, la page est déjà enregistrée lors du clic
    } else {
      // Si on n'est pas sur la page messages, enregistrer la page actuelle 
      // pour y revenir plus tard si nécessaire
      previousPageRef.current = location.pathname;
    }
  }, [location.pathname, isOnMessagesPage]);

  // Fonction pour basculer l'affichage des notifications
  const toggleNotifications = useCallback(() => {
    setShowNotifications(prevState => !prevState);
  }, []);

  // Fonction pour basculer entre la page de messages et la page précédente
  const toggleMessagesPage = useCallback(() => {
    if (isOnMessagesPage) {
      // Si on est sur la page messages, retourner à la page précédente
      if (previousPageRef.current && previousPageRef.current !== '/network/messages') {
        navigate(previousPageRef.current);
      } else {
        // Si pas de page précédente ou si c'est aussi /network/messages, aller au dashboard
        navigate('/dashboard');
      }
    } else {
      // Sauvegarder la page actuelle et aller à la page des messages
      previousPageRef.current = location.pathname;
      navigate('/network/messages');
    }
  }, [isOnMessagesPage, navigate, location.pathname]);

  if (!session) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-purple/20 to-brand-burgundy/20">
      <ModernHeader
        onShowMobileMenu={() => setShowMobileMenu(true)}
        onToggleNotifications={toggleNotifications}
        onShowEmergency={() => setShowEmergency(true)}
        onEmergencyClick={() => setShowEmergency(true)}
        onToggleMessages={toggleMessagesPage}
      />
      <div className="flex min-h-screen h-full">
        {/* Ajouter une class spécifique pour iOS */}
        <ModernSidebar 
          showMobileMenu={showMobileMenu} 
          onCloseMobileMenu={() => setShowMobileMenu(false)}
          onEmergencyClick={() => setShowEmergency(true)}
          onToggleMessages={toggleMessagesPage}
          onToggleNotifications={() => setShowNotifications(true)}
        />

        <div className={`
          flex-1 bg-brand-dark pt-16 md:pt-16 
          ${isIOS ? 'pb-safe' : 'pb-4'} 
          ${isOnMessagesPage ? "" : "px-4 md:px-6 lg:px-8"}
          ml-0 lg:ml-[4.5rem] transition-all duration-300
        `}>
          <main className="flex-1 p-6 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/digitalvault" element={<DigitalVaultPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/stock" element={<StockPage />} />
                  <Route path="/traceability" element={<TraceabilityPage />} />
                  <Route path="/accounting" element={<AccountingPage />} />
                  <Route path="/invoices" element={<InvoicesPage />} />
                  <Route path="/hr" element={<HRPage />} />
                  <Route path="/network" element={<NetworkPage />} />
                  <Route path="/network/messages" element={<MessagesPage />} />
                  <Route path="/messages" element={<NetworkPage activeTab="messages" />} />
                  <Route path="/config" element={<ConfigPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/sales" element={<SalesPage />} />
                  <Route path="/purchases" element={<PurchasesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                  <Route path="/suppliers/orders" element={<OrdersPage />} />
                  <Route path="/suppliers/:supplierId/catalog" element={<SupplierCatalogPage />} />
                </Routes>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showNotifications && (
          <NotificationsPanel onClose={toggleNotifications} />
        )}
      </AnimatePresence>

      {showEmergency && (
        <EmergencyCall 
          isOpen={showEmergency}
          onClose={() => setShowEmergency(false)} 
        />
      )}

      <FloatingNotifications />
      <Toaster position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;