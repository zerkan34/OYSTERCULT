import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthForm } from './features/auth/components/AuthForm';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { InventoryPage } from './features/inventory/pages/InventoryPage';
import { StockPage } from './features/inventory/pages/StockPage';
import { AccountingPage } from './features/accounting/pages/AccountingPage';
import { InvoicesPage } from './features/accounting/pages/InvoicesPage';
import { HRPage } from './features/hr/pages/HRPage';
import { NetworkPage } from './features/network/pages/NetworkPage';
import { ConfigPage } from './features/config/pages/ConfigPage';
import { NotificationsPage } from './features/notifications/pages/NotificationsPage';
import { TasksPage } from './features/tasks/pages/TasksPage';
import { TraceabilityPage } from './features/traceability/pages/TraceabilityPage';
import { SalesPage } from './features/sales/pages/SalesPage';
import { PurchasesPage } from './features/purchases/pages/PurchasesPage';
import { ProfilePage } from './features/profile/pages/ProfilePage';
import { MessagesPage } from './features/network/pages/MessagesPage';
import DigitalVaultPage from './features/digitalvault/pages/DigitalVaultPage';
import { AnalysesPage } from './features/analyses/pages/AnalysesPage';
import { BatchHistory } from './features/traceability/components/BatchHistory';
import { BatchList } from './features/traceability/components/BatchList';
import { StorageLocations } from './features/traceability/components/StorageLocations';
import { MarketPurchases } from './features/traceability/components/MarketPurchases';
import { DocumentsPage } from './features/traceability/pages/DocumentsPage';
import { PoolsPage } from './features/traceability/pages/PoolsPage';
import { ShopPage } from './features/shop/pages/ShopPage';
import { SuppliersPage } from './features/suppliers/pages/SuppliersPage';
import { SupplierCatalogPage } from './features/suppliers/pages/SupplierCatalogPage';
import { OrdersPage } from './features/suppliers/pages/OrdersPage';
import SurveillancePage from './features/surveillance/pages/SurveillancePage';

export const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/auth',
    element: <AuthForm />
  },
  {
    path: '/dashboard',
    element: <DashboardPage />
  },
  {
    path: '/inventory',
    element: <InventoryPage />
  },
  {
    path: '/stock',
    element: <StockPage />
  },
  {
    path: '/accounting',
    element: <AccountingPage />
  },
  {
    path: '/invoices',
    element: <InvoicesPage />
  },
  {
    path: '/hr',
    element: <HRPage />
  },
  {
    path: '/network',
    element: <NetworkPage />
  },
  {
    path: '/network/messages',
    element: <MessagesPage />
  },
  {
    path: '/config',
    element: <ConfigPage />
  },
  {
    path: '/notifications',
    element: <NotificationsPage />
  },
  {
    path: '/tasks',
    element: <TasksPage />
  },
  {
    path: '/traceability',
    element: <TraceabilityPage />
  },
  {
    path: '/traceability/batches',
    element: <BatchList />
  },
  {
    path: '/traceability/history',
    element: <BatchHistory searchQuery="" />
  },
  {
    path: '/traceability/storage',
    element: <StorageLocations />
  },
  {
    path: '/traceability/purchases',
    element: <MarketPurchases />
  },
  {
    path: '/traceability/documents',
    element: <DocumentsPage />
  },
  {
    path: '/traceability/pools',
    element: <PoolsPage />
  },
  {
    path: '/sales',
    element: <SalesPage />
  },
  {
    path: '/purchases',
    element: <PurchasesPage />
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/shop',
    element: <ShopPage />
  },
  {
    path: '/suppliers',
    element: <SuppliersPage />
  },
  {
    path: '/suppliers/:supplierId/catalog',
    element: <SupplierCatalogPage />
  },
  {
    path: '/suppliers/orders',
    element: <OrdersPage />
  },
  {
    path: '/digitalvault',
    element: <DigitalVaultPage />
  },
  {
    path: '/analyses',
    element: <AnalysesPage />
  },
  {
    path: '/surveillance',
    element: <SurveillancePage />
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
];
