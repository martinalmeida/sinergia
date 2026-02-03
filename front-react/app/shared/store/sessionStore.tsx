import { create } from "zustand";
import {
  persist,
  type PersistStorage,
  type StorageValue,
} from "zustand/middleware";

interface SessionData {
  usuPerf: string | null;
  usuNomb: string | null;
  jwt: string | null;
}

interface SessionStore extends SessionData {
  setSession: (data: Partial<SessionData>) => Promise<void>;
  clearSession: () => Promise<void>;
}

const localStoragePersist: PersistStorage<Partial<SessionStore>> = {
  getItem: async (
    name: string
  ): Promise<StorageValue<Partial<SessionStore>> | null> => {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem(name);
      if (raw === null) return null;

      try {
        return JSON.parse(raw) as StorageValue<Partial<SessionStore>>;
      } catch {
        return raw as unknown as StorageValue<Partial<SessionStore>>;
      }
    } catch (e) {
      console.error("localStorage.getItem error:", e);
      return null;
    }
  },

  setItem: async (
    name: string,
    value: StorageValue<Partial<SessionStore>>
  ): Promise<void> => {
    try {
      if (typeof window === "undefined") return;
      if (typeof value === "string") {
        window.localStorage.setItem(name, value);
      } else {
        window.localStorage.setItem(name, JSON.stringify(value));
      }
    } catch (e) {
      console.error("localStorage.setItem error:", e);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(name);
    } catch (e) {
      console.error("localStorage.removeItem error:", e);
    }
  },
};

//Store Zustand con persistencia automática vía localStorage
export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      usuPerf: null,
      usuNomb: null,
      jwt: null,

      setSession: async (data) => {
        const entries = Object.entries(data) as [
          keyof SessionData,
          string | null,
        ][];
        for (const [key, value] of entries) {
          try {
            if (value !== null && typeof window !== "undefined") {
              window.localStorage.setItem(String(key), value);
            } else if (typeof window !== "undefined") {
              window.localStorage.removeItem(String(key));
            }
          } catch (e) {
            console.error("Error guardando key en localStorage:", key, e);
          }
          set({ [key]: value } as Pick<SessionStore, keyof SessionData>);
        }
      },

      clearSession: async () => {
        const sessionKeys = Object.keys({
          usuPerf: null,
          usuNomb: null,
          jwt: null,
        } as SessionData) as readonly (keyof SessionData)[];
        try {
          if (typeof window !== "undefined") {
            for (const key of sessionKeys) {
              window.localStorage.removeItem(String(key));
            }
            window.localStorage.removeItem("session-storage");
          }
        } catch (e) {
          console.error("Error limpiando localStorage:", e);
        }
        set({
          usuPerf: null,
          usuNomb: null,
          jwt: null,
        });
      },
    }),
    {
      name: "session-storage",
      storage: localStoragePersist,
      partialize: (state): Partial<SessionStore> => ({
        usuPerf: state.usuPerf,
        usuNomb: state.usuNomb,
        jwt: state.jwt,
      }),
    }
  )
);