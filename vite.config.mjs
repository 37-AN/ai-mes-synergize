
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      }
    },
    cors: true
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VITE_API_URL': JSON.stringify('http://localhost:8081'),
  },
  optimizeDeps: {
    // Exclude node-only modules that might try to bundle non-JS assets
    exclude: ["aws-sdk", "nock", "mock-aws-s3"]
  },
  build: {
    rollupOptions: {
      // Mark these modules as external so they're not bundled
      external: ["aws-sdk", "nock", "mock-aws-s3"]
    }
  },
  esbuild: {
    // Configure .html files to be treated as raw text
    loader: {
      '.html': 'text'
    }
  },
  // Additionally, tell Vite to consider .html files as assets.
  assetsInclude: ['**/*.html'],
}); 
