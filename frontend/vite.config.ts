import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  root: "./",
  build: {
    outDir: "/wamp64/www/sgco/app",
    cssMinify: true,
    minify: true,
    sourcemap: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Creating a chunk. Reducing the vendor chunk size
          if (id.includes("@open-ish") || id.includes("tslib")) {
            return "@open-ish";
          }
          if (
            id.includes("@fontsource-variable/caveat") ||
            id.includes("@fontsource-variable/karla") ||
            id.includes("@fontsource-variable/nunito") ||
            id.includes("@fontsource-variable/roboto")
          ) {
            return "@fontsource-variable";
          }
          if (id.includes("dayjs")) {
            return "dayjs";
          }
          if (
            id.includes("primereact") ||
            id.includes("primeflex") ||
            id.includes("primeicons")
          ) {
            return "primereact";
          }
        },
      },
    },
  },

  base: "/sgco/app",
  publicDir: "public",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      components: fileURLToPath(new URL("./src/components/", import.meta.url)),
      assets: fileURLToPath(new URL("./src/assets/", import.meta.url)),
      layouts: fileURLToPath(new URL("./src/layouts/", import.meta.url)),
      libs: fileURLToPath(new URL("./src/libs/", import.meta.url)),
      pages: fileURLToPath(new URL("./src/pages/", import.meta.url)),
    },
  },
  preview: {
    headers: {
      "Cache-Control": "public, max-age=600",
    },
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: true,
    },
  },
});
