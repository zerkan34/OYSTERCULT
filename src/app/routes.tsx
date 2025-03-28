import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/features/dashboard';
import { ConfigPage } from '@/features/config';
import { InventoryPage } from '@/features/inventory';
import { SuppliersPage } from '@/features/suppliers';
import { SupplierCatalogPage } from '@/features/suppliers/pages/SupplierCatalogPage';

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
      }
    ]
  }
]);
