import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  root: "src",
  envDir: resolve(__dirname, "."),  // Load .env files from project root

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // HTML pages
        'index': resolve(__dirname, "src/pages/index.html"),
        'subscription': resolve(__dirname, "src/pages/subscription.html"),
        'email-verification': resolve(__dirname, "src/pages/email-verification.html"),
        'success': resolve(__dirname, "src/pages/success.html"),
        'demo': resolve(__dirname, "src/pages/demo.html"),
        'privacy': resolve(__dirname, "src/pages/privacy.html"),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@shared": resolve(__dirname, "src/shared"),
      "@components": resolve(__dirname, "src/components"),
    },
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    '__VUE_PROD_DEVTOOLS__': 'false'
  },

  css: {
    devSourcemap: true,
  },

  server: {
    port: 3000,
    host: "localhost",
    open: "/pages/index.html",
    hmr: true,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },

  optimizeDeps: {
    include: ['vue', 'pinia'],
  }
});
