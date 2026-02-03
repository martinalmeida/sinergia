import { EditView } from "../views/EditView";
import type { Route } from "./+types/index";
import { checkRouteAccess } from "@shared/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Editar Usuarios - Sinergia" },
    { name: "description", content: "Editar usuario" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  checkRouteAccess(url.pathname);
  return null;
}

export default function HomeRoute() {
  return <EditView />;
}