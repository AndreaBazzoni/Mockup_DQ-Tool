// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { ListOfCenters } from "./src/ListOfCenters.js";


interface Center {
  name: string;
  id: string;
  url: string;
}


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: Object.fromEntries(
      ListOfCenters.map((center: Center) => {
        const proxyPath = `/redcap-api/${center.id}/`;
        return [
          proxyPath,
          {
            target: center.url,
            changeOrigin: true,
            rewrite: (p: string) => p.replace(proxyPath, "/api/"),
          },
        ];
      })
    ),
  },
});