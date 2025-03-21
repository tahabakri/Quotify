import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'image-generation': [
            '@supabase/supabase-js',
            './src/services/deepai',
            './src/services/gemini',
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    cors: true,
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'lucide-react'],
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
    },
  },
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
  },
});
