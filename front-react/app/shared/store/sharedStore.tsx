import { create } from "zustand";
import {
  ConfigState,
  Home,
  HomeState,
} from "../interfaces";

//Helper para localStorage con manejo de SSR
const getStoredDarkMode = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const stored = window.localStorage.getItem("darkMode");
    if (stored === null) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return stored === "true";
  } catch (e) {
    console.error("Error leyendo darkMode desde localStorage:", e);
    return false;
  }
};

const setStoredDarkMode = (value: boolean): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem("darkMode", String(value));
    // Forzar la actualización de clases
    const html = document.documentElement;
    if (value) {
      html.classList.remove("light");
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
  } catch (e) {
    console.error("Error guardando darkMode en localStorage:", e);
  }
};

//Estado global
interface SharedState {
  configModule: ConfigState;
  homeModule: HomeState;
}

export const useSharedStore = create<SharedState>((set) => ({
  //Módulo Config
  configModule: {
    darkMode: getStoredDarkMode(),
    setDarkMode: (darkMode) => {
      setStoredDarkMode(darkMode);
      set((state) => ({
        ...state,
        configModule: { ...state.configModule, darkMode },
      }));
    },
  },
  //Módulo Home
  homeModule: {
    home: {
      usuarios: 0,
      activos: 0,
      todas: 0,
      pendientes: 0,
      proceso: 0,
      asignadas: 0,
      completas: 0,
      completadas: 0,
      cumplimiento: 0,
      mesActual: "",
      cooHoy: 0,
      cooPendientes: 0,
      cooCompletadas: 0,
      arrPendientes: [{ AMQ_CODA: "", USU_NOMB: "", CANT: 0 }],
      totalPendientes: 0,
      arrCompletadas: [{ AMQ_CODA: "", USU_NOMB: "", CANT: 0 }],
      totalCompletadas: 0,
    } as Home,
    setHome: (home) =>
      set((state) => ({ homeModule: { ...state.homeModule, home } })),
  },
}));