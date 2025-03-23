import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Déterminer la base en fonction de l'environnement de déploiement
const getBase = () => {
  if (process.env.DEPLOY_TARGET === 'firebase') {
    return '/';
  }
  return '/OYSTERCULT/';
};

export default defineConfig({
  plugins: [react()],
  base: getBase(),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@convex': path.resolve(__dirname, './convex'),
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        includePaths: [path.resolve(__dirname, './src/styles')]
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true,
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    }
  },
  preview: {
    port: 4173,
    host: true,
    open: true,
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    manifest: true,
    rollupOptions: {
      output: {
        // Implémentation du cache busting au niveau de Vite
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            '@tanstack/react-query',
            '@tanstack/react-table',
            'framer-motion',
            'lucide-react',
            'convex/react'
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@tanstack/react-table',
      'framer-motion',
      'lucide-react',
      'convex/react'
    ]
  }
});