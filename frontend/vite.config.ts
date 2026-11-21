
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@aws-amplify') || id.includes('node_modules/aws-amplify')) return 'aws-auth';
          if (id.includes('node_modules/recharts')) return 'recharts';
          if (id.includes('node_modules/d3-')) return 'chart-math';
          if (id.includes('node_modules/lucide-react')) return 'icons';
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react-vendor';
        },
      },
    },
  },

  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      },
    },
    setupFiles: './src/test-setup.ts',
  },
});
