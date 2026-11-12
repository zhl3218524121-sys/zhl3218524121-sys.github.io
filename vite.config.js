import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.svg', 'robots.txt'],
      manifest: {
        name: '章海林 | 控制科学与工程 / 机器人学 / 嵌入式系统研发',
        short_name: '章海林',
        description: '章海林的个人品牌网站与作品集，专注控制科学、机器人学与嵌入式系统研发。',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#fafaf9',
        theme_color: '#1c1917',
        lang: 'zh-CN',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/apple-touch-icon.svg',
            sizes: '180x180',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // 缓存静态资源
        globPatterns: ['**/*.{js,css,html,svg,json,ico,woff,woff2}', 'rss.xml'],
        // 图片资源单独配置，缓存但不预缓存大图
        globIgnores: ['assets/bg/**', 'assets/gallery/gallery_*.png'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            // 图片资源运行时缓存
            urlPattern: ({ url }) => url.pathname.match(/\.(?:png|jpg|jpeg|gif|webp|svg)$/),
            handler: 'CacheFirst',
            options: {
              cacheName: 'site-images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30天
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // PDF 资源
            urlPattern: ({ url }) => url.pathname.endsWith('.pdf'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'pdf-cache',
              expiration: { maxEntries: 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts / 外部资源
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
        ],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/rss\.xml(?:\?|$)/],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  base: '/',
})
