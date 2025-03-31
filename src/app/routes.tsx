import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/features/dashboard';
import { ConfigPage } from '@/features/config';
import { InventoryPage } from '@/features/inventory';
import { SuppliersPage } from '@/features/suppliers';
import { SupplierCatalogPage } from '@/features/suppliers/pages/SupplierCatalogPage';
import { HRPage } from '@/features/hr/pages/HRPage';
import { NetworkPage } from '@/features/network/pages/NetworkPage';
import { PurchasesPage } from '@/features/purchases/pages/PurchasesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/configuration',
        element: <ConfigPage />
      },
      {
        path: '/inventory',
        element: <InventoryPage />
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
        path: '/hr',
        element: <HRPage />
      },
      {
        path: '/network',
        element: <NetworkPage />
      },
      {
        path: '/network/messages',
        element: <NetworkPage messageView={true} activeTab="messages" />
      },
      {
        path: '/purchases',
        element: <PurchasesPage />
      }
    ]
  }
]);
