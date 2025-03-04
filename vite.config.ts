import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/OYSTERCULT/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
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
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@tanstack/react-query',
            '@tanstack/react-table',
            'framer-motion',
            'lucide-react'
          ]
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@tanstack/react-table',
      'framer-motion',
      'lucide-react'
    ]
  }
});