import { readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Absolute address for canonical and link-preview tags. The deploy workflow
// passes the GitHub Pages URL, which becomes the custom domain once one is set.
const siteUrl = (process.env.SITE_URL || "https://linguastar.ai").replace(/\/+$/, "");
// Google Analytics 4 measurement ID; analytics and its cookie banner stay off without one.
const gaMeasurementId = process.env.GA_MEASUREMENT_ID || "";

export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE || "/",
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [
    react(),
    { name: "site-url", transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl) },
    {
      name: "analytics-id",
      apply: "build",
      closeBundle() {
        const file = new URL("./dist/client/analytics.js", import.meta.url);
        writeFileSync(file, readFileSync(file, "utf8").replace("__GA_MEASUREMENT_ID__", gaMeasurementId));
      },
    },
  ],
});
