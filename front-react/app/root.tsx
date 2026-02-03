import { DarkModeScript } from "@shared/components/DarkModeScript";
import { PWAInstallPrompt } from "@shared/components/PWAInstallPrompt";
import { useEffect } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sinergia" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="128x128"
          href="/icon-128x128.png"
        />
        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon-192x192.png"
        />
        <Meta />
        <Links />
        <DarkModeScript />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    try {
      const existing = document.querySelector('link[rel="manifest"]');
      if (!existing) {
        const link = document.createElement("link");
        link.rel = "manifest";
        link.href = "/manifest.json";
        document.head.appendChild(link);
      }
    } catch (err) {
      console.error("[PWA] Error comprobando/inyectando manifest link", err);
    }
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((reg) => {
            console.log("[PWA] Service Worker registrado:", reg);
            console.log("[PWA] active state:", reg.active && reg.active.state);
            if (reg.waiting) console.log("[PWA] sw waiting", reg.waiting);
            if (reg.installing)
              console.log("[PWA] sw installing", reg.installing);
            try {
              if (reg.active) {
                reg.active.postMessage?.({ type: "CLIENTS_CLAIM" });
              }
            } catch (e) {
              console.error("[PWA] Error al enviar CLIENTS_CLAIM", e);
            }
          })
          .catch((err) => {
            console.error("[PWA] Falló registro SW:", err);
          });
        navigator.serviceWorker.getRegistrations().then((regs) => {
          console.log("[PWA] SW registrations (after register attempt):", regs);
        });
      });
    } else {
      console.log("[PWA] Service Worker no soportado en este navegador");
    }
  }, []);
  return (
    <>
      <PWAInstallPrompt />
      <Outlet />
    </>
  );
}