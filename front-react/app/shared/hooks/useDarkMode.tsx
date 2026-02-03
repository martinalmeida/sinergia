import { useEffect, useState } from "react";
import { useSharedStore } from "../store";

export const useDarkMode = () => {
  const [isMounted, setIsMounted] = useState(false);
  const darkMode = useSharedStore((state) => state.configModule.darkMode);
  const setDarkMode = useSharedStore((state) => state.configModule.setDarkMode);

  useEffect(() => {
    setIsMounted(true);

    // Inicializar la clase en el html cuando el componente se monta
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return {
    darkMode,
    toggleDarkMode,
    isMounted,
  };
};