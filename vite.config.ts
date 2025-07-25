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
        hostname: 'https://nightfall.is-a.dev',
        dynamicRoutes: [
          '/',
          '/trending',
          '/categories',
          '/categories/amateur',
          '/categories/anal',
          '/categories/asian',
          '/categories/bbw',
          '/categories/big-ass',
          '/categories/big-tits',
          '/categories/blonde',
          '/categories/blowjob',
          '/categories/brunette',
          '/categories/creampie',
          '/categories/cumshot',
          '/categories/deepthroat',
          '/categories/ebony',
          '/categories/fetish',
          '/categories/hardcore',
          '/categories/interracial',
          '/categories/latina',
          '/categories/lesbian',
          '/categories/mature',
          '/categories/milf',
          '/categories/pov',
          '/categories/redhead',
          '/categories/teen',
          '/categories/threesome',
          '/categories/vintage'
        ]
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
