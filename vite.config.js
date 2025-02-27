import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      cache: false,
      include: ['./src/**/*.js', './src/**/*.jsx'],
      exclude: [],
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'sunburst',
    }),
  ],

  // server: {
  //   host: '0.0.0.0',
  //   port: 3000, // or whichever port you prefer
  // },
});
