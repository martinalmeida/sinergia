import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(),
    tsconfigPaths(),
    {
      name: "copy-pwa-files",
      closeBundle() {
        const buildClientDir = path.resolve(__dirname, "build/client");
        if (!fs.existsSync(buildClientDir)) {
          fs.mkdirSync(buildClientDir, { recursive: true });
        }
        const files = ["manifest.json", "sw.js"];
        files.forEach((file) => {
          const src = path.resolve(__dirname, "public", file);
          const dest = path.resolve(buildClientDir, file);
          
          if (fs.existsSync(src)) {
            try {
              fs.copyFileSync(src, dest);
              console.log(`✓ Copiado: ${file}`);
            } catch (error) {
              console.error(`✗ Error copiando ${file}:`, error);
            }
          } else {
            console.warn(`⚠ Archivo no encontrado: ${src}`);
          }
        });
        const iconsDir = path.resolve(__dirname, "public/icons");
        const destIconsDir = path.resolve(buildClientDir, "icons");
        
        if (fs.existsSync(iconsDir)) {
          if (!fs.existsSync(destIconsDir)) {
            fs.mkdirSync(destIconsDir, { recursive: true });
          }
          const icons = fs.readdirSync(iconsDir);
          icons.forEach((icon) => {
            const srcIcon = path.join(iconsDir, icon);
            const destIcon = path.join(destIconsDir, icon);
            try {
              fs.copyFileSync(srcIcon, destIcon);
            } catch (error) {
              console.error(`✗ Error copiando icono ${icon}:`, error);
            }
          });
          console.log(`✓ Copiados ${icons.length} iconos`);
        } else {
          console.warn("⚠ Carpeta de iconos no encontrada");
        }
      },
    },
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
      "@": path.resolve(__dirname, "app"),
      "@modules": path.resolve(__dirname, "app/modules"),
      "@shared": path.resolve(__dirname, "app/shared"),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    headers: {
      "Service-Worker-Allowed": "/",
    },
  },
  publicDir: "public",
});