import { SearchView } from "../views/HomeView";
import type { Route } from "./+types/index";
import { checkRouteAccess } from "@shared/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Buscador Global - Sinergia" },
    { name: "description", content: "Búsqueda rápida de pacientes" },
  ];
}

//Loader para verificar sesión antes de renderizar
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  checkRouteAccess(url.pathname); 
  return null;
}

export default function SearchRoute() {
  return <SearchView />;
}