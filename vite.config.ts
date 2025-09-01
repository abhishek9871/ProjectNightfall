import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import sitemap from 'vite-plugin-sitemap'; // Removed - using custom scripts
import compression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      // Removed vite-plugin-sitemap - using custom scripts for accurate URLs
      compression(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'generateSW',
        workbox: {
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [
            // Exclude shared playlist routes from service worker caching
            /^\/p\//,
            /^\/s\//,

            // Exclude sitemaps and robots.txt
            /^\/sitemap\.xml$/,
            /^\/video-sitemap\.xml$/,
            /^\/category-sitemap\.xml$/,
            /^\/robots\.txt$/,
            /\.(xml|txt)$/
          ],
          globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico}'],
          globIgnores: ['**/*.{xml,txt}'],
          // Completely bypass service worker for XML/TXT files
          runtimeCaching: [{
            urlPattern: ({ url }) => url.pathname.endsWith('.xml') || url.pathname.endsWith('.txt'),
            handler: 'NetworkOnly',
          }],
          // Exclude XML files from precaching
          manifestTransforms: [
            (manifestEntries) => {
              const manifest = manifestEntries.filter(
                entry => !entry.url.endsWith('.xml') && !entry.url.endsWith('.txt')
              );
              return { manifest };
            }
          ]
        },
        manifest: {
          name: 'Project Nightfall',
          short_name: 'Nightfall',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@headlessui/react'],
          }
        }
      },
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      // Enable source maps for production debugging
      sourcemap: false,
      // Minify for production
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  };
});
