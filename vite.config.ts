import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        '/react',
        '/react-dom',
        '/react-router',
        '/react-router-dom',
        '/react-router-config',
        '/assets/index-b1fed066.js',
      ],
    },
  },
});
