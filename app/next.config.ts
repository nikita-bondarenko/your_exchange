import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  
  // Настройка заголовков для поддержки Telegram Mini App в iframe
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Разрешаем загрузку в iframe с того же домена или через Telegram
          },
          // Альтернативно можно использовать Content-Security-Policy для более точного контроля
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://web.telegram.org https://*.telegram.org;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
