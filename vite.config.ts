import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/aphorism/',
  resolve: {
    conditions: ['import', 'module', 'browser', 'default'],
    mainFields: ['module', 'main'],
    // Fix wagmi module resolution
    dedupe: ['wagmi', '@wagmi/core'],
    alias: {
      // Path aliases
      '@': path.resolve(__dirname, 'src'),
      // Prevent Node.js-only modules from being bundled for browser
      // Use a proper stub file instead of data URI for better compatibility
      'pino': path.resolve(__dirname, 'src/utils/pino-stub.js'),
      'pino-pretty': path.resolve(__dirname, 'src/utils/pino-stub.js'),
      'pino-abstract-transport': path.resolve(__dirname, 'src/utils/pino-stub.js'),
      // Stub Node.js modules that qrcode package tries to use
      'assert': path.resolve(__dirname, 'src/utils/assert-stub.js'),
      'zlib': path.resolve(__dirname, 'src/utils/zlib-stub.js'),
      // Polyfill Node.js built-in modules for browser
      'stream': 'stream-browserify',
      'http': 'stream-http',
      'https': 'https-browserify',
      'url': 'url',
      'util': 'util',
      'buffer': 'buffer',
      'process': 'process/browser',
      // Use browser-compatible fetch instead of node-fetch
      'node-fetch': 'cross-fetch'
    }
  },
  optimizeDeps: {
    include: [
      'wagmi',
      '@wagmi/core',
      '@reown/appkit',
      '@reown/appkit-adapter-wagmi',
      'buffer',
      'process',
      'qrcode',
      'viem'
    ],
    exclude: ['pino', 'pino-pretty', 'pino-abstract-transport'], // Exclude pino packages from optimization
    esbuildOptions: {
      alias: {
        'pino': path.resolve(__dirname, 'src/utils/pino-stub.js'),
        'pino-pretty': path.resolve(__dirname, 'src/utils/pino-stub.js'),
        'pino-abstract-transport': path.resolve(__dirname, 'src/utils/pino-stub.js'),
        'assert': path.resolve(__dirname, 'src/utils/assert-stub.js'),
        'zlib': path.resolve(__dirname, 'src/utils/zlib-stub.js')
      },
      define: {
        global: 'globalThis'
      }
    }
  },
  define: {
    // Provide browser-compatible globals for Node.js modules
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.browser': true
  },
  build: {
    commonjsOptions: {
      // Exclude wagmi and related packages from commonjs transformation - they're pure ESM
      // Use negative lookahead to exclude these packages
      exclude: [/node_modules\/wagmi/, /node_modules\/@wagmi/, /node_modules\/viem/, /node_modules\/@reown/],
      include: [/qrcode/, /node_modules/],
      transformMixedEsModules: true,
      defaultIsModuleExports: 'auto',
      requireReturnsDefault: 'auto'
    },
    rollupOptions: {
      // Externalize Node.js-only modules that shouldn't be in browser bundle
      external: (id) => {
        // Exclude pino and its dependencies from browser bundle
        if (id.includes('pino') || id === 'pino') {
          return true
        }
        // Exclude Node.js modules that should be stubbed
        if (id === 'assert' || id === 'zlib') {
          return false // Don't externalize - we're stubbing them
        }
        return false
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    // Conditionally include PWA plugin - skip in production build to avoid wagmi resolution issues
    ...(process.env.NODE_ENV !== 'production' || process.env.ENABLE_PWA === 'true' ? [VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      injectRegister: 'auto', // Let VitePWA inject manifest link automatically
      manifestFilename: 'manifest.webmanifest',
      manifest: {
        name: 'Techy Reflect - Digital Wisdom Interface',
        short_name: 'Techy Reflect',
        description: 'Digital wisdom interface with tarot card readings and Chinese divination systems',
        theme_color: '#0f172a',
        background_color: '#030712',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/aphorism/',
        start_url: '/aphorism/',
        lang: 'en',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        mode: 'production',
        // Only cache files from dist, not node_modules
        globDirectory: 'dist',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}'],
        // Exclude node_modules and service worker files
        globIgnores: ['**/sw.js', '**/workbox-*.js', '**/registerSW.js'],
        // Don't scan node_modules for dependencies
        dontCacheBustURLsMatching: /\.\w{8}\./,
        // Disable dependency injection to avoid scanning node_modules
        importScripts: undefined,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      }
    })] : []),
  ],
})
