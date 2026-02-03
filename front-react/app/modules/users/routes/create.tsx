import { CreateView } from "../views/CreateView";
import type { Route } from "./+types/index";
import { checkRouteAccess } from "@shared/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crear Usuarios - Sinergia" },
    { name: "description", content: "Crear nuevo usuario" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  checkRouteAccess(url.pathname);
  return null;
}

export default function HomeRoute() {
  return <CreateView />;
}