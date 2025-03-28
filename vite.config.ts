import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Déterminer la base en fonction de l'environnement de déploiement
const getBase = () => {
  const deployTarget = process.env.VITE_DEPLOY_TARGET;
  // Pour Firebase, on utilise la racine
  return '/';
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
      scss: {
        additionalData: `@import "@styles/_variables.scss";`,
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    open: true,
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff'
    }
  },
  preview: {
    port: 4173,
    host: true,
    open: true,
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
    manifest: true,
    rollupOptions: {
      output: {
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
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
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