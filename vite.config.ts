import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import sitemap from 'vite-plugin-sitemap'; // Removed - using custom scripts
// import compression from 'vite-plugin-compression'; // Disabled for now
import { VitePWA } from 'vite-plugin-pwa';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Import route discovery logic
  const { videos } = require('./data/videos');
  const { categories } = require('./data/categories'); // Only main 8 categories
  const { specialtyClusters } = require('./src/data/specialtyClusters'); // 8 specialty clusters
  
  // Discover routes for prerendering (ALL routes for full SEO coverage)
  const discoverRoutes = () => {
    const routes = new Set<string>();

    // Static routes
    routes.add('/');
    routes.add('/categories');
    routes.add('/top-rated');

    // All category routes (main categories + specialty clusters)
    const allCategories = [...categories, ...specialtyClusters];
    allCategories.forEach((category: any) => {
      if (category.slug) routes.add(`/category/${category.slug}`);
    });

    // All video routes (all 362 videos)
    videos.forEach((video: any) => {
      if (video.id) routes.add(`/watch/${video.id}`);
    });

    return Array.from(routes);
  };
  
  return {
    plugins: [
      react(),
      // Removed vite-plugin-sitemap - using custom scripts for accurate URLs
      // compression(), // Temporarily disabled to speed up build
      // Add prerender plugin
      ...(mode === 'production' ? vitePrerenderPlugin({
        renderTarget: '#root',
        prerenderScript: path.resolve(__dirname, 'prerender.ts'),
        additionalPrerenderRoutes: discoverRoutes(),
      }) : []),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/project-nightfall\.pages\.dev\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                }
              }
            },
            {
              urlPattern: /^https:\/\/picsum\.photos\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
                }
              }
            }
          ]
        },
        manifest: {
          name: 'Project Nightfall',
          short_name: 'ProjectNightfall',
          description: 'Premium Adult Entertainment Platform',
          theme_color: '#dc2626',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon'
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
          drop_console: false,  // Keep console logs for debugging
          drop_debugger: true
        }
      }
    }
  };
});
