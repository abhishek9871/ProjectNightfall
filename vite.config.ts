import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
import compression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      sitemap({
        hostname: 'https://project-nightfall.pages.dev',
        dynamicRoutes: [
          '/',
          '/trending',
          '/top-rated',
          '/categories',
          '/categories/amateur',
          '/categories/ebony',
          '/categories/lesbian',
          '/categories/group',
          '/categories/roleplay',
          '/categories/office',
          '/categories/gaming',
          '/categories/desi',
          '/categories/college',
          '/categories/teen',
          '/categories/latin',
          '/categories/romance',
          '/categories/asian',
          '/categories/couple',
          '/categories/fitness',
          '/categories/outdoor',
          '/categories/bdsm',
          '/categories/cheating',
          '/categories/massage',
          '/categories/vintage',
          '/categories/milf'
        ],
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date()
      }),
      compression(),
      VitePWA({
        registerType: 'autoUpdate',
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
    }
  };
});
