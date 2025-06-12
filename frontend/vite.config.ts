import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '^/api/.*': {
        target: 'http://ec2-13-60-240-125.eu-north-1.compute.amazonaws.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '^/recruiter/.*': {
        target: 'http://ec2-13-60-240-125.eu-north-1.compute.amazonaws.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
