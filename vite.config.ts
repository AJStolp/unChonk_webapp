import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  root: "src",

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Web app entries
        'landing': resolve(__dirname, "src/vue-entries/landing.ts"),
        'subscription': resolve(__dirname, "src/vue-entries/subscription.ts"),
        'email-verification': resolve(__dirname, "src/vue-entries/email-verification.ts"),
        'success': resolve(__dirname, "src/vue-entries/success.ts"),
        'demo': resolve(__dirname, "src/vue-entries/demo.ts"),

        // CSS
        'globals': resolve(__dirname, "src/styles/globals.css"),
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
