import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: isDev, // habilita PWA só no dev
      },
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "CamAudio PWA",
        short_name: "CamAudio",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0ea5e9",
        description: "PWA de exemplo com câmera e microfone",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/pwa-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
  server: isDev
    ? {
        https: {
          key: "./cert/key.pem",
          cert: "./cert/cert.pem",
        },
      }
    : undefined, // remove HTTPS local no build
});
