import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from './App';
import './index.css';
// Importer les correctifs de compatibilité en dernier pour qu'ils remplacent tous les autres styles
import './styles/vendor-fixes.css';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>
);