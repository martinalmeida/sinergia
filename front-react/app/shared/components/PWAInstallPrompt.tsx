import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [favicon, setFavicon] = useState<string | null>(null);

  useEffect(() => {
    // Obtener favicon desde <link rel="icon"> (cliente)
    try {
      const link = document.querySelector(
        'link[rel="icon"]'
      ) as HTMLLinkElement | null;
      if (link?.href) setFavicon(link.href);
      else setFavicon("/web-app-manifest-192x192.png"); // fallback
    } catch {
      setFavicon("/web-app-manifest-192x192.png");
    }

    // Detectar si ya está instalado (standalone o iOS webapp)
    const checkInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkInstalled();

    // beforeinstallprompt (Chrome/Edge/Android)
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    // appinstalled
    const onAppInstalled = () => {
      setIsInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setVisible(false);
      setDeferredPrompt(null);
      if (outcome === "accepted") setIsInstalled(true);
    } catch {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled || !visible) return null;
  return (
    <div className="fixed bottom-18 lg:bottom-4 right-2 z-50">
      <button
        onClick={handleInstall}
        className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-gray-700 shadow-sm hover:bg-indigo-100"
        aria-label="Instalar Sinergia"
      >
        {favicon && (
          <img
            src={favicon}
            alt=""
            className="w-5 h-5 rounded-sm mr-2 object-cover"
          />
        )}
        Instalar Sinergia
      </button>
    </div>
  );
}