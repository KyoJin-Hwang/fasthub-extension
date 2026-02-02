import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./public/manifest.json";
import path from "path";

export default defineConfig(({ command }) => ({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server:
    command === "serve"
      ? {
          port: 5173,
          cors: {
            origin: ["chrome-extension://bmkmodkodklhogmigogfelhoafiohmlf"],
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: [
              "Content-Type",
              "Authorization",
              "accept",
              "accept-language",
              "content-language",
            ],
          },
        }
      : undefined,
}));
