import { redirect } from "react-router";
import { useSessionStore } from "../store";
import { allowedModules } from "./index";

export function checkRouteAccess(pathname: string) {
  if (typeof window === "undefined") {
    return null;
  }

  //Rutas públicas que NO requieren verificación
  const publicRoutes = ["/", "/404"];
  if (publicRoutes.includes(pathname)) {
    return null;
  }

  //Obtener usuario desde Zustand store
  const { usuPerf, jwt } = useSessionStore.getState();

  //Si no hay usuario o token, redirigir al login
  if (!usuPerf || !jwt) {
    throw redirect("/");
  }

  try {
    const userProfile = usuPerf.toLowerCase();

    //Obtener módulos permitidos
    const userModules = allowedModules[userProfile] || [];
    const hasPermission = userModules.some((module) =>
      pathname.startsWith(module.path)
    );

    if (!hasPermission) {
      throw redirect("/404");
    }

    return { usuPerf, jwt };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    throw redirect("/");
  }
}